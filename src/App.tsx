import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Landing from "./components/Landing";
import AuthView from "./components/AuthView";
import ScanLoading from "./components/ScanLoading";
import AnalyzeModal from "./components/AnalyzeModal";
import DashboardView from "./components/DashboardView";
import BreachHistoryView from "./components/BreachHistoryView";
import AlertsView from "./components/AlertsView";
import SettingsView from "./components/SettingsView";
import { Breach, Alert, Asset, Log } from "./types";
import { Shield, Lock, Radio, Sliders, Play, Award, Terminal } from "lucide-react";

// Default initial offline mock data to fall back on or bootstrap the application
const DEFAULT_MONITORED_IDS = ["operator@leaklock.internal"];

export default function App() {
  // Session authentication states
  const [user, setUser] = useState<string | null>(null);
  const [isAuthView, setIsAuthView] = useState(false);

  // Routing and visual overlay states
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isScanning, setIsScanning] = useState(false);
  const [scanQuery, setScanQuery] = useState("");
  const [activeBreach, setActiveBreach] = useState<Breach | null>(null);

  // Core Tactical Data State (Populated dynamically via /api/scan)
  const [score, setScore] = useState(850);
  const [statusText, setStatusText] = useState("STATUS: ELEVATED VIGILANCE");
  const [totalLeaks, setTotalLeaks] = useState(42);
  const [newLeaks, setNewLeaks] = useState(3);
  const [avgDetectionTimeHours, setAvgDetectionTimeHours] = useState(1.2);
  const [threatLevel, setThreatLevel] = useState<'MINIMAL' | 'MODERATE' | 'ELEVATED' | 'CRITICAL'>("ELEVATED");
  
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [monitoredIds, setMonitoredIds] = useState<string[]>(DEFAULT_MONITORED_IDS);

  // Side drawer toggle for mobile screens
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Run an initial boot scan to pre-populate mock dashboard data safely
  useEffect(() => {
    handleExecuteScan("operator@leaklock.internal", true);
  }, []);

  // Primary digital identity scanner pipeline
  const handleExecuteScan = async (query: string, isSilent = false) => {
    if (!isSilent) {
      setScanQuery(query);
      setIsScanning(true);
    }

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error("Scan request failed");
      }

      const data = await response.json();
      
      // Successfully scanned, sync intelligence data states
      setScore(data.score || 850);
      setStatusText(data.status || "STATUS: ELEVATED VIGILANCE");
      setTotalLeaks(data.totalLeaks || 42);
      setNewLeaks(data.newLeaks || 3);
      setAvgDetectionTimeHours(data.avgDetectionTimeHours || 1.2);
      setThreatLevel(data.threatLevel || "ELEVATED");
      setBreaches(data.breaches || []);
      setAlerts(data.alerts || []);
      setAssets(data.assets || []);
      setLogs(data.logs || []);

      // If they searched for a new email, automatically enroll it in their tracked settings list
      if (!monitoredIds.includes(query)) {
        setMonitoredIds(prev => [query, ...prev]);
      }

      // If silent, don't auto-redirect, otherwise navigate to dashboard
      if (!isSilent) {
        setCurrentPage("dashboard");
      }
    } catch (err) {
      console.error("Scanning pipeline error:", err);
      // Fallback is automatically handled in our express backend if no key is present,
      // but if the network is down we alert gracefully
      if (!isSilent) {
        alert("Failed to communicate with LeakLock threat databases. Please ensure dev server is running.");
      }
    } finally {
      if (!isSilent) {
        setIsScanning(false);
      }
    }
  };

  // Auth logins success trigger
  const handleAuthSuccess = (email: string) => {
    setUser(email);
    setIsAuthView(false);
    // Track their login email
    setMonitoredIds(prev => prev.includes(email) ? prev : [email, ...prev]);
    // Run an automatic threat scan against their login email address to populate their custom environment!
    handleExecuteScan(email);
  };

  // Action: Isolate node for a critical alert
  const handleIsolateAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setScore(prev => Math.min(prev + 40, 1000));
    const now = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: `l-remedy-${Math.random()}`,
        time: now,
        tag: "PROTECT" as const,
        message: `Threat cluster suppressed. Isolated warning vertex ID: ${id}. Cryptographic shield active.`
      },
      ...prev
    ]);
    alert("Isolate Node vectors dispatched. Network node successfully isolated.");
  };

  // Action: Dismiss an alert
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Action: Add secondary monitored trackers in settings
  const handleAddMonitoredId = (id: string) => {
    if (!monitoredIds.includes(id)) {
      setMonitoredIds(prev => [id, ...prev]);
      // Trigger a scan on the new tracked identity!
      handleExecuteScan(id, true);
    }
  };

  // Action: Remove monitored tracker
  const handleRemoveMonitoredId = (id: string) => {
    setMonitoredIds(prev => prev.filter(item => item !== id));
  };

  // Action: Enroll custom assets from Dashboard
  const handleEnrollAsset = (name: string, type: string) => {
    const newAsset: Asset = {
      id: `as-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      riskLevel: "MINIMAL",
      status: "SECURED"
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  // Action: Add custom log entries manually from Threat Intel page
  const handleAddCustomLog = (message: string, tag: 'SIGNAL' | 'PROTECT' | 'UPDATE') => {
    const newLog: Log = {
      id: `l-custom-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      tag,
      message
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Action: Trigger a custom test anomaly inside Alerts
  const handleTriggerTestAnomaly = () => {
    const testAlert: Alert = {
      id: `a-test-${Math.random()}`,
      type: "ANOMALY DETECTED",
      title: "Suspicious API Handshake",
      message: "External sync attempt on identity keychain from anomalous IP (103.45.18.XX). Mitigation recommended.",
      time: "Just now",
      status: "ACTIVE",
      severity: "CRITICAL"
    };
    setAlerts(prev => [testAlert, ...prev]);
    setScore(prev => Math.max(prev - 80, 0));
    alert("Test anomaly vector deployed into active monitor state.");
  };

  // Resolve leak inside the analyst modal
  const handleResolveBreach = (id: string) => {
    setBreaches(prev => prev.map(b => b.id === id ? { ...b, status: "RESOLVED" as const } : b));
    setScore(prev => Math.min(prev + 50, 1000));
    const now = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: `l-res-${Math.random()}`,
        time: now,
        tag: "PROTECT" as const,
        message: `Exposure sealed on node ${id}. Mitigating credentials rotated.`
      },
      ...prev
    ]);
  };

  // Layout dispatcher for secondary states (Landing & Authenticator)
  if (!user) {
    if (isAuthView) {
      return (
        <AuthView 
          onAuthSuccess={handleAuthSuccess}
          defaultIsRegister={false}
        />
      );
    }
    return (
      <Landing 
        onStartScan={handleExecuteScan}
        onNavigateToLogin={() => setIsAuthView(true)}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden relative">
      
      {/* Scanning loading overlay */}
      {isScanning && (
        <ScanLoading 
          query={scanQuery} 
          onComplete={() => setIsScanning(false)}
        />
      )}

      {/* Exposure Analyst Deep-Dive popup */}
      {activeBreach && (
        <AnalyzeModal 
          breach={activeBreach} 
          onClose={() => setActiveBreach(null)} 
          onResolve={handleResolveBreach}
        />
      )}

      {/* SideNavBar System */}
      <Sidebar 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setMobileMenuOpen(false);
        }}
        onTriggerScan={() => {
          const promptQuery = prompt("Enter an email or domain to deploy a deep-net scan:");
          if (promptQuery && promptQuery.trim()) {
            handleExecuteScan(promptQuery.trim());
          }
        }}
        userEmail={user}
      />

      {/* Mobile drawer slider overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-surface-lowest/80 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 max-w-xs bg-surface-low border-r border-outline-variant/10 h-full py-6">
            <Sidebar 
              currentPage={currentPage}
              onNavigate={(page) => {
                setCurrentPage(page);
                setMobileMenuOpen(false);
              }}
              onTriggerScan={() => {
                setMobileMenuOpen(false);
                const promptQuery = prompt("Enter an email or domain to deploy a deep-net scan:");
                if (promptQuery && promptQuery.trim()) {
                  handleExecuteScan(promptQuery.trim());
                }
              }}
              userEmail={user}
            />
          </div>
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header Controls */}
        <Header 
          onSearch={(query) => handleExecuteScan(query)}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          threatLevel={threatLevel}
          userEmail={user}
        />

        {/* Content View Router */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 pb-20 scrollbar-thin">
          {currentPage === "dashboard" && (
            <DashboardView 
              score={score}
              statusText={statusText}
              totalLeaks={totalLeaks}
              newLeaks={newLeaks}
              avgDetectionTimeHours={avgDetectionTimeHours}
              alerts={alerts}
              assets={assets}
              logs={logs}
              onIsolateAlert={handleIsolateAlert}
              onDismissAlert={handleDismissAlert}
              onEnrollAsset={handleEnrollAsset}
            />
          )}

          {currentPage === "breach-history" && (
            <BreachHistoryView 
              breaches={breaches}
              onAnalyze={(breach) => setActiveBreach(breach)}
              onRefresh={() => handleExecuteScan(user, true)}
            />
          )}

          {currentPage === "alerts" && (
            <AlertsView 
              alerts={alerts}
              logs={logs}
              onIsolateAlert={handleIsolateAlert}
              onDismissAlert={handleDismissAlert}
              onAddCustomLog={handleAddCustomLog}
              onTriggerTestAnomaly={handleTriggerTestAnomaly}
            />
          )}

          {currentPage === "settings" && (
            <SettingsView 
              monitoredIds={monitoredIds}
              onAddId={handleAddMonitoredId}
              onRemoveId={handleRemoveMonitoredId}
              userEmail={user}
            />
          )}
        </main>

        {/* Footer (from Shared Components) */}
        <footer className="fixed bottom-0 left-0 w-full flex flex-col sm:flex-row justify-between items-center px-6 py-3 z-30 bg-surface-lowest border-t border-outline-variant/15 pointer-events-none md:pointer-events-auto gap-1">
          <div className="flex items-center gap-3 font-mono text-[9px] text-on-surface-variant/50">
            <span className="uppercase">© 2026 LEAKLOCK MONITOR</span>
            <span className="text-tertiary opacity-80 hidden md:inline">• ENCRYPTED PROTOCOL 7.4.2</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[9px]">
            <span className="text-on-surface-variant/60">System Status: Operational</span>
            <a className="text-tertiary hover:text-on-surface transition-opacity flex items-center gap-1.5" href="#">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Global Threat Level: Elevated
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
