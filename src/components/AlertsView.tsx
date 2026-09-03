import React, { useState } from "react";
import { 
  ShieldAlert, 
  Terminal, 
  Activity, 
  Trash2, 
  Plus, 
  Lock, 
  Send,
  Zap
} from "lucide-react";
import { Alert, Log } from "../types";

interface AlertsViewProps {
  alerts: Alert[];
  logs: Log[];
  onIsolateAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onAddCustomLog: (message: string, tag: 'SIGNAL' | 'PROTECT' | 'UPDATE') => void;
  onTriggerTestAnomaly: () => void;
}

export default function AlertsView({
  alerts,
  logs,
  onIsolateAlert,
  onDismissAlert,
  onAddCustomLog,
  onTriggerTestAnomaly
}: AlertsViewProps) {
  const [customMsg, setCustomMsg] = useState("");
  const [customTag, setCustomTag] = useState<'SIGNAL' | 'PROTECT' | 'UPDATE'>("SIGNAL");

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMsg.trim()) {
      onAddCustomLog(customMsg.trim(), customTag);
      setCustomMsg("");
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "PROTECT": return "bg-tertiary-container text-tertiary border-tertiary/20";
      case "UPDATE": return "bg-surface-highest text-on-surface border-outline-variant/30";
      default: return "bg-surface-high text-on-surface-variant/80 border-outline-variant/10"; // SIGNAL
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Top action block */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase text-on-surface tracking-tight mb-1">
            Threat Intelligence & Alerts
          </h2>
          <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
            Active warning vectors, suppressions, and decentralized log queues monitoring deep web telemetry clusters.
          </p>
        </div>

        <button 
          onClick={onTriggerTestAnomaly}
          className="flex items-center gap-2 px-4 py-2.5 bg-tertiary hover:bg-tertiary/90 text-on-tertiary text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all active:scale-98 glow-amber"
        >
          <Zap className="w-4 h-4 text-on-tertiary animate-bounce" />
          <span>SIMULATE ANOMALY</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Threats List Column */}
        <div className="lg:col-span-1 space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 block mb-1">
            Active Threat Vertices ({alerts.length})
          </span>

          {alerts.length === 0 ? (
            <div className="border border-outline-variant/10 p-8 rounded-sm text-center bg-surface-container/50">
              <ShieldAlert className="w-8 h-8 text-green-400 mx-auto opacity-30 mb-2" />
              <span className="font-mono text-xs text-on-surface-variant/60 uppercase">No active security failures.</span>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className="border border-outline-variant/20 p-4 rounded-sm bg-surface-container relative overflow-hidden"
              >
                <div className="flex justify-between font-mono text-[9px] text-on-surface-variant/50 mb-1">
                  <span className="text-red-400 font-semibold">{alert.type}</span>
                  <span>{alert.time}</span>
                </div>
                <h4 className="font-bold text-xs uppercase text-on-surface mb-1">{alert.title}</h4>
                <p className="text-[11px] text-on-surface-variant/80 leading-relaxed mb-4">{alert.message}</p>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onIsolateAlert(alert.id)}
                    className="flex-grow py-2 bg-red-950/40 text-red-400 border border-red-500/20 font-mono text-[9px] tracking-wider uppercase rounded-xs hover:bg-red-500 hover:text-white transition-all"
                  >
                    ISOLATE NODE
                  </button>
                  <button 
                    onClick={() => onDismissAlert(alert.id)}
                    className="px-3 py-2 bg-surface-low hover:bg-surface-high text-on-surface-variant border border-outline-variant/30 font-mono text-[9px] uppercase rounded-xs transition-colors"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live intelligence feed typewriter timeline column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
              Live Intelligence Log Feed
            </span>
            <span className="font-mono text-[9px] text-tertiary uppercase animate-pulse">
              ENCRYPTED SEC_STREAM ACTIVE
            </span>
          </div>

          <div className="bg-surface-lowest border border-outline-variant/15 p-5 rounded-xs space-y-4 flex flex-col justify-between">
            {/* Log Feed Table */}
            <div className="space-y-3 font-mono text-[10px] max-h-80 overflow-y-auto">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-4 py-2 border-b border-outline-variant/5 hover:bg-surface-low/30 px-2 rounded-xs transition-colors"
                >
                  <span className="text-on-surface-variant/50 flex-shrink-0">{log.time}</span>
                  <span className={`px-2 py-0.5 text-[8px] font-bold border rounded-xs flex-shrink-0 ${getTagColor(log.tag)}`}>
                    {log.tag}
                  </span>
                  <span className="text-on-surface/90 font-sans text-xs select-text">{log.message}</span>
                </div>
              ))}
            </div>

            {/* Custom Log Injector Form */}
            <form onSubmit={handleLogSubmit} className="border-t border-outline-variant/15 pt-4 flex gap-2">
              <select
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value as any)}
                className="bg-surface-low border border-outline-variant/35 text-xs text-on-surface font-mono px-3 py-2 outline-none focus:border-tertiary"
              >
                <option value="SIGNAL">SIGNAL</option>
                <option value="PROTECT">PROTECT</option>
                <option value="UPDATE">UPDATE</option>
              </select>
              <input 
                type="text"
                required
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Broadcast raw tactical event message to log queue..."
                className="flex-grow bg-surface-low border border-outline-variant/35 text-xs text-on-surface font-mono px-4 py-2 outline-none focus:border-tertiary"
              />
              <button 
                type="submit"
                className="p-2.5 bg-tertiary hover:bg-tertiary/90 text-on-tertiary rounded-xs transition-colors glow-amber"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
