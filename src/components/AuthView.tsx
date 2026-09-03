import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, UserPlus, Fingerprint } from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: (email: string) => void;
  defaultIsRegister?: boolean;
}

export default function AuthView({ onAuthSuccess, defaultIsRegister = false }: AuthViewProps) {
  const [isRegister, setIsRegister] = useState(defaultIsRegister);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Identification parameters cannot be null.");
      return;
    }

    setLoading(true);

    // Simulate high-fidelity tactical biometric login sequence
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess(email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface relative overflow-hidden select-none">
      {/* Background cyber grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#fbbc00_1px,transparent_1px),linear-gradient(to_bottom,#fbbc00_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 p-8 rounded-xs shadow-2xl relative glow-amber">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-sm bg-tertiary flex items-center justify-center mb-3 shadow-lg glow-amber">
            <Fingerprint className="w-7 h-7 text-on-tertiary animate-[pulse_2s_infinite]" />
          </div>
          <h2 className="text-2xl font-extrabold text-tertiary tracking-tighter uppercase font-sans">
            LEAKLOCK SECURE CONTROL
          </h2>
          <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase tracking-widest mt-1">
            Access Protocol Level 5 Command Core
          </span>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="bg-red-950/20 border border-red-500/20 px-4 py-2.5 text-xs text-red-400 rounded-xs mb-4 font-mono uppercase">
            [ERROR] {" >> "} {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/70">
                Operator Username Call-sign
              </label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3 w-4 h-4 text-on-surface-variant/50" />
                <input 
                  type="text"
                  placeholder="e.g., COMMANDER_ALPHA"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface-lowest border border-outline-variant/35 text-xs text-on-surface font-mono pl-10 pr-4 py-2.5 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/70">
              Operator Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-on-surface-variant/50" />
              <input 
                type="email"
                required
                placeholder="operator@leaklock.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-lowest border border-outline-variant/35 text-xs text-on-surface font-mono pl-10 pr-4 py-2.5 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/70">
              Master Encryption Key Passphrase
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-on-surface-variant/50" />
              <input 
                type={showPass ? "text" : "password"}
                required
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-lowest border border-outline-variant/35 text-xs text-on-surface font-mono pl-10 pr-12 py-2.5 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 text-on-surface-variant/50 hover:text-on-surface transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-98 glow-amber"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-on-tertiary border-t-transparent rounded-full animate-spin"></span>
                <span>DECRYPTING SEC_SHELL...</span>
              </>
            ) : (
              <span>{isRegister ? "INITIALIZE AGENT KEY" : "ESTABLISH TUNNEL CONNECTION"}</span>
            )}
          </button>
        </form>

        {/* Toggle option */}
        <div className="mt-6 pt-4 border-t border-outline-variant/10 text-center">
          <button 
            type="button"
            onClick={() => {
              setError("");
              setIsRegister(!isRegister);
            }}
            className="text-[11px] font-mono text-on-surface-variant/70 hover:text-tertiary transition-colors"
          >
            {isRegister 
              ? "HAVE SECURE CREDENTIALS? ACCESS AUTHENTICATOR" 
              : "NEW OPERATOR AGENT? INITIATE NEW VAULT KEYS"}
          </button>
        </div>

      </div>
    </div>
  );
}
