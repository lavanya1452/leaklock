import React, { useState } from "react";
import { Activity } from "lucide-react";

interface TimelineData {
  time: string;
  count: number;
  highlighted?: boolean;
}

const DEFAULT_TIMELINE: TimelineData[] = [
  { time: "04:00", count: 28 },
  { time: "06:00", count: 35 },
  { time: "08:00", count: 18 },
  { time: "10:00", count: 42 },
  { time: "12:00", count: 76 },
  { time: "14:00", count: 50 },
  { time: "16:00", count: 88, highlighted: true },
  { time: "18:00", count: 45 },
  { time: "20:00", count: 30 },
  { time: "22:00", count: 22 },
  { time: "00:00", count: 15 },
];

export default function BarChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full p-6 bg-surface-container border border-outline-variant/10 rounded-sm select-none relative group">
      {/* Title & Live Feed pulse */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1">
            Real-Time Identity Monitoring
          </span>
          <span className="text-xs text-on-surface-variant/50 font-sans">
            Global exposure & credential surfacing trends
          </span>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 border border-tertiary/20 bg-tertiary-container text-tertiary font-mono text-[9px] tracking-widest rounded-xs select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
          <span>LIVE FEED</span>
        </div>
      </div>

      {/* Bar graph canvas */}
      <div className="flex-grow flex items-end gap-2 md:gap-3 h-36 pt-4 border-b border-outline-variant/25 pb-1 relative">
        {hoveredBar !== null && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-surface-highest border border-outline-variant/40 px-3 py-1 text-[10px] font-mono rounded-xs z-10 transition-all pointer-events-none text-tertiary text-center glow-amber">
            Scan Activity: {DEFAULT_TIMELINE[hoveredBar].count} dark web nodes cataloged @ {DEFAULT_TIMELINE[hoveredBar].time}
          </div>
        )}

        {DEFAULT_TIMELINE.map((item, idx) => {
          // Height scale calculation (max count is 88)
          const heightPercent = `${(item.count / 95) * 100}%`;
          const isHighlighted = item.highlighted;

          return (
            <div 
              key={item.time} 
              className="flex-grow flex flex-col items-center group/bar cursor-pointer"
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="w-full relative flex items-end h-32 justify-center">
                <div 
                  className={`w-full max-w-[20px] rounded-t-xs transition-all duration-500 ease-out origin-bottom ${
                    isHighlighted 
                      ? "bg-tertiary glow-amber hover:opacity-100" 
                      : "bg-surface-highest group-hover/bar:bg-primary/40"
                  }`}
                  style={{ 
                    height: heightPercent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X Axis Time Labels */}
      <div className="flex justify-between text-[10px] font-mono text-on-surface-variant/60 tracking-wider pt-2 px-1">
        <span>04:00</span>
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
        <span>00:00</span>
      </div>
    </div>
  );
}
