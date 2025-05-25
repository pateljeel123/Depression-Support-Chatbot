"use client";

import { cn } from "@/lib/utils"; // Assuming @/lib/utils is the correct path for cn
import { FaTwitter, FaQuoteLeft } from 'react-icons/fa'; // Added Twitter and Quote icons
import { motion } from 'framer-motion';

const TweetStyleCard = ({
  img,
  name,
  username,
  body,
  tweetLink = "#",
  className,
  avatarClassName = "rounded-full",
  containerProps = {},
}) => {
  return (
    <motion.figure
      className={cn(
        "relative h-full w-72 sm:w-80 cursor-pointer overflow-hidden rounded-xl border p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300",
        // light styles
        "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
        className
      )}
      whileHover={{ y: -5 }}
      {...containerProps}
    >
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        {img && <img className={cn("w-10 h-10 sm:w-12 sm:h-12", avatarClassName)} alt={`${name}'s avatar`} src={img} />}
        {!img && <FaQuoteLeft className="w-8 h-8 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />} {/* Fallback icon */}
        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div>
              <figcaption className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                {name}
              </figcaption>
              {username && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">@{username}</p>}
            </div>
            <a href={tweetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
          <blockquote className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {body}
          </blockquote>
        </div>
      </div>
    </motion.figure>
  );
};

export default TweetStyleCard;