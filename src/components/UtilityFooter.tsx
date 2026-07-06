import React from "react";
import { Settings, Power } from "lucide-react";

interface UtilityFooterProps {
  onPowerClick?: () => void;
}

export const UtilityFooter: React.FC<UtilityFooterProps> = ({ onPowerClick }) => {
  return (
    <div className="flex items-center justify-between w-full pt-4 pb-1 px-1 border-t border-white/[0.04] mt-2 z-10">
      {/* Brand Identity / Circular N Badge on lower-left */}
      <div 
        className="flex items-center justify-center w-7 h-7 rounded-full border border-white/10 bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
        title="Novart Systems"
      >
        <span className="text-[10px] font-bold text-cyan-400 tracking-normal drop-shadow-[0_0_4px_rgba(6,182,212,0.6)]">
          N
        </span>
      </div>

      {/* Utilities on lower-right */}
      <div className="flex items-center space-x-1.5">
        {/* Settings Shortcut */}
        <button
          type="button"
          title="Settings"
          className="flex items-center justify-center p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Settings size={16} />
        </button>

        {/* Power Shortcut */}
        <button
          type="button"
          title="Hide launcher"
          onClick={onPowerClick}
          className="flex items-center justify-center p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Power size={16} />
        </button>
      </div>
    </div>
  );
};
