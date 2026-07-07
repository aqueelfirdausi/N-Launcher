import React from "react";
import { AppItemType } from "../lib/types";
import { AppIcon } from "./AppIcon";
import { clsx } from "clsx";
import { UiDensity } from "../lib/settings";

interface AppItemProps {
  app: AppItemType;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
  uiDensity: UiDensity;
}

export const AppItem: React.FC<AppItemProps> = ({ 
  app, 
  isActive, 
  onHover, 
  onClick,
  uiDensity
}) => {
  const isCompact = uiDensity === "compact";

  return (
    <div
      onMouseEnter={onHover}
      onClick={onClick}
      className={clsx(
        "group relative flex items-center w-full cursor-pointer transition-all duration-300 select-none",
        isCompact ? "px-3 py-1.5 rounded-lg" : "px-4 py-2.5 rounded-xl",
        isActive 
          ? "active-glow-container active-item-glow-shadow animate-pulse-glow" 
          : "hover:bg-white/5 border border-transparent hover:border-white/5"
      )}
    >
      {/* Icon Vessel */}
      <div className={clsx(
        "flex items-center justify-center rounded-lg transition-all duration-300 shadow-sm shrink-0",
        isCompact ? "w-8 h-8 mr-3" : "w-10 h-10 mr-4",
        isActive 
          ? "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-300" 
          : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white group-hover:scale-105"
      )}>
        <AppIcon name={app.icon} size={isCompact ? 16 : 20} />
      </div>

      {/* Label Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className={clsx(
          "font-medium tracking-wide transition-colors duration-300 truncate",
          isCompact ? "text-[13px]" : "text-[14px]",
          isActive ? "text-emerald-200" : "text-white/80 group-hover:text-white"
        )}>
          {app.name}
        </span>
        {app.description && (
          <span className={clsx(
            "truncate transition-colors duration-300 mt-0.5",
            isCompact ? "text-[10px]" : "text-[11px]",
            isActive ? "text-cyan-300/60" : "text-white/40 group-hover:text-white/50"
          )}>
            {app.description}
          </span>
        )}
      </div>
      
      {/* Active Arrow indicator (Subtle micro-detail) */}
      <div className={clsx(
        "w-1.5 h-1.5 rounded-full transition-all duration-500 transform scale-0",
        isActive && "bg-cyan-400 scale-100 shadow-[0_0_8px_#06b6d4]"
      )} />
    </div>
  );
};
