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
 * Generate WAV audio Blob from local server PCM audio endpoint
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

    // Decode base64 audio payload
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Check if bytes already contains RIFF WAV header
    let wavBytes = bytes;
    if (bytes[0] !== 82 || bytes[1] !== 73 || bytes[2] !== 70 || bytes[3] !== 70) {
      wavBytes = writeWavHeader(bytes, 24000);
    }
    return new Blob([wavBytes], { type: 'audio/wav' });

  } catch (error) {
    console.error("Local TTS Error:", error);
    return new Blob([], { type: 'audio/wav' });
  }
};

