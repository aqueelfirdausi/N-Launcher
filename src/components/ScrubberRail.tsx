import React from "react";
import { clsx } from "clsx";

interface ScrubberRailProps {
  existingLetters?: string[];
}

export const ScrubberRail: React.FC<ScrubberRailProps> = ({ existingLetters }) => {
  const letters = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleLetterClick = (char: string) => {
    const targetId = char === "#" ? "letter-#" : `letter-${char}`;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      if (char === "#") {
        document.getElementById("header-all-apps")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const index = alphabet.indexOf(char);
        if (index !== -1) {
          for (let i = index + 1; i < alphabet.length; i++) {
            const nextEl = document.getElementById(`letter-${alphabet[i]}`);
            if (nextEl) {
              nextEl.scrollIntoView({ behavior: "smooth", block: "start" });
              break;
            }
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col justify-between items-center h-full py-2 px-1 select-none">
      {letters.map((char) => {
        const exists = !existingLetters || existingLetters.includes(char);
        return (
          <span
            key={char}
            onClick={() => exists && handleLetterClick(char)}
            className={clsx(
              "text-[9px] font-bold transition-all duration-150 py-0.5 px-1 leading-none select-none",
              exists
                ? "text-white/70 hover:text-[var(--color-active-glow-end)] hover:drop-shadow-[0_0_3px_var(--active-glow-shadow)] hover:scale-130 cursor-pointer"
                : "text-white/20 cursor-default"
            )}
            title={exists ? `Scroll to: ${char}` : `No apps starting with ${char}`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
