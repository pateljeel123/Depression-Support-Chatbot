"use client";

import { cn } from "../../lib/utils"; // Adjusted path
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";

export const AuroraText = ({
  text,
  className,
  containerClassName,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center rounded-md border bg-background/30 px-4 py-2 text-foreground transition-shadow duration-200",
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-md opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(120, 120, 120, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <p className={cn("relative z-20 text-center text-4xl font-bold tracking-[-0.08em] text-foreground md:text-7xl md:leading-tight", className)}>
        {text}
      </p>
    </div>
  );
};