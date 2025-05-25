import React from 'react';
import { cn } from "@/lib/utils"; // Assuming cn is in lib/utils

export const RetroGrid = ({ className }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute h-full w-full overflow-hidden opacity-50 [perspective:200px]",
        className,
      )}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(35deg)]">
        <div
          className={cn(
            "animate-grid",
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]",
            "[background-size:24px_24px]",
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
            "inset-0 h-full w-full",
          )}
        ></div>
      </div>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90%" />
    </div>
  );
};

export default RetroGrid;