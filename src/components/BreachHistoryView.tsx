import React, { useState } from "react";
import { 
  Lock, 
  Search, 
  Download, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  FileSpreadsheet
} from "lucide-react";
import { Breach } from "../types";

interface BreachHistoryViewProps {
  breaches: Breach[];
  onAnalyze: (breach: Breach) => void;
  onRefresh: () => void;
}

export default function BreachHistoryView({ breaches, onAnalyze, onRefresh }: BreachHistoryViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [filterQuery, setFilterQuery] = useState("");

  const handleExport = () => {
    // Elegant tactical report export simulation
    const jsonStr = JSON.stringify(breaches, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LeakLock_Identity_Audit_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredBreaches = breaches.filter((b) => {
    const matchesSeverity = filterSeverity === "ALL" || b.severity === filterSeverity;
    const matchesQuery = b.sourceEntity.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         b.compromisedData.some(d => d.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesSeverity && matchesQuery;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-error-container text-error border-error/20 severity-glow-critical font-bold";
      case "ELEVATED":
        return "bg-tertiary-container text-tertiary border-tertiary/20 font-bold";
      case "MODERATE":
        return "bg-surface-highest text-on-surface-variant border-outline-variant/30";
      default:
        return "bg-surface-high text-on-surface-variant/70 border-outline-variant/10";
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Header Description & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase text-on-surface tracking-tight mb-1">
            Exposure Breach History
          </h2>
          <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
            Comprehensive ledger of identified data exposures impacting your monitored identifiers. Verified via encryption protocol 7.4.2.
          </p>
        </div>

        {/* Action button triggers */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-tertiary hover:bg-tertiary/90 text-on-tertiary text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs active:scale-98 transition-all w-full lg:w-auto glow-amber"
          >
            <Download className="w-3.5 h-3.5 text-on-tertiary" />
            <span>EXPORT REPORT</span>
          </button>
          <button 
            onClick={onRefresh}
            className="p-2.5 bg-surface-container hover:bg-surface-high border border-outline-variant/20 rounded-xs transition-colors"
            title="Refresh Scan Data"
          >
            <RefreshCw className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* Filter and query bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-surface-container border border-outline-variant/15 p-4 rounded-xs">
        
        {/* Search filter */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
          <input 
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search exposure sources or compromised fields..."
            className="w-full bg-surface-low border border-outline-variant/35 text-xs text-on-surface font-mono pl-10 pr-4 py-2 outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary"
          />
        </div>

        {/* Severity filter dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-tertiary/60" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-surface-low border border-outline-variant/35 text-xs text-on-surface font-mono px-3 py-2 outline-none focus:border-tertiary"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="ELEVATED">ELEVATED</option>
            <option value="MODERATE">MODERATE</option>
            <option value="MINIMAL">MINIMAL</option>
          </select>
        </div>
      </div>

      {/* Table block */}
      <div className="bg-surface-lowest border border-outline-variant/10 rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-low border-b border-outline-variant/20 font-mono text-[9px] text-on-surface-variant/70 tracking-widest uppercase">
                <th className="px-6 py-4">Source Entity</th>
                <th className="px-6 py-4">Compromised Data</th>
                <th className="px-6 py-4 text-center">Severity</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Detection Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 font-sans text-xs">
              {filteredBreaches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant/40 font-mono uppercase">
                    No exposure indicators matching target metrics.
                  </td>
                </tr>
              ) : (
                filteredBreaches.map((breach) => (
                  <tr 
                    key={breach.id} 
                    className="hover:bg-surface-container/40 transition-colors"
                  >
                    {/* Source Entity */}
                    <td className="px-6 py-4 font-bold text-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xs bg-surface-highest/50 border border-outline-variant/20 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-tertiary/70" />
                        </div>
                        <span>{breach.sourceEntity}</span>
                      </div>
                    </td>

                    {/* Compromised fields tags */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {breach.compromisedData.map((data, idx) => (
                          <span 
                            key={idx}
                            className="px-1.5 py-0.5 bg-surface-highest/40 text-on-primary-container font-mono text-[9px] uppercase tracking-wide rounded-xs"
                          >
                            {data}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Severity label */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-mono uppercase border rounded-xs ${getSeverityBadge(breach.severity)}`}>
                        {breach.severity}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4 text-center font-mono text-[10px]">
                      {breach.status === "RESOLVED" ? (
                        <span className="text-emerald-400 flex items-center justify-center gap-1.5 uppercase font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>RESOLVED</span>
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center justify-center gap-1.5 uppercase font-bold animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>UNRESOLVED</span>
                        </span>
                      )}
                    </td>

                    {/* Detection date */}
                    <td className="px-6 py-4 text-right font-mono text-[10px] text-on-surface-variant/80">
                      {breach.detectionDate}
                    </td>

                    {/* Actions button */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onAnalyze(breach)}
                        className="text-tertiary hover:text-tertiary/80 font-mono text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1 ml-auto group"
                      >
                        <span>ANALYZE</span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
