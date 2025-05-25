"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /**
   * The color of the border. Can be a single color or an array of colors.
   * @default "#9333ea" // Purple-600
   */
  color?: string | string[];
  /**
   * The width of the border in pixels.
   * @default 2
   */
  borderWidth?: number;
  /**
   * The duration of the animation.
   * @default "15s"
   */
  duration?: string;
  /**
   * The border radius of the component.
   * @default "rounded-lg"
   */
  borderRadius?: string;
}

const ShineBorder = React.forwardRef<HTMLDivElement, ShineBorderProps>(
  (
    {
      className,
      children,
      color = "#9333ea",
      borderWidth = 2,
      duration = "15s",
      borderRadius = "rounded-lg",
      ...props
    },
    ref
  ) => {
    const colorArray = Array.isArray(color) ? color : [color];
    const cssVariables = {
      "--shine-border-width": `${borderWidth}px`,
      "--shine-border-duration": duration,
      "--shine-border-radius": borderRadius,
      "--shine-border-colors": colorArray.join(", "),
      "--shine-border-color-1": colorArray[0],
      "--shine-border-color-2": colorArray[1] || colorArray[0],
      "--shine-border-color-3": colorArray[2] || colorArray[0],
      "--shine-border-color-4": colorArray[3] || colorArray[0],
      "--shine-border-color-5": colorArray[4] || colorArray[0],
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        style={cssVariables}
        className={cn(
          "group relative w-fit",
          "shine-border",
          borderRadius,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ShineBorder.displayName = "ShineBorder";

export default ShineBorder;