export interface SpeakUpAnalysis {
  mode: "full" | "drill";
  analysis_id: string;
  video_metadata: {
    duration_sec: number;
    notes?: string;
  };
  global_context?: {
    detected_intent: string;
    overall_tone_critique: string;
  };
  overall: {
    congruence_score: number;
    verbal_score: number;
    vocal_score: number;
    visual_score: number;
    strengths: string[];
    improvements: string[];
  };
  segments: Segment[];
}

export type AuraAnalysis = SpeakUpAnalysis;

export interface TimedFillerWord {
  word: string;
  time: number; // timestamp in seconds from video start
}

export interface Segment {
  id: string;
  start_time: number;
  end_time: number;
  transcript: string;
  better_phrasing: string | null;
  delivery_cue: string | null;
  rewrite_reason: string | null;
  score: number;
  status: "congruent" | "dissonant";
  category: "verbal" | "vocal" | "visual" | "multimodal";
  verbal_score: number;
  vocal_score: number;
  visual_score: number;
  observation: string;
  advice: string;
  
  // Detailed coaching data for HUD
  vocal_analysis?: {
    pace: "too_fast" | "too_slow" | "good";
    pitch_variation: "monotone" | "varied" | "excessive";
    filler_words: TimedFillerWord[];
    energy_level: "low" | "medium" | "high";
    tip: string;
  };
  
  visual_analysis?: {
    eye_contact: "poor" | "inconsistent" | "strong";
    posture: "slouched" | "stiff" | "confident";
    gestures: "absent" | "nervous" | "purposeful";
    facial_expression: "flat" | "tense" | "engaging";
    tip: string;
  };

  // Director's Cut Fields
  drillBlob?: Blob;
  drillBlobUrl?: string;
  useDrillVersion: boolean;
}

export interface DrillContext {
  segmentId: string;
  observation: string;
  advice: string;
  transcript: string;
  better_phrasing: string | null;
  delivery_cue: string | null;
}