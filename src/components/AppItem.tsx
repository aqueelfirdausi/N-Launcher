import React from "react";
import { LauncherApp, LauncherWorkspace } from "../lib/app-library";
import { AppIcon } from "./AppIcon";
import { clsx } from "clsx";
import { UiDensity } from "../lib/settings";
import { ChevronDown, ChevronRight, Pin } from "lucide-react";

interface AppItemProps {
  item: LauncherApp | LauncherWorkspace;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
  uiDensity: UiDensity;
  isExpanded?: boolean;
  workspaceApps?: LauncherApp[];
  onPinToggle?: (appId: string) => void;
}

export const AppItem: React.FC<AppItemProps> = ({
  item,
  isActive,
  onHover,
  onClick,
  uiDensity,
  isExpanded = false,
  workspaceApps = [],
  onPinToggle
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
          ? "bg-gradient-to-br from-[var(--color-active-glow-start)]/20 to-[var(--color-active-glow-end)]/20 text-white scale-105"
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
            isActive ? "text-white font-semibold" : "text-white/80 group-hover:text-white"
          )}>
            {displayName}
          </span>
          {!isWorkspace && (item as LauncherApp).source === "startMenu" && (
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold uppercase tracking-wider scale-90 origin-left shrink-0 select-none">
              Start Menu
            </span>
          )}
        </div>
        {description && (
          <span className={clsx(
            "truncate transition-colors duration-300 mt-0.5",
            isCompact ? "text-[10px]" : "text-[11px]",
            isActive ? "text-white/60" : "text-white/40 group-hover:text-white/50"
          )}>
            {description}
          </span>
        )}
      </div>

      {!isWorkspace && onPinToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinToggle(item.id);
          }}
          className={clsx(
            "ml-2 p-1 rounded transition-all duration-200 shrink-0 hover:bg-white/10 hover:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-active-glow-end)]/50",
            (item as LauncherApp).isPriority
              ? "text-[var(--color-active-glow-end)] opacity-100"
              : "text-white/20 opacity-0 group-hover:opacity-100 focus:opacity-100"
          )}
          title={(item as LauncherApp).isPriority ? "Remove from Priority" : "Pin to Priority"}
        >
          <Pin size={isCompact ? 12 : 14} className={clsx((item as LauncherApp).isPriority && "rotate-45 fill-[var(--color-active-glow-end)]/20")} />
        </button>
      )}

      {/* Workspace Indicator Chevron or Active Arrow */}
      {isWorkspace ? (
        <div className={clsx(
          "ml-2 transition-colors duration-300 shrink-0",
          isActive ? "text-[var(--color-active-glow-end)]" : "text-white/30 group-hover:text-white/50"
        )}>
          {isExpanded ? <ChevronDown size={isCompact ? 14 : 16} /> : <ChevronRight size={isCompact ? 14 : 16} />}
        </div>
      ) : (
        <div className={clsx(
          "w-1.5 h-1.5 rounded-full transition-all duration-500 transform scale-0",
          isActive && "bg-[var(--color-active-glow-end)] scale-100 shadow-[0_0_8px_var(--color-active-glow-end)]"
        )} />
      )}
    </div>
  );
};
