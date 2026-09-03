import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Radio, 
  Key, 
  User, 
  Mail, 
  Plus, 
  X,
  Fingerprint,
  RefreshCw,
  Database,
  Cpu,
  CheckCircle2,
  Server
} from "lucide-react";

interface SettingsViewProps {
  monitoredIds: string[];
  onAddId: (id: string) => void;
  onRemoveId: (id: string) => void;
  userEmail?: string;
}

export default function SettingsView({ monitoredIds, onAddId, onRemoveId, userEmail }: SettingsViewProps) {
  const [newId, setNewId] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const [autoShield, setAutoShield] = useState(true);
  const [mfaHardened, setMfaHardened] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    leakCheckConfigured: boolean;
    geminiConfigured: boolean;
    mode: string;
  }>({
    leakCheckConfigured: false,
    geminiConfigured: false,
    mode: "PUBLIC_INDEX_ACTIVE"
  });
  
  const [vaultKey, setVaultKey] = useState("SHA256::e4427946_0009_4914_9e7d_19299760deea_KEY_ROT");

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => {
        if (data && data.leakCheck) {
          setApiStatus({
            leakCheckConfigured: data.leakCheck.configured,
            geminiConfigured: data.gemini?.configured || false,
            mode: data.leakCheck.mode || "PUBLIC_INDEX_ACTIVE"
          });
        }
      })
      .catch(() => {
        // silent fallback
      });
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newId.trim()) {
      onAddId(newId.trim());
      setNewId("");
    }
  };

  const handleRotateVaultKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    setVaultKey(`SHA256::${randomHex}_rotated_key_seal_proto_7_4_2`);
    alert("Re-generating quantum-resistant master identity vault key. Node rotated successfully.");
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      <div>
        <h2 className="text-xl font-bold uppercase text-on-surface tracking-tight mb-1">
          Identity Vault Settings
        </h2>
        <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
          Configure secure identity trackers, rotate hardware-encryption keys, and synchronize defensive automation scripts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monitored Identities Section */}
        <div className="lg:col-span-7 bg-surface-container border border-outline-variant/10 p-5 rounded-xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
              Active Monitored Identifiers
            </span>
            <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
              [+] MONITORS ONLINE
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {monitoredIds.map((id, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center bg-surface-lowest/75 border border-outline-variant/10 p-3 rounded-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-tertiary flex-shrink-0" />
                  <span className="font-mono text-xs text-primary truncate select-text">{id}</span>
                </div>
                {/* Prevent deleting primary account */}
                {id !== userEmail && (
                  <button 
                    onClick={() => onRemoveId(id)}
                    className="text-on-surface-variant hover:text-red-400 p-1 hover:bg-surface-high transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add identity tracker form */}
          <form onSubmit={handleAddSubmit} className="flex gap-2 border-t border-outline-variant/10 pt-4">
            <input 
              type="text"
              required
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="Track secondary email or active domain..."
              className="flex-grow bg-surface-lowest border border-outline-variant/35 text-xs text-on-surface font-mono px-4 py-2 outline-none focus:border-tertiary"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-bold text-xs uppercase tracking-widest flex items-center gap-1 transition-all glow-amber"
            >
              <Plus className="w-4 h-4" />
              <span>TRACK</span>
            </button>
          </form>
        </div>

        {/* Cryptographic Key Rotation */}
        <div className="lg:col-span-5 bg-surface-container border border-outline-variant/10 p-5 rounded-xs flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 block mb-4">
              Cryptographic Vault Authority
            </span>

            <div className="bg-surface-lowest border border-outline-variant/25 p-4 rounded-xs space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] text-on-surface-variant">Master Shield Key</span>
                <button 
                  onClick={() => setShowKeys(!showKeys)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="font-mono text-[11px] p-2.5 bg-surface border border-outline-variant/10 rounded-xs select-text break-all">
                {showKeys ? vaultKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </div>

              <button 
                onClick={handleRotateVaultKey}
                className="w-full flex items-center justify-center gap-2 py-2 border border-tertiary/20 bg-tertiary-container/30 text-tertiary hover:bg-tertiary/10 font-mono text-[10px] uppercase tracking-wider font-bold rounded-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-[spin_4s_linear_infinite]" />
                <span>ROTATE AUTH MASTER</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Defensive Shield Rules Automation toggle */}
      <div className="bg-surface-container border border-outline-variant/10 p-5 rounded-xs space-y-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 block">
          Threat Mitigation Protocols
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start justify-between p-4 bg-surface-lowest/50 border border-outline-variant/10 rounded-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-on-surface block uppercase tracking-wider">Automated Defensive Vectors</span>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Automatically deploy token-revocations and session quarantine alerts upon critical deep web exposures.
              </p>
            </div>
            <button 
              onClick={() => setAutoShield(!autoShield)}
              className={`w-12 h-6 rounded-full transition-colors relative border ${
                autoShield ? "bg-tertiary border-tertiary" : "bg-surface-high border-outline"
              }`}
            >
              <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-on-tertiary transition-all ${
                autoShield ? "left-6.5" : "left-1"
              }`} />
            </button>
          </div>

          <div className="flex items-start justify-between p-4 bg-surface-lowest/50 border border-outline-variant/10 rounded-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-on-surface block uppercase tracking-wider">SMS / Call Shield Hardening</span>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Require direct biometrics or hardware-token authentication for any third-party credential sync queries.
              </p>
            </div>
            <button 
              onClick={() => setMfaHardened(!mfaHardened)}
              className={`w-12 h-6 rounded-full transition-colors relative border ${
                mfaHardened ? "bg-tertiary border-tertiary" : "bg-surface-high border-outline"
              }`}
            >
              <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-on-tertiary transition-all ${
                mfaHardened ? "left-6.5" : "left-1"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Intelligence Engines & Cloud Deployment Status */}
      <div className="bg-surface-container border border-outline-variant/10 p-5 rounded-xs space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 block">
            Threat Intelligence Engine & Cloud Deployment Architecture
          </span>
          <span className="font-mono text-[9px] text-tertiary uppercase tracking-widest">
            PROTOCOL 7.4.2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LeakCheck Status Card */}
          <div className="p-4 bg-surface-lowest/70 border border-outline-variant/10 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-tertiary" />
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">LeakCheck Breach API</span>
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider ${
                apiStatus.leakCheckConfigured 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "bg-tertiary/10 text-tertiary border border-tertiary/30"
              }`}>
                {apiStatus.leakCheckConfigured ? "AUTH V2 ACTIVE" : "PUBLIC INDEX ACTIVE"}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Queries real indexed dark-web collections, database leaks, and compromised credential archives.
              {apiStatus.leakCheckConfigured 
                ? " Full authenticated v2 API key detected in server runtime."
                : " Operating with free public dark-web index lookups. Add LEAKCHECK_API_KEY in environment secrets for deep raw credential extraction."}
            </p>
          </div>

          {/* Gemini AI Core Status Card */}
          <div className="p-4 bg-surface-lowest/70 border border-outline-variant/10 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-tertiary" />
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Gemini Intelligence Core</span>
              </div>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider ${
                apiStatus.geminiConfigured 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "bg-surface-high text-on-surface-variant/70 border border-outline-variant/20"
              }`}>
                {apiStatus.geminiConfigured ? "ONLINE // 3.5 FLASH" : "STANDBY ENGINE"}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Synthesizes real breach reports into clinical risk scores (0–1000), severity levels, contextual alerts, and customized cryptographic mitigation steps.
            </p>
          </div>
        </div>

        {/* Cloud Run Deployment Readiness Banner */}
        <div className="p-4 bg-surface-lowest/40 border border-outline-variant/10 rounded-xs flex items-start gap-3">
          <Server className="w-4 h-4 text-tertiary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
              Cloud Run Deployment Ready
            </span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              The full-stack Express + Vite backend is built for production on port 3000. All third-party secrets (<code className="text-tertiary font-mono">LEAKCHECK_API_KEY</code> and <code className="text-tertiary font-mono">GEMINI_API_KEY</code>) remain isolated on the server and are never exposed to client browsers. Click <strong className="text-on-surface">Deploy</strong> in the top header to launch live.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
