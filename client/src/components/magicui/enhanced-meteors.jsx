"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const EnhancedMeteors = ({
  number = 20,
  className,
  color = "slate",
  speed = "fast",
  density = "medium",
}) => {
  // Determine number of meteors based on density
  const meteorCount = {
    low: Math.floor(number * 0.5),
    medium: number,
    high: Math.floor(number * 2),
  }[density] || number;

  // Determine animation duration based on speed
  const durationMultiplier = {
    slow: 1.5,
    medium: 1,
    fast: 0.6,
  }[speed] || 1;

  // Generate meteors
  const meteors = new Array(meteorCount).fill(true);

  // Color variants
  const colorVariants = {
    slate: "before:from-slate-500",
    gray: "before:from-gray-500",
    zinc: "before:from-zinc-500",
    neutral: "before:from-neutral-500",
    blue: "before:from-blue-500",
    purple: "before:from-purple-500",
    indigo: "before:from-indigo-500",
    teal: "before:from-teal-500",
    emerald: "before:from-emerald-500",
    primary: "before:from-primary",
    secondary: "before:from-secondary",
    accent: "before:from-accent",
  };

  const colorClass = colorVariants[color] || colorVariants.slate;

  return (
    <>
      {meteors.map((_, idx) => {
        // Randomize meteor properties for more natural effect
        const randomLeft = Math.floor(Math.random() * 500 - 250);
        const randomDelay = Math.random() * (0.8 - 0.2) + 0.2;
        const randomDuration = Math.floor(Math.random() * (10 - 2) + 2) * durationMultiplier;
        const randomSize = Math.floor(Math.random() * 2) + 1; // 1px or 2px
        const randomTrailLength = Math.floor(Math.random() * 80) + 30; // 30px to 110px

        return (
          <motion.span
            key={"meteor-" + idx}
            className={cn(
              "animate-meteor-effect absolute top-1/2 left-1/2 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
              `before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2 before:h-[1px] before:bg-gradient-to-r before:to-transparent ${colorClass}`,
              className
            )}
            style={{
              top: 0,
              left: randomLeft + "px",
              width: randomSize + "px",
              height: randomSize + "px",
              animationDelay: randomDelay + "s",
              animationDuration: randomDuration + "s",
              // Set the trail length
              "--meteor-trail-length": randomTrailLength + "px",
            }}
            initial={{ 
              opacity: 0,
              transform: "rotate(215deg) translateX(0)"
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              transform: ["rotate(215deg) translateX(0)", "rotate(215deg) translateX(-500px)"]
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.1, 0.8, 1]
            }}
          >
            <style jsx>{`
              .animate-meteor-effect::before {
                width: var(--meteor-trail-length, 50px);
              }
            `}</style>
          </motion.span>
        );
      })}
    </>
  );
};