"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const OrbitingCircles = ({
  className,
  items = [],
  radius = 150,
  randomize = true,
  orbitDuration = 12,
  rotationDirection = 1, // 1 for clockwise, -1 for counter-clockwise
  centerContent,
  itemClassName,
  centerClassName,
}) => {
  // Generate random starting positions if randomize is true
  const startAngles = React.useMemo(() => {
    return items.map((_, i) => {
      if (randomize) {
        return Math.random() * 360;
      }
      // Distribute evenly around the circle
      return (i * 360) / items.length;
    });
  }, [items.length, randomize]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className
      )}
    >
      {/* Center content */}
      {centerContent && (
        <div
          className={cn(
            "absolute z-10 flex items-center justify-center rounded-full bg-background dark:bg-background-dark",
            centerClassName
          )}
        >
          {centerContent}
        </div>
      )}

      {/* Orbiting items */}
      {items.map((item, idx) => {
        const startAngle = startAngles[idx];

        return (
          <motion.div
            key={idx}
            className={cn(
              "absolute flex items-center justify-center",
              itemClassName
            )}
            style={{
              width: typeof item.size === "number" ? `${item.size}px` : item.size || "40px",
              height: typeof item.size === "number" ? `${item.size}px` : item.size || "40px",
            }}
            initial={{
              rotate: startAngle,
            }}
            animate={{
              rotate: rotationDirection > 0 ? startAngle + 360 : startAngle - 360,
            }}
            transition={{
              duration: item.duration || orbitDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              style={{
                x: radius,
                rotate: rotationDirection > 0 ? -startAngle - 360 : -startAngle + 360,
              }}
              animate={{
                rotate: 0,
              }}
              transition={{
                duration: item.duration || orbitDuration,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex items-center justify-center"
            >
              {item.content}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};