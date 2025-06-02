import React, { useState, useEffect, useRef, Suspense, useCallback, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaComments,
  FaChartLine,
  FaClipboardCheck,
  FaMoon,
  FaArrowRight,
  FaQuoteLeft,
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaUserPlus,
  FaUserCircle, // Added FaUserCircle to fix ReferenceError
  FaLeaf,
  FaChevronLeft,
  FaChevronRight,
  FaTimes, // Added FaTimes for AppleCard modal
} from "react-icons/fa";
import { GiBrain, GiMeditation, GiHeartBeats } from "react-icons/gi";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { motion, useAnimation, AnimatePresence, useTransform, useSpring, useMotionValue } from "framer-motion";
import { MagicCard } from "../magicui/magic-card";
import Marquee from "../magicui/marquee"; // Corrected Marquee import
import SliderContainer from "../ui/slider-container"; // Added SliderContainer import
import { AuroraText } from "../magicui/aurora-text"; // Added AuroraText import


import chroma from "chroma-js"; // Added import for chroma-js
// Note: Most 3D elements (Canvas, OrbitControls, Stars, Float, BrainModel, FloatingIcon, FeatureModel)
// have been removed or their usage significantly reduced to address performance issues and lags.
// Framer Motion will be primarily used for animations.

import { cn } from "../../lib/utils"; // Import cn from utils
import ShineBorder from "../ui/shine-border";

// Add CSS for transparent navbar and color theme
const globalStyles = `
  body {
    background-color: #121212;
    color: #f5f5f5;
  }
  
  nav {
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.3) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .nav-link {
    color: white !important;
    transition: color 0.3s ease;
  }
  
  .nav-link:hover {
    color: #a855f7 !important;
  }
`;

// Aceternity UI HoverEffect Components
const AceternityCard = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.2] group-hover:border-neutral-300 dark:group-hover:border-slate-700 relative z-20 transition-shadow duration-300 shadow-sm hover:shadow-lg",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-1 sm:p-2 md:p-4">{children}</div>
      </div>
    </div>
  );
};

const AceternityCardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-gray-800 dark:text-zinc-100 font-bold tracking-wide mt-2 sm:mt-4 text-base sm:text-lg md:text-xl", className)}>
      {children}
    </h4>
  );
};

const AceternityCardDescription = ({ className, children }) => {
  return (
    <p className={cn("mt-2 sm:mt-4 md:mt-6 text-gray-600 dark:text-zinc-400 tracking-wide leading-relaxed text-xs sm:text-sm md:text-base", className)}>
      {children}
    </p>
  );
};

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 py-6 sm:py-8 md:py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div // Changed from <a> to <div> as we are not using item.link here
          key={idx} // Assuming title can be non-unique, use index or a unique id if available
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-100 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground" // Unique ID for layout animation
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
          <AceternityCard>
            {item.icon && <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 md:mb-4 text-center sm:text-left">{item.icon}</div>} {/* Added icon display */}
            <AceternityCardTitle>{item.title}</AceternityCardTitle>
            <AceternityCardDescription>{item.description}</AceternityCardDescription>
          </AceternityCard>
        </div>
      ))}
    </div>
  );
};

