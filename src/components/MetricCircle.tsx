import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface MetricCircleProps {
  score: number;
  statusText: string;
}

export default function MetricCircle({ score, statusText }: MetricCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Elegant transition upwards to the actual score
    const duration = 1200;
    const start = 0;
    const end = score;
    const startTime = performance.now();

    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(start + easeProgress * (end - start)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [score]);

  // SVG parameters
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = animatedScore / 1000;
  const strokeDashoffset = circumference * (1 - fillPercentage);

  // Status color helpers
  const getStatusColor = () => {
    if (score >= 900) return "text-emerald-500 border-emerald-500/20";
    if (score >= 700) return "text-tertiary border-tertiary/20";
    return "text-red-500 border-red-500/20";
  };

  const getStrokeColor = () => {
    if (score >= 900) return "#10b981"; // emerald
    if (score >= 700) return "#fbbc00"; // tertiary amber
    return "#ef4444"; // red
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface-container border border-outline-variant/10 rounded-sm select-none relative overflow-hidden group">
      {/* Decorative radar pulses */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--color-tertiary)_1px,_transparent_120px)] bg-[length:16px_16px] animate-[pulse_6s_infinite]"></div>

      <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-4 block">
        Aggregate Risk Rating
      </span>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Underlay grey track */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="#2b2018"
            strokeWidth={strokeWidth}
          />
          {/* Active indicator track with custom dynamic color based on score */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke={getStrokeColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.1s ease-out, stroke 0.5s ease",
              filter: `drop-shadow(0 0 4px ${getStrokeColor()}80)`
            }}
          />
        </svg>

        {/* Center label */}
        <div className="flex flex-col items-center justify-center text-center z-10">
          <span className="text-4xl font-extrabold font-sans tracking-tight text-on-surface">
            {animatedScore}
          </span>
          <span className="text-[11px] font-mono text-on-surface-variant/60 tracking-wider mt-1 uppercase border-t border-outline-variant/30 pt-1">
            / 1000 PTS
          </span>
        </div>

        {/* Floating icon */}
        <div className="absolute top-4 right-4 text-tertiary/40">
          {score >= 800 ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500/50 animate-pulse" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-tertiary/50 animate-pulse" />
          )}
        </div>
      </div>

      {/* Security level badge */}
      <div className={`mt-6 px-4 py-1.5 border font-mono text-[10px] font-bold tracking-widest uppercase rounded-xs transition-all ${getStatusColor()}`}>
        {statusText}
      </div>
    </div>
  );
}
