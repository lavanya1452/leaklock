import React, { useState } from "react";
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  Terminal, 
  ArrowRight,
  Database,
  Lock,
  Globe
} from "lucide-react";
import { Breach } from "../types";

interface AnalyzeModalProps {
  breach: Breach;
  onClose: () => void;
  onResolve: (id: string) => void;
}

export default function AnalyzeModal({ breach, onClose, onResolve }: AnalyzeModalProps) {
  const [executing, setExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleExecuteMitigation = () => {
    setExecuting(true);
    
    // Simulate tactical logs executing
    const actions = [
      "Securing compromised OAuth channels...",
      "Generating high-entropy salt-hash password keys...",
      "Flushing stale biometric sessions from affected host...",
      "Broadcasting secure update to global identity vaults...",
      "Remediation vector executed successfully!"
    ];

    actions.forEach((act, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[+] ${act}`]);
        if (idx === actions.length - 1) {
          setTimeout(() => {
            onResolve(breach.id);
            setExecuting(false);
            onClose();
          }, 1000);
        }
      }, (idx + 1) * 600);
    });
  };

  const isResolved = breach.status === "RESOLVED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-lowest/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-surface-low border border-outline-variant/30 rounded-sm overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-surface-lowest border-b border-outline-variant/15">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-tertiary-container border border-tertiary/20 flex items-center justify-center">
              <Database className="w-4 h-4 text-tertiary" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-on-surface uppercase">
                {breach.sourceEntity} Exposure
              </h3>
              <p className="text-[10px] font-mono text-on-surface-variant/60 uppercase">
                Threat Dossier // ID: {breach.id}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-high p-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-grow space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Severity & Date Banner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-outline-variant/10 p-3 flex flex-col justify-center">
              <span className="font-mono text-[9px] text-on-surface-variant/60 block mb-1 uppercase tracking-wider">
                Exposed Index Date
              </span>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-primary">
                <Calendar className="w-3.5 h-3.5 text-tertiary/60" />
                <span>{breach.detectionDate}</span>
              </div>
            </div>
            <div className="bg-surface border border-outline-variant/10 p-3 flex flex-col justify-center">
              <span className="font-mono text-[9px] text-on-surface-variant/60 block mb-1 uppercase tracking-wider">
                Severity Score Index
              </span>
              <div>
                <span className={`inline-block px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-xs border ${
                  breach.severity === "CRITICAL"
                    ? "bg-error-container text-error border-error/20"
                    : breach.severity === "ELEVATED"
                    ? "bg-tertiary-container text-tertiary border-tertiary/20"
                    : "bg-surface-high text-on-surface-variant border-outline-variant/30"
                }`}>
                  {breach.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Exposed Fields */}
          <div>
            <span className="font-mono text-[9px] text-on-surface-variant/60 block mb-2 uppercase tracking-wider">
              Compromised Data Headers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {breach.compromisedData.map((data, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-surface-highest/60 text-primary border border-outline-variant/20 font-mono text-[9px] uppercase tracking-wide rounded-xs"
                >
                  {data}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface-container/40 p-4 border-l border-tertiary">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {breach.description}
            </p>
          </div>

          {/* Interactive Mitigation console */}
          {executing ? (
            <div className="bg-surface border border-outline-variant/30 p-4 rounded-xs font-mono text-[10px] text-emerald-400 space-y-1 h-32 overflow-y-auto shadow-inner">
              <div className="text-tertiary animate-pulse">[!] DEPLOYING SYSTEM MITIGATION PROTOCOL...</div>
              {logs.map((log, index) => (
                <div key={index} className="text-emerald-500">{log}</div>
              ))}
            </div>
          ) : isResolved ? (
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 text-emerald-400 rounded-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs uppercase block tracking-wider">Breach Remedied</span>
                <span className="text-[10px] text-emerald-400/80 leading-tight">
                  Cryptographic shields active. Exposure vector successfully sealed on this node.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-on-surface-variant/70 text-[11px] font-mono leading-relaxed bg-surface p-3 border border-outline-variant/15">
                <ShieldAlert className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                <span>
                  By deploying a secure vector, LeakLock will rotate affected passwords, request token deletion across API relays, and alert identity monitors.
                </span>
              </div>

              <button
                onClick={handleExecuteMitigation}
                className="w-full py-3 bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.01]"
              >
                EXECUTE MITIGATION SHIELD (+40 PTS)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
