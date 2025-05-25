import React from 'react';
import { cn } from "@/lib/utils"; // Assuming cn is in lib/utils

export const AnimatedShinyText = ({ className, children }) => {
  return (
    <div
      className={cn(
        'animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedShinyText;