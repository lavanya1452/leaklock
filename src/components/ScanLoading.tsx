import React, { useEffect, useState } from "react";
import { Terminal, Shield, Cpu, RefreshCw, Radar } from "lucide-react";

interface ScanLoadingProps {
  query: string;
  onComplete?: () => void;
}

const SCAN_STEPS = [
  "INITIALIZING CRYPTOGRAPHIC TUNNEL TO TOR ROUTERS...",
  "QUERYING 1,482 CORRUPTED DARK WEB DATABASES...",
  "SCANNING DEEP WEB FOR IDENTIFIER METRICS...",
  "RESOLVING SHADOW ID COMPROMISED IP ADDRESS CLUSTERS...",
  "PARSING HASH-SALT TABLES FROM PUBLIC EXPOSURES...",
  "COMPUTING AGGREGATE SECURITY THREAT INDEX...",
  "COMPILING REPORT UNDER PROTOCOL 7.4.2..."
];

export default function ScanLoading({ query, onComplete }: ScanLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Progress ticker
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        // Speed up over time or stay random
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Handle stepping through scan phases and logging
  useEffect(() => {
    const stepInterval = Math.ceil(100 / SCAN_STEPS.length);
    const activeStep = Math.min(Math.floor(progress / stepInterval), SCAN_STEPS.length - 1);
    
    if (activeStep !== currentStep) {
      setCurrentStep(activeStep);
      const logTime = new Date().toLocaleTimeString();
      setLogs((prev) => [
        `[${logTime}] >> ${SCAN_STEPS[activeStep]}`,
        ...prev
      ]);
    }
  }, [progress, currentStep]);

  useEffect(() => {
    // Initial boot logs
    const now = new Date().toLocaleTimeString();
    setLogs([
      `[${now}] >> DEPLOYING INTEGRATED THREAT PROBING VECTOR FOR: ${query.toUpperCase()}`,
      `[${now}] >> ESTABLISHING SYSTEM STATUS RECONNAISSANCE CLIENT STATE...`
    ]);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-surface-lowest/95 backdrop-blur-md p-6 select-none">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Radar Scanner Animation */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full border border-tertiary/15 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-tertiary/30 animate-[pulse_3s_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-tertiary animate-[spin_1.5s_linear_infinite] glow-amber"></div>
          <Radar className="w-10 h-10 text-tertiary animate-[pulse_1s_infinite]" />
        </div>

        {/* Query Indicator */}
        <div className="text-center mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant/60 block mb-1">
            Exposure Assessment in Progress
          </span>
          <h2 className="text-xl font-bold font-mono text-on-surface truncate max-w-md">
            TARGET: <span className="text-tertiary">{query}</span>
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-low border border-outline-variant/30 p-1 mb-6 rounded-xs relative">
          <div 
            className="h-3.5 bg-tertiary glow-amber transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-on-surface font-bold">
            {progress}%
          </span>
        </div>

        {/* Tactical Feed Console */}
        <div className="w-full bg-surface/80 border border-outline-variant/20 p-4 h-48 rounded-xs font-mono text-[10px] text-emerald-400 overflow-y-auto flex flex-col-reverse gap-1 shadow-inner scrollbar-none border-t-2 border-t-tertiary/30">
          {logs.map((log, index) => (
            <div key={index} className="truncate select-text">
              <span className="text-emerald-500/50">L_LOCK //</span> {log}
            </div>
          ))}
          <div className="text-tertiary animate-pulse mb-1">
            [+] EXPOSURE ENGINES SYNCHRONIZED... STATUS ACTIVE
          </div>
        </div>

        {/* Extra Security Credentials */}
        <div className="mt-6 flex gap-4 text-on-surface-variant/40 font-mono text-[9px] uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-tertiary/30" />
            <span>Encrypted Tunnel: SSL_256</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-tertiary/30" />
            <span>AI Inference Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
