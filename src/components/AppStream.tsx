import React from "react";
import { LauncherApp, LauncherWorkspace, SelectableItem } from "../lib/app-library";
import { AppItem } from "./AppItem";
import { UiDensity } from "../lib/settings";
import { clsx } from "clsx";

interface AppStreamProps {
  items: SelectableItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onItemClick: (item: SelectableItem) => void;
  uiDensity: UiDensity;
  expandedWorkspaceIds: string[];
  searchQuery: string;
  allApps: LauncherApp[];
}

type RenderElement =
  | { type: "header"; id: string; title: string }
  | { type: "letterHeader"; id: string; letter: string }
  | {
      type: "selectable";
      id: string;
      item: SelectableItem;
      selectableIndex: number;
      isExpanded?: boolean;
      workspaceApps?: LauncherApp[];
      indent?: boolean;
    };

export const AppStream: React.FC<AppStreamProps> = ({
  items,
  activeIndex,
  setActiveIndex,
  onItemClick,
  uiDensity,
  expandedWorkspaceIds,
  searchQuery,
  allApps,
}) => {
  const elements: RenderElement[] = [];

  if (searchQuery.trim()) {
    // Search Results Mode
    items.forEach((item, index) => {
      const id =
        item.type === "app" ? `search-app-${item.app.id}` : `search-workspace-${item.workspace.id}`;
      elements.push({
        type: "selectable",
        id,
        item,
        selectableIndex: index,
      });
    });
  } else {
    // Structured Mode
    let currentSelectableIndex = 0;

    // 1. Priority Section
    const priorityItems = items.filter((x) => x.type === "app" && x.section === "priority");
    if (priorityItems.length > 0) {
      elements.push({ type: "header", id: "header-priority", title: "Priority" });
      priorityItems.forEach((item) => {
        elements.push({
          type: "selectable",
          id: `priority-${item.type === "app" ? item.app.id : ""}`,
          item,
          selectableIndex: currentSelectableIndex++,
        });
      });
    }

    // 2. Workspaces Section
    const workspaceItems = items.filter(
      (x) => x.type === "workspace" || (x.type === "app" && x.section === "workspace")
    );
    if (workspaceItems.length > 0) {
      elements.push({ type: "header", id: "header-workspaces", title: "Workspaces" });

      items.forEach((item) => {
        if (item.type === "workspace") {
          const isExpanded = expandedWorkspaceIds.includes(item.workspace.id);
          const workspaceApps = item.workspace.appIds
            .map((id) => allApps.find((a) => a.id === id))
            .filter((a): a is LauncherApp => a !== undefined);

          elements.push({
            type: "selectable",
            id: `workspace-${item.workspace.id}`,
            item,
            selectableIndex: currentSelectableIndex++,
            isExpanded,
            workspaceApps,
          });
        } else if (item.type === "app" && item.section === "workspace") {
          elements.push({
            type: "selectable",
            id: `workspace-app-${item.app.id}`,
            item,
            selectableIndex: currentSelectableIndex++,
            indent: true,
          });
        }
      });
    }

    // 3. All Apps Section
    const allAppsGroup = items.filter((x) => x.type === "app" && x.section === "all");
    if (allAppsGroup.length > 0) {
      elements.push({ type: "header", id: "header-all-apps", title: "All Apps" });

      let lastLetter = "";
      allAppsGroup.forEach((item) => {
        if (item.type === "app") {
          const letter = item.app.letter;
          if (letter !== lastLetter) {
            elements.push({ type: "letterHeader", id: `letter-${letter}`, letter });
            lastLetter = letter;
          }
          elements.push({
            type: "selectable",
            id: `all-${item.app.id}`,
            item,
            selectableIndex: currentSelectableIndex++,
          });
        }
      });
    }
  }

  if (elements.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-[13px] py-10 px-4">
        <span>No matching apps or workspaces found</span>
      </div>
    );
  }

  const isCompact = uiDensity === "compact";

  return (
    <div
      className={clsx(
        "flex-1 overflow-y-auto scrollbar-hide pr-2 transition-all duration-300",
        isCompact ? "py-2 space-y-1" : "py-4 space-y-1.5"
      )}
    >
      {elements.map((element) => {
        if (element.type === "header") {
          return (
            <div
              key={element.id}
              className="text-[9px] font-bold text-white/30 uppercase tracking-widest pl-3.5 pt-4 pb-1 select-none border-b border-white/[0.02] mb-1"
            >
              {element.title}
            </div>
          );
        }

        if (element.type === "letterHeader") {
          return (
            <div
              key={element.id}
              className="text-[10px] font-bold text-cyan-400/50 pl-4 py-1 select-none"
            >
              {element.letter}
            </div>
          );
        }

        // Render selectable element
        return (
          <div
            key={element.id}
            className={clsx(element.indent && "pl-4 border-l border-white/5 ml-5 mt-1")}
          >
            <AppItem
              item={element.item.type === "app" ? element.item.app : element.item.workspace}
              isActive={element.selectableIndex === activeIndex}
              onHover={() => setActiveIndex(element.selectableIndex)}
              onClick={() => onItemClick(element.item)}
              uiDensity={uiDensity}
              isExpanded={element.isExpanded}
              workspaceApps={element.workspaceApps}
            />
          </div>
        );
      })}
    </div>
  );
};
