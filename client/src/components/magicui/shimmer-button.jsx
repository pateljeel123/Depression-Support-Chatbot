import React from 'react';
import { cn } from "@/lib/utils"; // Assuming cn is in lib/utils

export const ShimmerButton = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        'animate-shimmer inline-flex h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default ShimmerButton;