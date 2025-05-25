import React, { CSSProperties } from "react";
import PropTypes from 'prop-types';
import { cn } from "../../lib/utils"; // Adjusted path

export const ShimmerButton = React.forwardRef(
  ({
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)", // Default to dark background for light shimmer
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } 
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]",
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            // transition
            "transform-gpu transition-all duration-300 ease-in-out",
            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            // on click
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]",
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";


ShimmerButton.propTypes = {
  shimmerColor: PropTypes.string,
  shimmerSize: PropTypes.string,
  borderRadius: PropTypes.string,
  shimmerDuration: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  // Include any other props passed via ...props that need type checking
  // For example, if you expect standard button props like 'onClick', 'type', etc.
  // you can add them here or rely on the fact that they are passed through.
  // For ComponentPropsWithoutRef<'button'>, it's harder to replicate fully
  // with PropTypes without listing them all. For simplicity, we'll keep it concise.
};

// Added Tailwind CSS animation configurations as a comment
/*
@keyframes shimmer-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes spin-around {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

module.exports = {
  theme: {
    extend: {
      animation: {
        'shimmer-slide': 'shimmer-slide 2s ease-in-out infinite',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
      },
      keyframes: {
        'shimmer-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'spin-around': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
*/