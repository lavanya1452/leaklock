import React, { useState } from "react";
import { Shield, Lock, Eye, Terminal, ArrowRight, UserCheck, AlertTriangle, Fingerprint } from "lucide-react";

interface LandingProps {
  onStartScan: (identifier: string) => void;
  onNavigateToLogin: () => void;
}

export default function Landing({ onStartScan, onNavigateToLogin }: LandingProps) {
  const [targetId, setTargetId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetId.trim()) {
      onStartScan(targetId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-between text-on-surface select-none relative overflow-hidden">
      {/* Cinematic Cyber Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#fbbc00_1px,transparent_1px),linear-gradient(to_bottom,#fbbc00_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Header Panel */}
      <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-10 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-tertiary flex items-center justify-center glow-amber">
            <Fingerprint className="w-5 h-5 text-on-tertiary" />
          </div>
          <span className="font-sans font-extrabold text-xl text-tertiary uppercase tracking-tight">LeakLock</span>
        </div>
        <button 
          onClick={onNavigateToLogin}
          className="flex items-center gap-2 px-4 py-2 bg-surface-low hover:bg-surface-high border border-outline-variant/30 text-[11px] font-mono tracking-widest uppercase transition-all hover:scale-105"
        >
          <UserCheck className="w-3.5 h-3.5 text-tertiary" />
          <span>Operator Access</span>
        </button>
      </header>

      {/* Hero Center Block */}
      <main className="w-full max-w-4xl px-6 py-12 flex flex-col items-center justify-center text-center z-10 my-auto">
        {/* Live system state banner */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 border border-tertiary/20 bg-tertiary-container text-tertiary font-mono text-[10px] tracking-widest rounded-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
          <span>PROTOCOL 7.4.2 SYSTEM MONITOR ACTIVE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl md:text-6xl font-sans font-extrabold text-on-surface uppercase tracking-tight mb-4 leading-none">
          MONITOR YOUR <br className="hidden md:inline" />
          <span className="text-tertiary">LEAKLOCK</span>
        </h1>
        
        <p className="max-w-xl text-sm md:text-base text-on-surface-variant/80 mb-8 leading-relaxed font-sans font-light">
          LeakLock continuously probes deep-web records, dark-net repositories, and breached databases to identify leaking credentials and secure compromised assets in real-time.
        </p>

        {/* High-Contrast Search Block */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-surface-container border border-outline-variant/30 p-2 rounded-xs flex flex-col sm:flex-row gap-2 mb-12 shadow-2xl relative glow-amber">
          <div className="relative flex-grow flex items-center">
            <Terminal className="absolute left-3 w-4 h-4 text-on-surface-variant/50" />
            <input 
              type="text"
              required
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Enter email, handle, or corporate domain..."
              className="w-full bg-surface-lowest text-on-surface border-0 pl-10 pr-4 py-3 font-mono text-xs focus:ring-0 outline-none placeholder:text-on-surface-variant/30"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>PROBE ID</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Grid Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-5 bg-surface-low border border-outline-variant/10 rounded-xs">
            <Shield className="w-5 h-5 text-tertiary mb-3" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface mb-2">Exposure Guard</h3>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed font-sans">
              Instantaneous dark-web audits that detect cleartext passwords, salt-hash credential tables, and geolocation profiles.
            </p>
          </div>
          <div className="p-5 bg-surface-low border border-outline-variant/10 rounded-xs">
            <Lock className="w-5 h-5 text-tertiary mb-3" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface mb-2">Mitigation Shields</h3>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed font-sans">
              Deploy automated defense vectors to isolate compromised nodes, enforce key-rotations, and seal metadata leaks instantly.
            </p>
          </div>
          <div className="p-5 bg-surface-low border border-outline-variant/10 rounded-xs">
            <Eye className="w-5 h-5 text-tertiary mb-3" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface mb-2">Threat Intelligence</h3>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed font-sans">
              Dynamic logging timelines matched with Defcon warning status updates to maintain aggregate identity rating metrics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer System Status Banner */}
      <footer className="w-full border-t border-outline-variant/10 py-4 bg-surface-lowest flex flex-col md:flex-row justify-between items-center px-6 text-on-surface-variant/60 font-mono text-[10px] tracking-wider z-10 gap-2 select-none">
        <div>
          <span>© 2026 LEAKLOCK MONITOR // LEAKLOCK</span>
        </div>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: Operational
          </span>
          <span>Secured Protocol SSL_256</span>
        </div>
      </footer>
    </div>
  );
}
