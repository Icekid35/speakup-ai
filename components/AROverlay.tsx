import React, { useState, useEffect, useRef } from 'react';
import { Segment, TimedFillerWord } from '../types';
import { Eye, Mic, AlertTriangle, Frown, Hand, Zap } from 'lucide-react';

interface ProblemSpotlightProps {
  segment: Segment | null;
  currentTime: number;
  previousSegmentId: string | null;
}

interface Notification {
  id: string;
  icon: React.ReactNode;
  label: string;
  detail?: string;
  points: number;
  color: string;
}

export const ProblemSpotlight: React.FC<ProblemSpotlightProps> = ({ 
  segment,
  currentTime,
  previousSegmentId
}) => {
  // Hero alert state
  const [heroAlert, setHeroAlert] = useState<Notification | null>(null);
  
  // Side notifications
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  
  // Track which filler words we've already shown
  const shownFillersRef = useRef<Set<string>>(new Set());
  
  // Track which segment alerts we've shown
  const shownSegmentAlertsRef = useRef<string | null>(null);
  
  // Timers
  const heroTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notificationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup function
  const clearAllTimers = () => {
    if (heroTimeoutRef.current) {
      clearTimeout(heroTimeoutRef.current);
      heroTimeoutRef.current = null;
    }
    notificationTimeoutsRef.current.forEach(t => clearTimeout(t));
    notificationTimeoutsRef.current = [];
  };

  // Reset when segment changes
  useEffect(() => {
    if (!segment || segment.id === previousSegmentId) return;
    
    // New segment - clear everything
    clearAllTimers();
    setHeroAlert(null);
    setVisibleNotifications([]);
    shownFillersRef.current = new Set();
    shownSegmentAlertsRef.current = null;
    
  }, [segment?.id, previousSegmentId]);

  // REAL-TIME FILLER DETECTION - Check every frame
  useEffect(() => {
    if (!segment || segment.status === 'congruent') return;
    
    const fillerWords = segment.vocal_analysis?.filler_words;
    if (!fillerWords || fillerWords.length === 0) return;

    // Check each filler word
    fillerWords.forEach((filler: TimedFillerWord | string) => {
      // Handle both old format (string) and new format (object with time)
      const isTimedFiller = typeof filler === 'object' && filler !== null && 'time' in filler;
      
      if (isTimedFiller) {
        const timedFiller = filler as TimedFillerWord;
        const fillerId = `filler-${timedFiller.time}-${timedFiller.word}`;
        
        // Check if we're at the right time (within 0.3s window) and haven't shown it
        if (
          currentTime >= timedFiller.time - 0.1 &&
          currentTime <= timedFiller.time + 0.3 &&
          !shownFillersRef.current.has(fillerId)
        ) {
          // Mark as shown
          shownFillersRef.current.add(fillerId);
          
          // Show hero alert for filler
          showHeroAlert({
            id: fillerId,
            icon: <Mic className="w-5 h-5" />,
            label: 'FILLER DETECTED',
            detail: `"${timedFiller.word}"`,
            points: -5,
            color: '#ef4444'
          });
        }
      }
    });
  }, [currentTime, segment]);

  // SEGMENT-BASED ALERTS (non-filler issues) - Show at segment start
  useEffect(() => {
    if (!segment || segment.status === 'congruent') return;
    if (shownSegmentAlertsRef.current === segment.id) return;
    
    // Mark this segment as processed
    shownSegmentAlertsRef.current = segment.id;

    const notifications: Notification[] = [];
    let heroCandidate: Notification | null = null;

    // Check if we have timed fillers (if so, don't show filler in segment alerts)
    const hasTimedFillers = segment.vocal_analysis?.filler_words?.some(
      (f: any) => typeof f === 'object' && 'time' in f
    );

    // Eye contact issues
    if (segment.visual_analysis?.eye_contact === 'poor') {
      heroCandidate = {
        id: `eye-${segment.id}`,
        icon: <Eye className="w-5 h-5" />,
        label: 'EYE CONTACT LOST',
        detail: 'Look at the camera',
        points: -15,
        color: '#ef4444'
      };
    } else if (segment.visual_analysis?.eye_contact === 'inconsistent') {
      notifications.push({
        id: `eye-${segment.id}`,
        icon: <Eye className="w-4 h-4" />,
        label: 'EYE CONTACT',
        points: -8,
        color: '#f59e0b'
      });
    }

    // Energy issues
    if (segment.vocal_analysis?.energy_level === 'low') {
      if (!heroCandidate) {
        heroCandidate = {
          id: `energy-${segment.id}`,
          icon: <Zap className="w-5 h-5" />,
          label: 'LOW ENERGY',
          detail: 'Project your voice',
          points: -12,
          color: '#ef4444'
        };
      } else {
        notifications.push({
          id: `energy-${segment.id}`,
          icon: <Zap className="w-4 h-4" />,
          label: 'LOW ENERGY',
          points: -12,
          color: '#ef4444'
        });
      }
    }

    // Posture issues
    if (segment.visual_analysis?.posture === 'slouched') {
      notifications.push({
        id: `posture-${segment.id}`,
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'POSTURE',
        points: -8,
        color: '#f59e0b'
      });
    }

    // Gesture issues
    if (segment.visual_analysis?.gestures === 'nervous') {
      notifications.push({
        id: `gesture-${segment.id}`,
        icon: <Hand className="w-4 h-4" />,
        label: 'NERVOUS GESTURE',
        points: -5,
        color: '#f59e0b'
      });
    }

    // Pace issues
    if (segment.vocal_analysis?.pace === 'too_fast') {
      notifications.push({
        id: `pace-${segment.id}`,
        icon: <Mic className="w-4 h-4" />,
        label: 'TOO FAST',
        points: -5,
        color: '#f59e0b'
      });
    } else if (segment.vocal_analysis?.pace === 'too_slow') {
      notifications.push({
        id: `pace-${segment.id}`,
        icon: <Mic className="w-4 h-4" />,
        label: 'TOO SLOW',
        points: -5,
        color: '#f59e0b'
      });
    }

    // Facial expression
    if (segment.visual_analysis?.facial_expression === 'flat') {
      notifications.push({
        id: `face-${segment.id}`,
        icon: <Frown className="w-4 h-4" />,
        label: 'FLAT EXPRESSION',
        points: -5,
        color: '#f59e0b'
      });
    }

    // Untimed filler words (fallback for old format)
    if (!hasTimedFillers && segment.vocal_analysis?.filler_words?.length) {
      const fillers = segment.vocal_analysis.filler_words as unknown as string[];
      if (!heroCandidate) {
        heroCandidate = {
          id: `filler-${segment.id}`,
          icon: <Mic className="w-5 h-5" />,
          label: 'FILLER DETECTED',
          detail: `"${fillers.slice(0, 2).join('", "')}"`,
          points: fillers.length * -5,
          color: '#ef4444'
        };
      }
    }

    // Show hero alert if we have one (and no timed filler is about to show)
    if (heroCandidate && !hasTimedFillers) {
      showHeroAlert(heroCandidate);
    }

    // Show side notifications with stagger
    notifications.forEach((notif, index) => {
      const timeout = setTimeout(() => {
        addSideNotification(notif);
      }, 500 + index * 1200); // Stagger by 1.2s
      notificationTimeoutsRef.current.push(timeout);
    });

  }, [segment?.id]);

  // Helper: Show hero alert
  const showHeroAlert = (alert: Notification) => {
    // Clear any existing hero timeout
    if (heroTimeoutRef.current) {
      clearTimeout(heroTimeoutRef.current);
    }
    
    setHeroAlert(alert);
    
    // Auto-hide after 2s
    heroTimeoutRef.current = setTimeout(() => {
      setHeroAlert(null);
    }, 2000);
  };

  // Helper: Add side notification
  const addSideNotification = (notif: Notification) => {
    setVisibleNotifications(prev => {
      // Avoid duplicates
      if (prev.some(n => n.id === notif.id)) return prev;
      // Keep max 4
      const updated = [...prev, notif].slice(-4);
      return updated;
    });

    // Auto-remove after 3.5s
    const timeout = setTimeout(() => {
      setVisibleNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 3500);
    notificationTimeoutsRef.current.push(timeout);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <>
      {/* HERO ALERT - Center */}
      {heroAlert && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Flash background */}
          <div 
            className="absolute inset-0 animate-hero-flash"
            style={{ 
              background: `radial-gradient(circle at 50% 40%, ${heroAlert.color}25 0%, transparent 50%)`
            }}
          />
          
          {/* Alert card */}
          <div 
            className="relative animate-hero-in px-10 py-6 rounded-2xl border-2 flex flex-col items-center gap-3 bg-white shadow-2xl"
            style={{
              borderColor: heroAlert.color,
              boxShadow: `0 0 40px ${heroAlert.color}30, 0 8px 32px rgba(0,0,0,0.12)`
            }}
          >
            {/* Icon */}
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${heroAlert.color}18`, color: heroAlert.color }}
            >
              {heroAlert.icon}
            </div>
            
            {/* Title */}
            <h2 
              className="text-xl font-mono font-bold tracking-wider"
              style={{ color: heroAlert.color }}
            >
              {heroAlert.label}
            </h2>
            
            {/* Detail */}
            {heroAlert.detail && (
              <p className="text-slate-700 text-lg font-medium">
                {heroAlert.detail}
              </p>
            )}
            
            {/* Points */}
            <div 
              className="mt-1 px-5 py-1.5 rounded-full font-mono font-bold text-lg"
              style={{ 
                backgroundColor: `${heroAlert.color}15`,
                color: heroAlert.color
              }}
            >
              {heroAlert.points} POINTS
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION STACK - Right side */}
      <div className="fixed top-[420px] right-8 z-40 flex flex-col gap-2.5 pointer-events-none">
        {visibleNotifications.map((notif) => (
          <div
            key={notif.id}
            className="animate-notif-in flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-white shadow-lg"
            style={{
              borderColor: `${notif.color}50`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.08), 0 0 12px ${notif.color}12`
            }}
          >
            {/* Icon */}
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${notif.color}15`, color: notif.color }}
            >
              {notif.icon}
            </div>
            
            {/* Label */}
            <span 
              className="font-mono font-bold text-xs tracking-wide flex-1 text-slate-700"
            >
              {notif.label}
            </span>
            
            {/* Points */}
            <span 
              className="font-mono font-bold text-sm"
              style={{ color: notif.color }}
            >
              {notif.points}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};