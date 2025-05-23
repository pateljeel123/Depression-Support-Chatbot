import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Using framer-motion as per project's existing setup
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const HoverEffect = ({
  items,
  className,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link} // Make sure link is not undefined
          key={item?.id || item?.title} // Use a unique key
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={(e) => {
            if (item?.link === "#") {
              e.preventDefault(); // Prevent navigation for placeholder links
            }
            // If you have a navigate function passed or imported:
            // else if (item?.link) { navigate(item.link); }
          }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground" // Unique layoutId for the animation
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="flex flex-col justify-between h-full"> {/* Ensure card takes full height and content is spaced */}
            <div> {/* Wrapper for icon, title, description to control layout */}
              {item.visual && <div className="flex justify-center mb-4">{item.visual}</div>} {/* Display icon if provided */}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
            {item.buttonText && item.link && (
              <motion.button
                // onClick prop is on the parent <a> tag, or handle navigation here if needed
                // For actual navigation, ensure the parent <a> tag's href is correctly set or use a navigate function
                className={`mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${item.link === "#" ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'text-white bg-indigo-600 hover:bg-indigo-700'}`}
                whileHover={{ scale: item.link === "#" ? 1 : 1.05 }}
                whileTap={{ scale: item.link === "#" ? 1 : 0.95 }}
                disabled={item.link === "#"}
              >
                {item.buttonText}
                {item.link !== "#" && <span className="ml-2">→</span>}
              </motion.button>
            )}
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = React.forwardRef(({
  className,
  children,
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-300 dark:group-hover:border-slate-700 relative z-20 transition-all duration-300 ease-in-out transform group-hover:shadow-2xl",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
});

export const CardTitle = ({
  className,
  children,
}) => {
  return (
    <h4 className={cn("text-zinc-800 dark:text-zinc-100 font-bold tracking-wide mt-4 text-center md:text-left", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-600 dark:text-zinc-400 tracking-wide leading-relaxed text-sm text-center md:text-left",
        className
      )}
    >
      {children}
    </p>
  );
};