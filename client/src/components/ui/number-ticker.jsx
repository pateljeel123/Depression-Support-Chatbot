"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"; // Changed from motion/react to framer-motion based on Home.jsx imports
import { useEffect, useRef } from "react";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(
            latest.toFixed(0),
          );
        }
      }),
    [springValue],
  );

  return (
    <span
      className={cn(
        "inline-block tabular-nums", // Removed default text color to inherit from parent
        className,
      )}
      ref={ref}
    />
  );
}