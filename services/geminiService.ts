import { SpeakUpAnalysis, DrillContext } from "../types";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getUserModel = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model') || undefined;
};

export const getSavedApiKey = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key') || undefined;
};

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = getSavedApiKey();
  if (key) {
    headers["x-gemini-api-key"] = key;
  }
  return headers;
};

const handleFetchError = async (res: Response, fallbackMsg: string): Promise<never> => {
  const data = await res.json().catch(() => ({ error: `${fallbackMsg} (Status ${res.status})` }));
  const errMsg = data.error || `${fallbackMsg} (Status ${res.status})`;
  const err: any = new Error(errMsg);
  if (
    res.status === 401 ||
    res.status === 403 ||
    errMsg.toLowerCase().includes("api key") ||
    errMsg.toLowerCase().includes("key required") ||
    errMsg.toLowerCase().includes("unauthorized") ||
    errMsg.toLowerCase().includes("revoked")
  ) {
    err.isApiKeyError = true;
  }
  throw err;
};

export const extractVideoFramesClient = (blob: Blob, frameCount: number = 5): Promise<string[]> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      const url = URL.createObjectURL(blob);
      video.src = url;

      const frames: string[] = [];

      video.onloadedmetadata = async () => {
        try {
          const duration = video.duration && isFinite(video.duration) ? video.duration : 10;
          const canvas = document.createElement('canvas');
          const maxDim = 512;
          const vw = video.videoWidth || 640;
          const vh = video.videoHeight || 360;
          const scale = Math.min(1, maxDim / Math.max(vw, vh));
          canvas.width = Math.round(vw * scale);
          canvas.height = Math.round(vh * scale);
          const ctx = canvas.getContext('2d');

          const timestamps: number[] = [];
          for (let i = 0; i < frameCount; i++) {
            timestamps.push(((i + 0.5) / frameCount) * duration);
          }

          for (const t of timestamps) {
            await new Promise<void>((res) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                  const base64 = dataUrl.split(',')[1];
                  if (base64) frames.push(base64);
                }
                res();
              };
              video.addEventListener('seeked', onSeeked);
              video.currentTime = Math.min(t, duration - 0.1);
            });
          }
          URL.revokeObjectURL(url);
          resolve(frames);
        } catch {
          URL.revokeObjectURL(url);
          resolve([]);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve([]);
      };
    } catch {
      resolve([]);
    }
  });
};

export const analyzeVideo = async (
  blob: Blob,
  mode: 'full' | 'drill' = 'full',
  context: DrillContext | null = null,
  videoDuration?: number
): Promise<SpeakUpAnalysis> => {
  const dur = videoDuration && videoDuration > 0 ? Math.round(videoDuration) : 60;
  const videoBase64 = await blobToBase64(blob);

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      videoBase64,
      mimeType: blob.type || "video/mp4",
      mode,
      context,
      videoDuration: dur,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Video analysis failed");
  }

  return await res.json();
};

export const generateDebriefScript = async (analysis: SpeakUpAnalysis): Promise<string> => {
  const res = await fetch("/api/debrief-script", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      analysis,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Failed to generate debrief script");
  }

  const data = await res.json();
  return data.script || "Your voice dropped right when it mattered most. Sit up straight, take a deep breath, and say it like you mean it.";
};

export interface InterviewStepResponse {
  evaluation: {
    starScore: number;
    strengths: string;
    areasToImprove: string;
    deliveryRating: "Needs Focus" | "Solid" | "Exceptional";
  };
  nextQuestion: string;
  coachTip: string;
  base64Audio?: string | null;
}

export const fetchInterviewStep = async (
  role: string,
  companyTier: string,
  history: any[],
  lastUserTranscript: string
): Promise<InterviewStepResponse> => {
  const res = await fetch("/api/interview-step", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      role,
      companyTier,
      history,
      lastUserTranscript,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Failed to process interview turn");
  }

  return await res.json();
};

export interface InterviewSummaryResponse {
  overallScore: number;
  ratingLabel: string;
  spokenDebrief: string;
  strengths: string[];
  improvements: string[];
  examinerAdvice: string;
  base64Audio?: string | null;
}

export const fetchInterviewSummary = async (
  role: string,
  companyTier: string,
  history: any[]
): Promise<InterviewSummaryResponse> => {
  const res = await fetch("/api/interview-summary", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      role,
      companyTier,
      history,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Failed to generate interview summary");
  }

  return await res.json();
};

export interface CoachInterventionResponse {
  spokenScript: string;
  suggestedPhrasing: string;
  focusArea: "Posture & Presence" | "Eliminate Fillers" | "Pacing & Rhythm" | "Vocal Resonance";
  base64Audio?: string | null;
}

export const fetchCoachIntervention = async (
  triggerReason: string,
  recentTranscript: string,
  fillerCount: number,
  wpm: number
): Promise<CoachInterventionResponse> => {
  const res = await fetch("/api/coach-intervene", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      triggerReason,
      recentTranscript,
      fillerCount,
      wpm,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Failed to generate coach intervention");
  }

  return await res.json();
};

export interface ScriptDoctorLine {
  id: string;
  text: string;
  stressWords: string[];
  deliveryCue: string;
  rhetoricDevice: string;
}

export interface ScriptDoctorResponse {
  overallHookRating: string;
  teleprompterLines: ScriptDoctorLine[];
}

export const fetchScriptDoctor = async (
  rawScript: string,
  targetAudience: string
): Promise<ScriptDoctorResponse> => {
  const res = await fetch("/api/script-doctor", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      rawScript,
      targetAudience,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Failed script doctor optimization");
  }

  return await res.json();
};

export interface RealtimeFeedbackRequest {
  recentTranscript: string;
  paceWpm: number;
  energyLevel: "low" | "medium" | "high";
  pitchVariation: "monotone" | "varied" | "excessive";
  fillerCount: number;
  currentFillers: string[];
}

export interface RealtimeFeedbackResponse {
  suggestion: string;
  category: "tone" | "pace" | "fillers" | "energy";
  statusColor: "green" | "amber" | "red";
}

export const getRealtimeFeedback = async (
  metrics: RealtimeFeedbackRequest
): Promise<RealtimeFeedbackResponse> => {
  const res = await fetch("/api/realtime-feedback", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      ...metrics,
      userApiKey: getSavedApiKey(),
      userModel: getUserModel(),
    }),
  });

  if (!res.ok) {
    await handleFetchError(res, "Realtime feedback failed");
  }

  return await res.json();
};
