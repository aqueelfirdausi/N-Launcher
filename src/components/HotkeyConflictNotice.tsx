import React from "react";

interface HotkeyConflictNoticeProps {
  onDismiss: () => void;
}

export const HotkeyConflictNotice: React.FC<HotkeyConflictNoticeProps> = ({ onDismiss }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-1 my-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 flex flex-col gap-1.5 backdrop-blur-md relative animate-fade-in transition-all duration-300"
    >
      <div className="font-semibold flex justify-between items-center text-[12px]">
        <span>Keyboard shortcut unavailable</span>
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 focus:text-red-200 focus:outline-none text-[16px] leading-none px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Dismiss shortcut warning"
        >
          &times;
        </button>
      </div>
      <p className="opacity-90 leading-relaxed text-[11px]">
        Ctrl + Alt + Space could not be enabled because another application may already be using it. You can still open N Launcher from the system tray. Close the conflicting application and restart N Launcher to try again.
      </p>
    </div>
  );
};
