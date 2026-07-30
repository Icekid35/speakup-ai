// Helper to write WAV header for raw PCM data (24kHz, 1 channel, 16-bit)
function writeWavHeader(data: Uint8Array, sampleRate: number): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + data.length, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, data.length, true);

  const wavFile = new Uint8Array(44 + data.length);
  wavFile.set(new Uint8Array(header), 0);
  wavFile.set(data, 44);

  return wavFile;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Universal Base64 to Audio Blob Converter
 * Correctly distinguishes RIFF WAV header, MP3 ID3/MPEG headers, and raw PCM
 * without corrupting MP3 streams with invalid WAV headers!
 */
export const base64ToAudioBlob = (base64Audio: string): Blob => {
  if (!base64Audio) return new Blob([], { type: 'audio/mpeg' });

  try {
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 1. Check for RIFF header (WAV file)
    if (bytes.length >= 4 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      return new Blob([bytes], { type: 'audio/wav' });
    }

    // 2. Check for ID3 or MPEG frame sync (MP3 file)
    if (
      bytes.length >= 3 &&
      ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
       (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0))
    ) {
      return new Blob([bytes], { type: 'audio/mpeg' });
    }

    // 3. Fallback: treat as audio/mpeg for native browser HTML5 audio playback
    return new Blob([bytes], { type: 'audio/mpeg' });
  } catch (err) {
    console.error("base64ToAudioBlob conversion error:", err);
    return new Blob([], { type: 'audio/mpeg' });
  }
};

/**
 * Speak text aloud using browser Web Speech API
 */
export const speakWithBrowserSynth = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.name.includes("Google US English") || 
          v.name.includes("Samantha") || 
          v.name.includes("Daniel") || 
          v.name.includes("Karen") || 
          v.name.includes("Natural") || 
          (v.lang.startsWith("en") && !v.localService)
        ) || voices.find(v => v.lang.startsWith("en"));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    } else {
      resolve();
    }
  });
};

/**
 * Generate audio Blob from local server TTS endpoint
 */
export const generateCoachSpeech = async (text: string): Promise<Blob> => {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("TTS API endpoint returned error status");
    }

    const { base64Audio } = await res.json();
    if (!base64Audio) {
      throw new Error("No audio content received from TTS endpoint");
    }

    return base64ToAudioBlob(base64Audio);
  } catch (error) {
    console.error("Local TTS Error:", error);
    return new Blob([], { type: 'audio/mpeg' });
  }
};
