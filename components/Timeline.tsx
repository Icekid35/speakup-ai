import React, { useRef } from 'react';
import { Segment } from '../types';

interface TimelineProps {
  duration: number;
  segments: Segment[];
  currentTime: number;
  onSeek: (time: number) => void;
  selectedSegmentId: string | null;
}

export const Timeline: React.FC<TimelineProps> = ({ duration, segments, currentTime, onSeek, selectedSegmentId }) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration === 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percentage * duration);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-[10px] font-mono text-indigo-600 uppercase tracking-[0.2em] font-bold">SPEECH TIMELINE</h3>
        <span className="text-[10px] font-mono text-slate-500 font-bold">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      <div
        ref={timelineRef}
        className="relative w-full h-8 bg-slate-100 rounded-md cursor-pointer border border-slate-200 overflow-visible group"
      >
        <div className="absolute inset-0 overflow-hidden rounded-md" onClick={handleTimelineClick}>
          {/* Segments */}
          {segments.map((segment) => {
            const left = (segment.start_time / duration) * 100;
            const width = ((segment.end_time - segment.start_time) / duration) * 100;
            const isCongruent = segment.status === 'congruent';
            const isSelected = segment.id === selectedSegmentId;

            return (
              <div
                key={segment.id}
                className={`absolute top-0 bottom-0 h-full transition-all duration-300
                  ${isCongruent
                    ? 'bg-emerald-400/70 border-r border-white/60'
                    : 'bg-rose-400/70 border-r border-white/60'}
                  ${isSelected ? 'brightness-110 z-10' : 'z-0'}
                `}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              >
                {/* Top highlight bar for selected segment */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-600"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-indigo-600 z-20 pointer-events-none transition-all duration-75 ease-linear"
          style={{ left: `${progressPercentage}%` }}
        >
          <div className="absolute -top-1.5 -left-[4px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-md"></div>
        </div>
      </div>
    </div>
  );
};