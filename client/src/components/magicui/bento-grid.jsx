import { cn } from "../../lib/utils"; // Adjusted path
import React from "react";

const BentoCard = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
BentoCard.displayName = "BentoCard";

const BentoGrid = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
BentoGrid.displayName = "BentoGrid";

export { BentoCard, BentoGrid };