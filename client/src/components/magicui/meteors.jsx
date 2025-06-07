"use client";

import { cn } from "../../lib/utils";

export const Meteors = ({ number = 20, className }) => {
  const meteors = new Array(number || 20).fill(true);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {meteors.map((_, idx) => (
        <span
          key={idx}
          className={cn(
            "animate-meteor-fall absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:left-1/2 before:h-[1px] before:w-[50px] before:-translate-y-1/2 before:translate-x-0 before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']"          
          )}
          style={{
            top: 0,
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.random() * (10 - 2) + 2 + "s",
          }}
        />
      ))}
    </div>
  );
};