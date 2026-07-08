import React from "react";
import { LauncherApp, LauncherWorkspace } from "../lib/app-library";
import { AppIcon } from "./AppIcon";
import { clsx } from "clsx";
import { UiDensity } from "../lib/settings";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AppItemProps {
  item: LauncherApp | LauncherWorkspace;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
  uiDensity: UiDensity;
  isExpanded?: boolean;
  workspaceApps?: LauncherApp[];
}

export const AppItem: React.FC<AppItemProps> = ({
  item,
  isActive,
  onHover,
  onClick,
  uiDensity,
  isExpanded = false,
  workspaceApps = []
}) => {
  const isCompact = uiDensity === "compact";
  const isWorkspace = item.kind === "workspace";

  // Custom workspace icon resolution: try to represent the group
  let iconName = "Folder";
  if (!isWorkspace) {
    iconName = (item as LauncherApp).icon;
  } else {
    if (item.id === "development") iconName = "Code2";
    else if (item.id === "web") iconName = "Chrome";
  }

  const displayName = item.name;

  // Workspace description defaults to list of apps in it
  const description = isWorkspace
    ? (workspaceApps.length > 0 ? workspaceApps.map(a => a.name).join(", ") : item.description)
    : (item as LauncherApp).description;

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
        <AppIcon name={iconName} size={isCompact ? 16 : 20} />
      </div>

      {/* Label Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className={clsx(
            "font-medium tracking-wide transition-colors duration-300 truncate",
            isCompact ? "text-[13px]" : "text-[14px]",
            isActive ? "text-emerald-200" : "text-white/80 group-hover:text-white"
          )}>
            {displayName}
          </span>
          {!isWorkspace && (item as LauncherApp).source === "startMenu" && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300/85 font-bold uppercase tracking-wider scale-90 origin-left shrink-0 select-none">
              Preview
            </span>
          )}
        </div>
        {description && (
          <span className={clsx(
            "truncate transition-colors duration-300 mt-0.5",
            isCompact ? "text-[10px]" : "text-[11px]",
            isActive ? "text-cyan-300/60" : "text-white/40 group-hover:text-white/50"
          )}>
            {description}
          </span>
        )}
      </div>

      {/* Workspace Indicator Chevron or Active Arrow */}
      {isWorkspace ? (
        <div className={clsx(
          "ml-2 transition-colors duration-300 shrink-0",
          isActive ? "text-cyan-400" : "text-white/30 group-hover:text-white/50"
        )}>
          {isExpanded ? <ChevronDown size={isCompact ? 14 : 16} /> : <ChevronRight size={isCompact ? 14 : 16} />}
        </div>
      ) : (
        <div className={clsx(
          "w-1.5 h-1.5 rounded-full transition-all duration-500 transform scale-0",
          isActive && "bg-cyan-400 scale-100 shadow-[0_0_8px_#06b6d4]"
        )} />
      )}
    </div>
  );
};
