import React from "react";
import { ScrubberRail } from "./ScrubberRail";

interface GlassPanelProps {
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children }) => {
  return (
    <div 
      className="glass-vessel w-[340px] h-[840px] max-h-[calc(100vh-64px)] flex-shrink-0 flex overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-white/10 select-none"
      style={{ width: "340px", minWidth: "340px" }}
    >
      {/* Main vertical content (Search, App List, Footer) */}
      <div className="flex-1 flex flex-col justify-between h-full p-5 pr-2 overflow-hidden">
        {children}
      </div>

      {/* A-Z Navigation Rail */}
      <div className="w-[32px] h-full border-l border-white/5 bg-white/[0.01] py-4 flex items-center justify-center">
        <ScrubberRail />
      </div>
    </div>
  );
};
