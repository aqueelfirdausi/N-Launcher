import React from "react";
import { AppItemType } from "../lib/types";
import { AppItem } from "./AppItem";

interface AppStreamProps {
  apps: AppItemType[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onAppClick: (app: AppItemType) => void;
}

export const AppStream: React.FC<AppStreamProps> = ({ 
  apps, 
  activeIndex, 
  setActiveIndex,
  onAppClick
}) => {
  if (apps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-[13px] py-10 px-4">
        <span>No matching apps found</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide py-4 space-y-1.5 pr-2">
      {apps.map((app, index) => (
        <AppItem
          key={app.id}
          app={app}
          isActive={index === activeIndex}
          onHover={() => setActiveIndex(index)}
          onClick={() => onAppClick(app)}
        />
      ))}
    </div>
  );
};
