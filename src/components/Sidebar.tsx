import React from "react";
import { 
  LayoutDashboard, 
  Lock, 
  ShieldAlert, 
  Radar, 
  Settings as SettingsIcon, 
  HelpCircle, 
  History,
  Terminal,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onTriggerScan: () => void;
  userEmail?: string;
}

export default function Sidebar({ currentPage, onNavigate, onTriggerScan, userEmail }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "breach-history", label: "Breach History", icon: Lock },
    { id: "alerts", label: "Alerts & Threat Intel", icon: ShieldAlert },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full py-6 bg-surface-low border-r border-outline-variant/10 w-64 flex-shrink-0 transition-all duration-300 ease-in-out select-none">
      {/* Operator Info */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-tertiary flex items-center justify-center glow-amber">
            <FingerprintIcon className="w-6 h-6 text-on-tertiary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs tracking-wider text-on-surface uppercase truncate">
              {userEmail ? userEmail.split("@")[0].toUpperCase() : "OPERATOR-01"}
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant opacity-70 uppercase tracking-widest">
              Clearance Level 5
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left flex items-center justify-between px-6 py-3.5 transition-all duration-300 group border-r-2 ${
                isActive
                  ? "bg-tertiary-container text-tertiary border-tertiary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-high hover:text-on-surface border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-tertiary" : "text-on-surface-variant group-hover:text-on-surface"}`} />
                <span className="text-[11px] font-bold tracking-wider uppercase">{item.label}</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all ${isActive ? "opacity-100 translate-x-0 text-tertiary" : "group-hover:opacity-50 group-hover:translate-x-0"}`} />
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Actions */}
      <div className="mt-auto px-6 space-y-4">
        <button
          onClick={onTriggerScan}
          className="w-full py-3 bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-98 glow-amber hover:scale-[1.02]"
        >
          DEPLOY SCAN
        </button>

        <div className="pt-4 border-t border-outline-variant/10 space-y-2">
          <button 
            onClick={() => alert("Connecting secure tunnel to tactical support channels (Simulated)...")}
            className="w-full flex items-center gap-2 text-on-surface-variant hover:text-on-surface py-1 text-left transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-on-surface-variant/70" />
            <span className="font-mono text-[11px] tracking-tight">Support Vault</span>
          </button>
          <div className="flex items-center gap-2 text-on-surface-variant/40 py-1 select-none">
            <Terminal className="w-4 h-4" />
            <span className="font-mono text-[11px] tracking-tight uppercase">Protocol 7.4.2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Inline finger print icon for security theme
function FingerprintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 .5-.2 1.1-.5 1.5" />
      <path d="M14 12a4 4 0 0 0-8 0v2" />
      <path d="M12 6a8 8 0 0 0-8 8v1" />
      <path d="M18 12a6 6 0 0 0-12 0" />
      <path d="M2 14v-1a10 10 0 0 1 20 0v1" />
      <path d="M22 14v1a10 10 0 0 1-20 0v-1" />
      <path d="M12 2a10 10 0 0 0-10 10" />
      <path d="M12 22a10 10 0 0 0 10-10" />
    </svg>
  );
}
