import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  Plus, 
  Clock, 
  Radio, 
  ListCollapse, 
  Key, 
  AlertTriangle,
  Zap
} from "lucide-react";
import MetricCircle from "./MetricCircle";
import BarChart from "./BarChart";
import { Alert, Asset, Log } from "../types";

interface DashboardViewProps {
  score: number;
  statusText: string;
  totalLeaks: number;
  newLeaks: number;
  avgDetectionTimeHours: number;
  alerts: Alert[];
  assets: Asset[];
  logs: Log[];
  onIsolateAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onEnrollAsset: (name: string, type: string) => void;
}

export default function DashboardView({
  score,
  statusText,
  totalLeaks,
  newLeaks,
  avgDetectionTimeHours,
  alerts,
  assets,
  logs,
  onIsolateAlert,
  onDismissAlert,
  onEnrollAsset
}: DashboardViewProps) {
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("Corporate Vault");

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssetName.trim()) {
      onEnrollAsset(newAssetName.trim(), newAssetType);
      setNewAssetName("");
      setShowAddAsset(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case "CRITICAL": return "text-red-400 border-red-500/20 bg-red-950/20";
      case "ELEVATED": return "text-tertiary border-tertiary/20 bg-tertiary-container/30";
      case "MODERATE": return "text-blue-400 border-blue-500/10 bg-blue-950/10";
      default: return "text-green-400 border-green-500/10 bg-emerald-950/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "EXPOSED": return "text-red-400 font-bold";
      case "SECURED": return "text-green-400 font-bold";
      default: return "text-blue-300"; // ENCRYPTED
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Dynamic Bento Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Radial Indicator */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <MetricCircle score={score} statusText={statusText} />
        </div>

        {/* Real-Time Hour Index bar Chart */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <BarChart />
        </div>
      </div>

      {/* Critical Alerts & Protected Assets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Alerts Feed Widget */}
        <div className="lg:col-span-5 bg-surface-container border border-outline-variant/10 p-5 rounded-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
                Critical System Alerts
              </span>
              <span className="font-mono text-[9px] text-red-400 animate-pulse">[!] DEPLOY SCANNERS</span>
            </div>

            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="border border-outline-variant/15 p-6 text-center rounded-xs bg-surface-lowest/40">
                  <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2 opacity-60" />
                  <span className="font-mono text-xs text-on-surface-variant/70 uppercase">0 Active Alerts Detected</span>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="border-l-2 border-red-500 bg-surface-lowest/60 border border-outline-variant/10 p-4 rounded-xs transition-colors hover:bg-surface-lowest/90"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-[9px] font-extrabold text-red-400 tracking-wider">
                        {alert.type}
                      </span>
                      <span className="font-mono text-[9px] text-on-surface-variant/40">{alert.time}</span>
                    </div>
                    <h4 className="font-bold text-xs uppercase text-on-surface mb-1">{alert.title}</h4>
                    <p className="text-[11px] text-on-surface-variant/80 leading-relaxed mb-3">
                      {alert.message}
                    </p>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onIsolateAlert(alert.id)}
                        className="px-2.5 py-1.5 bg-red-950/40 text-red-400 border border-red-500/20 font-mono text-[9px] tracking-wider uppercase rounded-xs hover:bg-red-500 hover:text-white transition-all"
                      >
                        ISOLATE NODE
                      </button>
                      <button 
                        onClick={() => onDismissAlert(alert.id)}
                        className="px-2.5 py-1.5 bg-surface-high text-on-surface-variant border border-outline-variant/30 font-mono text-[9px] tracking-wider uppercase rounded-xs hover:bg-surface-highest transition-all"
                      >
                        DISMISS
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Protected Assets Ledger */}
        <div className="lg:col-span-7 bg-surface-container border border-outline-variant/10 p-5 rounded-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
                Protected Core Assets
              </span>
              <button 
                onClick={() => setShowAddAsset(!showAddAsset)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-tertiary-container hover:bg-tertiary/20 text-tertiary border border-tertiary/10 font-mono text-[9px] uppercase tracking-wider rounded-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enroll Asset</span>
              </button>
            </div>

            {/* Optional enroll asset inline box */}
            {showAddAsset && (
              <form onSubmit={handleAddAsset} className="bg-surface-lowest border border-outline-variant/30 p-3 mb-4 rounded-xs space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-on-surface-variant/70 uppercase">Asset Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g., Ledger Vault"
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      className="bg-surface border border-outline-variant/30 text-xs text-on-surface px-2.5 py-1.5 outline-none focus:border-tertiary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-on-surface-variant/70 uppercase">Asset Type</label>
                    <select 
                      value={newAssetType}
                      onChange={(e) => setNewAssetType(e.target.value)}
                      className="bg-surface border border-outline-variant/30 text-xs text-on-surface px-2.5 py-1.5 outline-none focus:border-tertiary"
                    >
                      <option>Biometric Cluster</option>
                      <option>Digital Ghost</option>
                      <option>Cold Storage</option>
                      <option>Corporate Repository</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddAsset(false)}
                    className="px-2.5 py-1 bg-surface-high text-on-surface-variant text-[10px] font-mono"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-2.5 py-1 bg-tertiary text-on-tertiary text-[10px] font-mono font-bold"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="border border-outline-variant/10 rounded-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-lowest border-b border-outline-variant/20 font-mono text-[9px] text-on-surface-variant/60 tracking-wider">
                    <th className="px-4 py-2 uppercase">Asset Name</th>
                    <th className="px-4 py-2 uppercase">Type</th>
                    <th className="px-4 py-2 uppercase">Risk Level</th>
                    <th className="px-4 py-2 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 font-sans text-xs">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-surface-lowest/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-primary">{asset.name}</td>
                      <td className="px-4 py-3.5 font-mono text-[10px] text-on-surface-variant/80">{asset.type}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-1.5 py-0.5 font-mono text-[9px] border rounded-xs ${getRiskColor(asset.riskLevel)}`}>
                          {asset.riskLevel}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 text-right font-mono text-[10px] ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Bottom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-surface-container border border-outline-variant/10 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1">
            Total Breach Records
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-tertiary">{totalLeaks}</span>
            <span className="font-mono text-[10px] text-red-400 font-bold">+{newLeaks} NEW DEEP-NET LEAKS</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container border border-outline-variant/10 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1">
            Avg. Time to detection
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-on-surface">{avgDetectionTimeHours}</span>
            <span className="font-mono text-[10px] text-on-surface-variant/60 uppercase">Hours Elapsed</span>
          </div>
        </div>

        <div className="p-4 bg-surface-container border border-outline-variant/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1">
              Live Threat Radar
            </span>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-tertiary tracking-wider uppercase">DEFCON LEVEL 3</span>
                <span className="font-mono text-[9px] text-on-surface-variant/60">VIGILANCE STATUS: ACTIVE</span>
              </div>
              <div className="flex-grow h-1.5 bg-tertiary/10 rounded-xs overflow-hidden relative border border-tertiary/10">
                <div className="absolute top-0 left-0 bottom-0 bg-tertiary glow-amber w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-tertiary/5 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <Radio className="w-24 h-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
