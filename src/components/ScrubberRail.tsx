import React from "react";

export const ScrubberRail: React.FC = () => {
  const letters = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col justify-between items-center h-full py-2 px-1 select-none">
      {letters.map((char) => (
        <span
          key={char}
          className="text-[9px] font-bold text-white/45 hover:text-cyan-400 hover:drop-shadow-[0_0_3px_rgba(6,182,212,0.8)] hover:scale-125 transition-all duration-150 cursor-pointer py-0.5 px-1 leading-none"
          title={`Filter: ${char}`}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