// Aceternity UI 3D Card Effect Components
export const CardContainer = ({ children, className, containerClassName }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "py-20 flex items-center justify-center",
        containerClassName
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className={cn(
          "flex items-center justify-center relative transition-all duration-200 ease-linear",
          className,
          isMouseEntered ? "shadow-2xl" : "shadow-xl"
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export const CardBody = ({ children, className }) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      onMouseEnter={() => setIsMouseEntered(true)}
      onMouseLeave={() => setIsMouseEntered(false)}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};



// Aceternity UI 3D Pin Container
export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!href) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!href) return;
    setIsHovered(true);
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (!href) return;
    setIsHovered(false);
    setOpacity(0);
  };

  const handleFocus = () => {
    if (!href) return;
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!href) return;
    setIsFocused(false);
  };

  return (
    <div
      className={cn("relative group/pin z-50 cursor-pointer", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: isHovered || isFocused
              ? `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1,1)`
              : `translate3d(0, 0, -100px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.5,0.5)`,
            transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
            opacity: isHovered || isFocused ? opacity : 0,
          }}
          className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-full bg-sky-500/[0.8] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
        ></div>
      </div>

      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          style={{
            transform: `translate(-50%,-50%) perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
          }}
          className="absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-transparent opacity-0 transition-opacity duration-500 group-hover/pin:opacity-100"
        />
      </div>
      <div
        style={{
          transform: isHovered || isFocused ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.2s ease-out",
        }}
        className={cn("rounded-2xl p-px transition duration-200", className)}
      >
        {children}
      </div>
      <div
        style={{
          transform: `translateX(${position.x}px) translateY(${position.y}px)`,
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full bg-sky-600 opacity-0 transition-opacity duration-500 group-hover/pin:opacity-100"
      />
      {title && (
        <div className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity duration-500 group-hover/pin:opacity-100">
          {title}
        </div>
      )}
    </div>
  );
};

// Aceternity UI Animated Testimonials
const testimonialsData = [
  {
    quote:
      "This app has been a lifeline during my darkest moments. Having someone to talk to anytime, without judgment, has made all the difference.",
    name: "Sarah K.",
    title: "User since 2022",
    image: "/placeholder-user.jpg", // Replace with actual image paths or remove if not used
  },
  {
    quote:
      "The mood tracking feature helped me identify patterns I never noticed before. Now I can take proactive steps when I see warning signs.",
    name: "Michael T.",
    title: "User since 2021",
    image: "/placeholder-user.jpg",
  },
  {
    quote:
      "As someone who was hesitant about therapy, this app provided the perfect bridge to understanding my emotions better.",
    name: "Jamie L.",
    title: "User since 2023",
    image: "/placeholder-user.jpg",
  },
  {
    quote: "The resources and community here are invaluable. I feel less alone on this journey.",
    name: "Alex P.",
    title: "User since 2022",
    image: "/placeholder-user.jpg",
  },
  {
    quote: "MindCare helped me build healthier coping mechanisms. I'm grateful for this platform.",
    name: "Casey B.",
    title: "User since 2023",
    image: "/placeholder-user.jpg",
  },
];

export const AnimatedTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
      }
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div 
      className="relative flex flex-col items-center justify-center w-full h-[20rem] md:h-[24rem] lg:h-[28rem] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 p-3 md:p-6 shadow-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
          className="flex flex-col items-center justify-center text-center w-full max-w-xl"
        >
          {/* Optional: Add image if available 
          <img 
            src={testimonialsData[currentIndex].image} 
            alt={testimonialsData[currentIndex].name} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mb-3 md:mb-4 border-2 border-indigo-300 dark:border-indigo-600 shadow-lg"
          />
          */}
          <FaQuoteLeft className="text-2xl md:text-3xl text-indigo-400 dark:text-indigo-500 mb-3 md:mb-4" />
          <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 italic mb-3 md:mb-4 leading-normal">
            {testimonialsData[currentIndex].quote}
          </p>
          <p className="text-xs md:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {testimonialsData[currentIndex].name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {testimonialsData[currentIndex].title}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300",
              currentIndex === index ? "bg-indigo-600 dark:bg-indigo-400 scale-125" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Simplified icon component for features
const FeatureIcon = ({ icon, color }) => {
  return (
    <div className={`p-4 rounded-full shadow-lg`} style={{ backgroundColor: color }}>
      {React.cloneElement(icon, { className: "h-8 w-8 text-white" })}
    </div>
  );
};

// Aceternity UI AnimatedTooltip Component
export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item) => (
        <div
          className="-mr-4 relative group"
          key={item.id} 
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={item.onClick} 
          style={{ cursor: item.onClick ? 'pointer' : 'default' }} 
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                <div className="font-bold text-white relative z-30 text-base">
                  {item.name}
                </div>
                <div className="text-white text-xs">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            src={item.image}
            alt={item.name}
            className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
          />
        </div>
      ))}
    </>
  );
};
// End of AnimatedTooltip Component
const Home = () => {
  const { session, signOut } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // This state seems unused, consider removing if not needed for other parts.
  const controls = useAnimation(); // Retained for other potential animations, but hero parallax is handled differently.
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const depressionImpactCards = [
    {
      title: "It's More Than Sadness",
      description: "Depression is a complex mood disorder that goes beyond temporary sadness. It can permeate every aspect of daily functioning.",
      icon: <GiBrain className="w-10 h-10 mx-auto text-blue-500" />
    },
    {
      title: "Impact on Daily Life",
      description: "From work and school performance to relationships and physical health, depression's reach is extensive and often debilitating.",
      icon: <FaClipboardCheck className="w-10 h-10 mx-auto text-green-500" />
    },
    {
      title: "A Silent Struggle",
      description: "Many suffer in silence due to stigma or misunderstanding. Recognizing its widespread effects is the first step to support.",
      icon: <FaComments className="w-10 h-10 mx-auto text-purple-500" />
    }
  ];
  const heroRef = useRef(null);
  const featuresRef = useRef(null); // Ref for scrolling to features section

  // Parallax scroll effect for hero content
  useEffect(() => {
    const handleHeroScroll = () => {
      if (heroRef.current) {
        const currentScrollY = window.scrollY;
        // Apply a subtle parallax effect to the hero content
        heroRef.current.style.transform = `translateY(${currentScrollY * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", handleHeroScroll);
    return () => window.removeEventListener("scroll", handleHeroScroll);
  }, []);

  const testimonials = [
    {
      quote:
        "This app has been a lifeline during my darkest moments. Having someone to talk to anytime, without judgment, has made all the difference.",
      author: "Sarah K.",
      role: "User since 2022",
    },
    {
      quote:
        "The mood tracking feature helped me identify patterns I never noticed before. Now I can take proactive steps when I see warning signs.",
      author: "Michael T.",
      role: "User since 2021",
    },
    {
      quote:
        "As someone who was hesitant about therapy, this app provided the perfect bridge to understanding my emotions better.",
      author: "Jamie L.",
      role: "User since 2023",
    },
  ];

  const features = [
    {
      icon: <FaComments className="h-8 w-8 text-white" />,
      title: "AI Chat Support",
      description:
        "Talk to our compassionate AI companion anytime. Get immediate support in a safe, judgment-free space with responses tailored to your needs.",
      color: "#6366f1", // Indigo
      // model property removed
    },
    {
      icon: <FaChartLine />, // Pass icon component directly
      title: "Mood Tracking",
      description:
        "Visualize your emotional patterns with our intuitive mood tracker. Gain insights to better understand your mental health journey.",
      color: "#10b981", // Emerald
      // model property removed
    },
    {
      icon: <FaClipboardCheck />, // Pass icon component directly
      title: "PHQ-9 Assessment",
      description:
        "Professional-grade depression screening with personalized feedback and progress tracking over time.",
      color: "#3b82f6", // Blue
      // model property removed
    },
    {
      icon: <GiHeartBeats />, // Pass icon component directly
      title: "Personalized Support",
      description:
        "Receive customized recommendations including exercises, articles, and coping strategies based on your unique needs.",
      color: "#ec4899", // Pink
      // model property removed
    },
    {
      icon: <GiMeditation />, // Pass icon component directly
      title: "Mindfulness Tools",
      description:
        "Access guided meditations, breathing exercises, and relaxation techniques to reduce stress and anxiety.",
      color: "#f59e0b", // Amber
      // model property removed
    },
    {
      icon: <GiBrain />, // Pass icon component directly
      title: "Cognitive Exercises",
      description:
        "Interactive activities designed to challenge negative thought patterns and build resilience.",
      color: "#8b5cf6", // Violet
      // model property removed
    },
  ];
  // Removed the duplicated features array. The 'model' property is no longer needed.

  // const features = [
  //   {
  //     icon: <FaComments className="h-8 w-8 text-white" />,
  //     title: "AI Chat Support",
  //     description:
  //       "Talk to our compassionate AI companion anytime. Get immediate support in a safe, judgment-free space with responses tailored to your needs.",
  //     color: "#6366f1",
  //     model: "chat",
  //   },
  //   {
  //     icon: <FaChartLine className="h-8 w-8 text-white" />,
  //     title: "Mood Tracking",
  //     description:
  //       "Visualize your emotional patterns with our intuitive mood tracker. Gain insights to better understand your mental health journey.",
  //     color: "#10b981",
  //     model: "graph",
  //   },
  //   {
  //     icon: <FaClipboardCheck className="h-8 w-8 text-white" />,
  //     title: "PHQ-9 Assessment",
  //     description:
  //       "Professional-grade depression screening with personalized feedback and progress tracking over time.",
  //     color: "#3b82f6",
  //     model: "assessment",
  //   },
  //   {
  //     icon: <GiHeartBeats className="h-8 w-8 text-white" />,
  //     title: "Personalized Support",
  //     description:
  //       "Receive customized recommendations including exercises, articles, and coping strategies based on your unique needs.",
  //     color: "#ec4899",
  //     model: "heart",
  //   },
  //   {
  //     icon: <GiMeditation className="h-8 w-8 text-white" />,
  //     title: "Mindfulness Tools",
  //     description:
  //       "Access guided meditations, breathing exercises, and relaxation techniques to reduce stress and anxiety.",
  //     color: "#f59e0b",
  //     model: "meditation",
  //   },
  //   {
  //     icon: <GiBrain className="h-8 w-8 text-white" />,
  //     title: "Cognitive Exercises",
  //     description:
  //       "Interactive activities designed to challenge negative thought patterns and build resilience.",
  //     color: "#8b5cf6",
  //     model: "brain",
  //   },
  // ];

  // Removed FeatureModel component and complex scroll-based active feature logic.
  // New FeatureCard component with IntersectionObserver will handle animations.

  const useIntersectionObserver = (options) => {
    const [entry, setEntry] = useState(null);
    const [node, setNode] = useState(null);

    const observer = useRef(null);

    const setRef = useCallback((newNode) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (newNode) {
        observer.current = new IntersectionObserver(([entry]) => setEntry(entry), options);
        observer.current.observe(newNode);
      }
      setNode(newNode);
    }, [options]);

    return [setRef, entry];
  };

  // New FeatureCard component for the alternating layout
  const FeatureCard = ({ feature, index }) => {
    const itemControls = useAnimation();
    const [ref, entry] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

    useEffect(() => {
      if (entry?.isIntersecting) {
        itemControls.start("visible");
      } 
    }, [itemControls, entry]);

    const contentVariants = {
      hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.95 },
      visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    };

    const imageVariants = {
      hidden: { opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -5 : 5 },
      visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
    };

    return (
      <MagicCard 
        gradientSize={250}
        gradientColor={chroma(feature.color).darken(0.5).hex()} // Darken the feature color for the gradient
        gradientFrom={chroma(feature.color).brighten(0.5).alpha(0.8).hex()} // Brighter, slightly transparent start
        gradientTo={chroma(feature.color).alpha(0.6).hex()} // Slightly transparent end
        className="rounded-2xl shadow-2xl overflow-hidden p-1 bg-transparent cursor-pointer hover:shadow-3xl transition-all duration-300 ease-out"
      >
        <motion.div
          ref={ref}
          className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-10 md:py-12 px-6 md:px-10 bg-white dark:bg-gray-800 rounded-xl relative z-10`}
          // className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 py-12 md:py-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          initial="hidden"
          animate={itemControls} // Animate the whole card container if needed, or rely on inner elements
        >
          {/* Text Content */}
          <motion.div 
            className={`md:w-1/2 text-center ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
            variants={contentVariants}
          >
            <div className={`inline-block mb-6 ${index % 2 === 0 ? 'md:mr-0 md:ml-auto' : 'md:ml-0 md:mr-auto'}`}>
              <FeatureIcon icon={feature.icon} color={feature.color} />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg lg:text-xl leading-relaxed mb-6">{feature.description}</p>
            <motion.button
              onClick={() => navigate(feature.title.toLowerCase().includes('chat') ? '/chat' : '/resources')}
              className="px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-lg transition-transform duration-300 ease-out transform hover:scale-105 active:scale-95"
              whileHover={{ boxShadow: "0px 0px 20px rgba(192, 132, 252, 0.6)" }}
            >
              Learn More <FaArrowRight className="inline ml-2" />
            </motion.button>
          </motion.div>
          {/* Image/Visual Placeholder */}
          <motion.div 
            className={`md:w-1/2 w-full h-64 sm:h-80 md:h-96 mt-8 md:mt-0 rounded-xl shadow-xl overflow-hidden group relative bg-gray-200 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}
            variants={imageVariants}
          >
            <img 
              src={`https://source.unsplash.com/random/800x600?${feature.title.split(' ')[0].toLowerCase()}&sig=${index}`}
              alt={feature.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 p-3 bg-black/60 rounded-lg">
              {React.cloneElement(feature.icon, { className: "h-10 w-10 text-white opacity-90" })}
            </div>
          </motion.div>
        </motion.div>
      </MagicCard>
    );
  };


  const rotateTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(rotateTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const featureItemVariants = (index) => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? -80 : 80,
      rotateY: index % 2 === 0 ? 25 : -25,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.9, ease: [0.4, 0.0, 0.2, 1], staggerChildren: 0.2, delayChildren: 0.1 },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 font-sans overflow-x-hidden">
      {/* Navbar has been moved to App.jsx for global use */}
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-100 opacity-20"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-24 py-20 sm:py-28 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden isolate bg-[#F3E6AF]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* GIF Side - Assuming this GIF has a vibrant color palette to match */}
            <motion.div 
              className="w-full lg:w-1/2 flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://cdn.prod.website-files.com/62ab7d5ccc9f587bce83c183/62e54e7732c44c5f842541c4_ezgif.com-gif-maker%20(14).gif" // User provided GIF
                  alt="Mental Wellness Journey"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
              </div>
            </motion.div>
            
            {/* Text Content Side */}
            <motion.div
              ref={heroRef}
              className="w-full lg:w-1/2 text-center lg:text-left text-gray-800 order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
          <AuroraText
            text="Discover Your Inner Strength. We're With You."
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 drop-shadow-lg"
            highlightClassName="text-orange-500"
            animationConfig={{
              initial: { opacity: 0, scale: 0.8, y: -30 },
              animate: { opacity: 1, scale: 1, y: 0 },
              transition: { duration: 0.9, delay: 0.2, type: "spring", stiffness: 100, damping: 18 },
            }}
          />
          <motion.p
            className="mt-4 sm:mt-6 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg text-gray-700 drop-shadow-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Navigating life's challenges can be tough, but you don't have to do it alone. Explore tools and find support tailored to your journey towards a brighter, more resilient you.
          </motion.p>

          {/* Buttons removed as per user request */}

              {/* Simplified CTA Card - Retained for quick access */}
              <motion.div
                className="mt-12 w-full max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Common Problems People Face Because of Depression */}
      <motion.section 
        id="common-problems"
        className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-neutral-800"
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1}}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-700 dark:text-primary-300 mb-4 sm:mb-6 leading-tight"
              initial={{ y: 20, opacity: 0}}
              whileInView={{ y: 0, opacity: 1}}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Unmasking Depression: <span className="block sm:inline text-secondary-500 dark:text-secondary-400">More Than Just Sadness</span>
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-foreground/80 dark:text-foreground/70 max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0}}
              whileInView={{ y: 0, opacity: 1}}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Depression is a complex and often misunderstood condition that touches many lives. It's more than a bad day or feeling blue; it's a persistent shadow that can affect thoughts, feelings, and daily activities. Below, we explore some common ways depression can manifest, helping to shed light on its profound impact.
            </motion.p>
          </div>
          <SliderContainer 
            itemWidth={320} // Slightly wider cards
            gap={24} // Increased gap
            visibleItems={3} 
            autoPlay={true} // Ensure autoplay is enabled
            autoPlayInterval={1000} // Change interval to 2 seconds
            className="mt-12 mb-8 mx-auto" // Added margin bottom and centered
            showArrows={true} 
            showDots={true} 
          >
            {[...depressionImpactCards, 
              { icon: <FaQuoteLeft className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Suicidal Thoughts", description: "Overwhelming feelings that life isn’t worth living. If you are in crisis, please seek immediate professional help.", color: "#22c55e" },
              { icon: <FaMoon className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Sleep Disturbances", description: "Persistent trouble falling asleep, staying asleep, oversleeping, or chronic fatigue despite rest.", color: "#22c55e" },
              { icon: <IoMdSad className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Appetite & Weight Changes", description: "Significant loss or gain in appetite, leading to noticeable weight fluctuations without intention.", color: "#22c55e" },
              { icon: <GiMeditation className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Loss of Energy & Motivation", description: "Profound lack of energy, making even small daily tasks feel insurmountable. Apathy towards previously enjoyed activities.", color: "#22c55e" },
              { icon: <FaComments className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Social Withdrawal & Isolation", description: "Pulling away from friends, family, and social engagements. Feeling disconnected and alone.", color: "#22c55e" },
              { icon: <GiBrain className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Persistent Negative Thoughts", description: "Recurring feelings of worthlessness, hopelessness, or excessive guilt. Difficulty concentrating or making decisions.", color: "#22c55e" },
              { icon: <FaClipboardCheck className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Impaired Daily Functioning", description: "Struggles with work, school, or household responsibilities. Poor focus, memory issues, and reduced productivity.", color: "#22c55e" },
              { icon: <GiHeartBeats className="w-12 h-12 mx-auto text-primary-500 dark:text-primary-400" />, title: "Unexplained Physical Ailments", description: "Chronic aches, pains, headaches, or digestive problems that don't respond to typical treatments.", color: "#22c55e" },
            ].map((item, idx) => (
              <MagicCard
                key={idx}
                className="w-full h-[260px] flex flex-col items-center justify-start text-center p-6 bg-card dark:bg-card shadow-xl hover:shadow-2xl rounded-2xl border border-border dark:border-border transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                gradientSize={180}
                gradientColor={chroma(item.color || '#F3E6AF').alpha(0.15).hex()} // Use actual hex codes
              >
                {item.icon && <div className="mb-4 p-3 rounded-full bg-secondary-500/20 dark:bg-secondary-500/30 inline-block">{React.cloneElement(item.icon, { className: "w-10 h-10 text-primary-600 dark:text-primary-300" })}</div>}
                <h4 className="text-xl font-semibold text-foreground dark:text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-foreground/70 dark:text-foreground/60 leading-relaxed px-2">{item.description}</p>
              </MagicCard>
            ))}
          </SliderContainer>


          <motion.div 
            className="text-center mt-10 sm:mt-12"
            initial={{ opacity: 0, y: 20}}
            whileInView={{ opacity: 1, y: 0}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-700 mb-2 text-base sm:text-lg">Not sure if what you're feeling is depression?</p>
            <motion.button
              onClick={() => navigate("/phq9")}
              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Take the Depression Self-Screening Quiz <FaArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Why This Platform? */}
      <motion.section
        id="why-platform"
        className="py-12 sm:py-16 md:py-20 bg-indigo-50 dark:bg-neutral-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose MindCare?
          </motion.h2>
          <HoverEffect
            items={[
              { icon: "🧠", title: "Evidence-Based Tools", description: "Guided by the latest psychology and neuroscience" },
              { icon: "💬", title: "Safe & Anonymous", description: "No judgments, just safe conversations" },
              { icon: "👂", title: "Real Human Support", description: "Kind empathetic listeners (AI-assisted for now)" },
              { icon: "📱", title: "Easy Access", description: "Anytime, anywhere, at your pace" },
            ].map(reason => ({
              ...reason,
              // Convert string icon to a styled span for consistent display within AceternityCard
              icon: <span className="text-3xl sm:text-4xl p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900 transition-colors duration-300">{reason.icon}</span>
            }))}
            className="lg:grid-cols-4 sm:grid-cols-2 grid-cols-1"
          />
        </div>
      </motion.section>

      {/* Section 4: What You Can Do Here */}
      <motion.section 
        id="what-to-do"
        className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900"
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1}}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ y: 20, opacity: 0}}
            whileInView={{ y: 0, opacity: 1}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What You Can Do Here
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[ 
              { id: 1, icon: <FaComments />, title: "Chat with MindCare AI", text: "Get instant, empathetic support and guidance.", link: "/chat", color: "#6366F1" }, // Indigo
              { id: 2, icon: <FaClipboardCheck />, title: "Access Self-Help Workbooks", text: "Interactive guides for various mental health topics.", link: "/resources", color: "#10B981" }, // Emerald
              { id: 3, icon: <FaUserPlus />, title: "Join Anonymous Peer Groups", text: "Connect with others who understand. (Coming Soon)", link: "#", color: "#0EA5E9" }, // Sky
              { id: 4, icon: <FaChartLine />, title: "Track Your Mood & Progress", text: "Visualize your journey and identify patterns.", link: "/mood-tracker", color: "#F59E0B" }, // Amber
              { id: 5, icon: <GiBrain />, title: "Understand Your Symptoms", text: "Learn more about what you're experiencing.", link: "/learn", color: "#8B5CF6" }, // Violet
              { id: 6, icon: <FaHeart />, title: "Get Tips for Family Support", text: "Help your loved ones understand and support you.", link: "/family-support", color: "#D946EF" }, // Fuchsia
            ].map((action, index) => (
              <MagicCard
                key={action.id}
                className="group cursor-pointer rounded-xl shadow-lg hover:shadow-2xl flex flex-col overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 ease-out h-full"
                gradientSize={200}
                gradientColor={chroma(action.color).alpha(0.15).hex()}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6 flex flex-col items-center text-center flex-grow transform transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                  <div 
                    className={`p-4 rounded-full shadow-md group-hover:shadow-xl mb-6 inline-flex items-center justify-center transition-all duration-300 ease-out transform group-hover:scale-110`}
                    style={{ backgroundColor: chroma(action.color).alpha(0.1).hex() }}
                  >
                    {React.cloneElement(action.icon, { className: `h-10 w-10`, style: { color: action.color } })}
                  </div>
                  <h3 
                    className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300 ease-out"
                    style={{ '--action-card-hover-color': action.color }}
                    onMouseEnter={(e) => e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--action-card-hover-color')}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow min-h-[70px]">{action.text}</p>
                  <motion.button
                    onClick={() => action.link === "#" ? null : navigate(action.link)}
                    className={`mt-auto w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm 
                                ${action.link === "#" 
                                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-700 dark:text-gray-400' 
                                  : `text-white`}
                                focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                    style={action.link !== "#" ? {
                      backgroundColor: action.color, // Use action.color directly for background
                      '--ring-color': action.color,
                    } : { '--ring-color': '#A0AEC0'}}
                    onMouseEnter={(e) => { if (action.link !== "#") e.currentTarget.style.backgroundColor = chroma(action.color).darken(0.2).hex() }} // Slightly darken on hover
                    onMouseLeave={(e) => { if (action.link !== "#") e.currentTarget.style.backgroundColor = action.color }}
                    whileHover={{ scale: action.link === "#" ? 1 : 1.05, boxShadow: action.link === "#" ? 'none' : `0px 6px 12px ${chroma(action.color).alpha(0.4).hex()}`}}
                    whileTap={{ scale: action.link === "#" ? 1 : 0.95 }}
                    disabled={action.link === "#"}
                  >
                    {action.link === "#" ? "Coming Soon" : (action.title.startsWith("Chat") ? "Start Chatting" : "Learn More")}
                    {action.link !== "#" && <FaArrowRight className="ml-2 h-5 w-5" />}
                  </motion.button>
                </div>
              </MagicCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* New Features Section - Alternating Layout */}
    <section 
      id="features" 
      ref={featuresRef} 
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 sm:mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Tools Designed for <span className="text-indigo-600">Your Wellbeing</span>
          </motion.h2>
          <motion.p 
            className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Explore interactive resources and compassionate support systems, crafted to empower your mental health journey with clarity and ease.
          </motion.p>
        </div>

        {/* Replace the HoverEffect component with MagicCard components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const link = feature.title.toLowerCase().includes('chat') ? '/chat' :
                         feature.title.toLowerCase().includes('mood') ? '/mood-tracker' :
                         feature.title.toLowerCase().includes('assessment') ? '/phq9' :
                         '/resources';
            const buttonText = feature.title.includes('Chat') ? "Start Chatting" : "Learn More";

            return (
              <MagicCard
                key={index}
                className="group cursor-pointer rounded-xl shadow-lg hover:shadow-2xl flex flex-col overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 ease-out"
                gradientSize={250}
                gradientColor={chroma(feature.color).alpha(0.25).hex()} // Use feature color for gradient, slightly transparent
              >
                <div className="p-6 flex flex-col items-center text-center flex-grow transform transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                  <div 
                    className={`p-4 rounded-full shadow-md group-hover:shadow-xl mb-6 inline-flex items-center justify-center transition-all duration-300 ease-out transform group-hover:scale-110`}
                    style={{ backgroundColor: chroma(feature.color).alpha(0.1).hex() }} // Lighter, more transparent background for icon container
                  >
                    {React.cloneElement(feature.icon, { className: `h-10 w-10`, style: { color: feature.color } })}
                  </div>
                  <h3 
                    className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300 ease-out"
                    style={{ '--feature-color-dynamic': feature.color }} // Define CSS variable for hover color
                    onMouseEnter={(e) => e.currentTarget.style.color = e.currentTarget.style.getPropertyValue('--feature-color-dynamic')}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''} // Revert to CSS-defined color
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow min-h-[60px]">{feature.description}</p>
                  <motion.button
                    onClick={() => link === "#" ? null : navigate(link)}
                    className={`mt-auto w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${link === "#" ? 'bg-gray-400 cursor-not-allowed text-gray-700' : `text-white bg-teal-500 hover:bg-teal-600`} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                    whileHover={{ scale: link === "#" ? 1 : 1.05 }}
                    whileTap={{ scale: link === "#" ? 1 : 0.95 }}
                    disabled={link === "#"}
                  >
                    {link === "#" ? "Coming Soon" : buttonText}
                    {link !== "#" && <FaArrowRight className="ml-2 h-5 w-5" />}
                  </motion.button>
                </div>
              </MagicCard>
            );
          })}
        </div>
      </div>
    </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                value: "24/7",
                label: "Availability",
                description: "Support whenever you need it",
              },
              {
                value: "95%",
                label: "User Satisfaction",
                description: "Report feeling better after use",
              },
              {
                value: "10K+",
                label: "Active Users",
                description: "Trusting our platform daily",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <motion.div
                  className="text-4xl sm:text-5xl font-extrabold mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-lg sm:text-xl font-medium">{stat.label}</div>
                <p className="mt-2 text-indigo-100 text-sm sm:text-base">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* End Why Choose MindCare Section */}

      {/* Testimonials Section */}
      <section
        id="stories"
        className="py-8 sm:py-10 md:py-12 bg-gray-50 dark:bg-neutral-800 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500 to-transparent opacity-10 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Real Stories
            </motion.span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Voices of Healing
            </h2>
            <p className="mt-2 sm:mt-3 max-w-xl mx-auto text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-300">
              Discover how our community is finding hope and support.
            </p>
          </motion.div>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <AnimatedTestimonials />
          </div>
        </div>
      </section>

      {/* End Testimonials Section */}

      {/* Resources Section */}
      <section
        id="resources"
        className="py-12 sm:py-16 md:py-20 bg-white dark:bg-neutral-900 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500 to-transparent opacity-10 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Knowledge Base
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Helpful Resources
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-300">
              Educational materials and additional support options.
            </p>
          </motion.div>

          <SliderContainer 
            itemWidth={320} 
            gap={24} 
            visibleItems={3} 
            autoPlay={true} 
            autoPlayInterval={7000}
            className="mt-10 sm:mt-12 md:mt-16"
          >
            {[
              {
                icon: <FaHeart className="text-red-400 dark:text-red-300" />,
                title: "Crisis Support",
                description: "Immediate help if you're in distress. Call 988 or text HOME to 741741.",
                color: "#ef4444", // Red
                buttonText: "Get Help Now",
                buttonAction: () => { /* Could open a modal with numbers or navigate */ alert("Crisis Lines: 988 (Call), HOME to 741741 (Text), 911 (Emergency)"); },
                buttonClass: "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700",
              },
              {
                icon: <FaClipboardCheck className="text-blue-400 dark:text-blue-300" />,
                title: "Educational Articles",
                description: "Learn about mental health, coping strategies, and well-being.",
                color: "#3b82f6", // Blue
                buttonText: "Explore Articles",
                buttonAction: () => navigate('/resources'),
                buttonClass: "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
              },
              {
                icon: <FaComments className="text-green-400 dark:text-green-300" />,
                title: "Community Support",
                description: "Connect with others who understand. Share and find support.",
                color: "#22c55e", // Green
                buttonText: session ? "Visit Community Hub" : "Join to Access Community",
                buttonAction: () => session ? navigate('/community') : navigate('/login'),
                buttonClass: "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700",
              },
              {
                icon: <GiMeditation className="text-purple-400 dark:text-purple-300" />,
                title: "Mindfulness Tools",
                description: "Guided meditations and exercises to calm your mind.",
                color: "#a855f7", // Purple
                buttonText: "Practice Mindfulness",
                buttonAction: () => navigate('/mindfulness'), // Assuming a route
                buttonClass: "bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-700",
              },
              {
                icon: <FaLeaf className="text-teal-400 dark:text-teal-300" />,
                title: "Self-Help Guides",
                description: "Practical guides for managing anxiety, stress, and more.",
                color: "#14b8a6", // Teal
                buttonText: "View Self-Help Guides",
                buttonAction: () => navigate('/self-help'), // Assuming a route
                buttonClass: "bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-600 dark:hover:bg-teal-700",
              }
            ].map((resource, idx) => (
              <MagicCard
                key={idx}
                className="w-full h-[280px] flex flex-col items-center justify-between text-center p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl"
                gradientSize={180}
                gradientColor={chroma(resource.color).alpha(0.2).hex()}
              >
                <div>
                  {resource.icon && <div className="mb-3 text-5xl">{resource.icon}</div>}
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-2">{resource.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-snug">{resource.description}</p>
                </div>
                {resource.buttonText && (
                  <button 
                    onClick={resource.buttonAction} 
                    className={`mt-4 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out w-full 
                      ${resource.buttonClass}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={resource.disabled}
                  >
                    {resource.buttonText}
                  </button>
                )}
              </MagicCard>
            ))}
          </SliderContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              Ready to prioritize your mental health?
            </h2>
            <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-indigo-100">
              Join thousands who have found support and understanding through
              our platform.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <PinContainer 
                title={session ? "Resume your conversation" : "Start your journey to wellbeing"} 
                href={session ? "/chat" : "/login"}
                containerClassName="w-full sm:w-auto"
              >
                <motion.button
                  onClick={() =>
                    session ? navigate("/chat") : navigate("/login")
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border bg-white border-transparent text-lg font-medium rounded-full shadow-lg text-indigo-600 group-hover/pin:scale-105 transition-transform duration-200"
                >
                  {session ? "Continue Your Journey" : "Get Started Now"}
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </PinContainer>
              <motion.button
                onClick={() =>
                  document
                    .getElementById("features")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center px-8 py-4 border-2 hover:text-[#7E11DF] border-white text-lg font-medium rounded-full text-white hover:bg-white hover:bg-opacity-10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Logo and description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center">
                <FaLeaf className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">MindCare</span>
              </div>
              <p className="mt-4 text-gray-400">
                A compassionate mental health support platform powered by AI and
                human understanding.
              </p>
              <div className="mt-6 flex space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map(
                  (Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className="text-gray-400 hover:text-indigo-400"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.a>
                  )
                )}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                {["Home", "Features", "Stories", "Resources"].map((item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-indigo-400"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="mt-4 space-y-2">
                {[
                  "Contact Us",
                  "FAQ",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400">
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="mt-4 text-gray-400">
                Subscribe to our newsletter for mental health tips and updates.
              </p>
              <div className="mt-4 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
                <motion.button
                  onClick={() => console.log('Newsletter subscribe clicked:', document.querySelector('input[type="email"]').value)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p>
              &copy; {new Date().getFullYear()} MindCare. All rights reserved.
            </p>
            <p className="mt-2 text-sm">
              This platform is not a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>
          </motion.div>
        </div>
        {/* Meteors effect container */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <Meteors number={40} />
        </div>
      </footer>
    </div>
  );
};

// Meteors Component - Source: https://ui.aceternity.com/components/meteors
export const Meteors = ({
  number,
  className,
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <motion.span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></motion.span>
      ))}

    </>
  );
};

export default Home;