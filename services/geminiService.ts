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

export const analyzeVideo = async (
  blob: Blob,
  mode: 'full' | 'drill' = 'full',
  context: DrillContext | null = null,
  videoDuration?: number
): Promise<SpeakUpAnalysis> => {
  const dur = videoDuration && videoDuration > 0 ? Math.round(videoDuration) : 60;
  const videoBase64 = await blobToBase64(blob);

  const userApiKey = typeof window !== 'undefined' ? (localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key')) : null;
  const userModel = typeof window !== 'undefined' ? (localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model')) : null;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoBase64,
      mimeType: blob.type || "video/mp4",
      mode,
      context,
      videoDuration: dur,
      userApiKey: userApiKey || undefined,
      userModel: userModel || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error || "Failed to analyze video");
  }

  return await res.json();
};


export const generateDebriefScript = async (analysis: SpeakUpAnalysis): Promise<string> => {
  try {
    const res = await fetch("/api/debrief-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysis }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate debrief script");
    }

    const data = await res.json();
    return data.script || "Your voice is flat and you look nervous. Sit up straight, take a deep breath, and say it like you mean it. Try again.";
  } catch (error) {
    console.error("Script Gen Error:", error);
    return "Great effort, but you need more energy. Check your posture and try again.";
  }
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, companyTier, history, lastUserTranscript }),
  });
  if (!res.ok) {
    throw new Error("Failed to process interview turn");
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
  const userApiKey = typeof window !== 'undefined' ? (localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key')) : null;
  const userModel = typeof window !== 'undefined' ? (localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model')) : null;

  const res = await fetch("/api/interview-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, companyTier, history, userApiKey: userApiKey || undefined, userModel: userModel || undefined }),
  });
  if (!res.ok) {
    throw new Error("Failed to generate interview summary");
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ triggerReason, recentTranscript, fillerCount, wpm }),
  });
  if (!res.ok) {
    throw new Error("Failed to generate coach intervention");
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
  const userApiKey = typeof window !== 'undefined'
    ? (localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key'))
    : null;
  const userModel = typeof window !== 'undefined'
    ? (localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model'))
    : null;

  const res = await fetch("/api/script-doctor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rawScript,
      targetAudience,
      userApiKey: userApiKey || undefined,
      userModel: userModel || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Script doctor request failed' }));
    throw new Error(err.error || 'Failed script doctor optimization');
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
  try {
    const res = await fetch("/api/realtime-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics),
    });

    if (!res.ok) {
      throw new Error("Realtime feedback endpoint error");
    }

    return await res.json();
  } catch (err) {
    console.error("Realtime feedback request error:", err);
    return {
      suggestion: "Maintain steady eye contact and articulate clearly.",
      category: "tone",
      statusColor: "green",
    };
  }
};
