import React from "react";
import { AppIcon } from "./AppIcon";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  onKeyDown, 
  inputRef 
}) => {
  return (
    <div className="relative flex items-center w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/5 focus-within:border-violet-500/50 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      <AppIcon 
        name="Search" 
        className="text-white/40 mr-2.5 transition-colors duration-300 focus-within:text-violet-400" 
        size={15} 
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search apps, files, web..."
        className="w-full bg-transparent text-[13px] text-white placeholder-white/40 outline-none border-none pr-2"
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
};
