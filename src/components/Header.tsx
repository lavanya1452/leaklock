import React, { useState } from "react";
import { Search, Bell, ShieldCheck, Menu, UserCheck, ShieldAlert } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onMenuToggle?: () => void;
  threatLevel: 'MINIMAL' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  userEmail?: string;
}

export default function Header({ onSearch, onMenuToggle, threatLevel, userEmail }: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchVal.trim()) {
      onSearch(searchVal.trim());
    }
  };

  const threatColor = {
    MINIMAL: "text-green-400 border-green-500/30",
    MODERATE: "text-blue-400 border-blue-500/30",
    ELEVATED: "text-tertiary border-tertiary/30",
    CRITICAL: "text-red-400 border-red-500/30"
  }[threatLevel];

  return (
    <header className="flex justify-between items-center w-full px-6 py-4 bg-surface-lowest border-b border-outline-variant/15 z-10 select-none">
      {/* Brand Heading & Menu Button for Mobile */}
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="font-sans font-bold text-lg md:text-2xl text-tertiary uppercase tracking-tighter hover:opacity-95 cursor-pointer select-none">
            LeakLock <span className="text-on-surface opacity-40 font-light font-mono text-xs tracking-wider ml-1 hidden lg:inline">SHADOW MONITOR</span>
          </h1>
        </div>
      </div>

      {/* Query Bar */}
      <div className="relative flex items-center max-w-xs md:max-w-md w-full mx-4">
        <Search className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="QUERY DATABASE (Email, Domain)..."
          className="w-full bg-surface-low border border-outline-variant/35 text-on-surface font-mono text-xs pl-10 pr-4 py-2 focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all placeholder:text-on-surface-variant/40"
        />
        {searchVal && (
          <span className="absolute right-3 font-mono text-[9px] text-tertiary/60 select-none animate-pulse">
            [ENTER] TO SCAN
          </span>
        )}
      </div>

      {/* Quick Status and Operator Meta */}
      <div className="flex items-center gap-3">
        {/* Threat level indicator */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-1 border rounded-xs text-[10px] font-mono tracking-widest ${threatColor}`}>
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span>THREAT: {threatLevel}</span>
        </div>

        {/* Action icons */}
        <button 
          onClick={() => alert("Decrypting tactical broadcast feed... 0 new notifications.")}
          className="p-2 text-on-surface-variant hover:text-tertiary hover:bg-surface-high/50 transition-all rounded-xs relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tertiary"></span>
        </button>

        {/* Security Officer Portrait */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/20">
          <div className="w-8 h-8 rounded-xs border border-outline-variant/30 overflow-hidden relative group cursor-pointer">
            <img 
              alt="Security Operator" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8NGFhtNlsjUhT9n3erkCTzn0sF_g4KA8Wtu3b9oTxgCR-1xFxbqaHx7p8CrWpYWFs1aYyiu3CyJUT2LKfHAcrmhXOCsQ0jBmIfVbUz1jeKrv3GVeTfybR6vGnFVwP1WXSLsBxBmAN48hELcpyBn7QhOIuwVQIDmD5-6YfNgNcUxcdat29EaANH3QeVk6h7xX5Um20py0nTnYTdFdeTIWAgvVlYE_PB21xxTfZDpgUDIhBYQbJKH83LEcpftUkR-2xtl19LX5ud-s"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-tertiary/10 opacity-40 mix-blend-color"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
