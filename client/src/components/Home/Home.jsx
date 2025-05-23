import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
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
  FaLeaf,
} from "react-icons/fa";
import { GiBrain, GiMeditation, GiHeartBeats } from "react-icons/gi";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
// Note: Most 3D elements (Canvas, OrbitControls, Stars, Float, BrainModel, FloatingIcon, FeatureModel)
// have been removed or their usage significantly reduced to address performance issues and lags.
// Framer Motion will be primarily used for animations.

// Simplified icon component for features
const FeatureIcon = ({ icon, color }) => {
  return (
    <div className={`p-4 rounded-full shadow-lg`} style={{ backgroundColor: color }}>
      {React.cloneElement(icon, { className: "h-8 w-8 text-white" })}
    </div>
  );
};

const Home = () => {
  const { session, signOut } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // This state seems unused, consider removing if not needed for other parts.
  const controls = useAnimation(); // Retained for other potential animations, but hero parallax is handled differently.
  const navigate = useNavigate();
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
      <motion.div
        ref={ref}
        className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 py-12 md:py-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        initial="hidden"
        animate={itemControls} // Animate the whole card container if needed, or rely on inner elements
      >
        {/* Text Content */}
        <motion.div 
          className="md:w-1/2 text-center md:text-left"
          variants={contentVariants}
        >
          <div className="inline-block mb-6">
            <FeatureIcon icon={feature.icon} color={feature.color} />
          </div>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{feature.title}</h3>
          <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-6">{feature.description}</p>
          <motion.button
            onClick={() => navigate(feature.title.toLowerCase().includes('chat') ? '/chat' : '/resources')}
            className="px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-lg transition-transform duration-300 ease-out transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: feature.color }}
            whileHover={{ boxShadow: `0px 10px 20px -5px ${feature.color}77`}}
          >
            Learn More <FaArrowRight className="inline ml-2" />
          </motion.button>
        </motion.div>
        {/* Image/Visual Placeholder */}
        <motion.div 
          className="md:w-1/2 w-full h-64 sm:h-80 md:h-96 mt-8 md:mt-0 rounded-xl shadow-2xl overflow-hidden group relative bg-gray-200"
          variants={imageVariants}
        >
          <img 
            src={`https://source.unsplash.com/random/800x600?${feature.title.split(' ')[0].toLowerCase()}&sig=${index}`}
            alt={feature.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
           <div className="absolute bottom-4 left-4 p-2 bg-black/50 rounded">
             {React.cloneElement(feature.icon, { className: "h-10 w-10 text-white opacity-80" })}
           </div>
        </motion.div>
      </motion.div>
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
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white overflow-hidden"
        // Removed ref={heroRef} from section, parallax is applied to the content div below
      >
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline // Important for mobile playback
            className="w-full h-full object-cover filter brightness-75"
            // Replace with your actual 4K video URL or local path if hosted in public folder
            // Using a placeholder video from Pexels for demonstration
            src="https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4" 
            poster="https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" // Poster image
          >
            Your browser does not support the video tag.
          </video>
          {/* Overlay to darken the video for better text readability - can be adjusted or removed if brightness filter on video is enough */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <motion.div
          ref={heroRef} // This div will have the parallax effect
          className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[85vh] sm:min-h-[90vh] text-center px-4"
          // Parallax is handled by direct style manipulation in useEffect
        >
          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-xl"
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 120, damping: 20 }}
          >
            You’re Not Alone. <br className="sm:hidden"/> <span className="block sm:inline text-yellow-300">Find Your Path to Light.</span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Millions experience depression. If you feel lost, overwhelmed, or empty—you're not broken, you're human. We provide the tools and support to guide you towards clarity, connection, and renewed hope.
          </motion.p>
            <motion.div
              className="mt-10 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, staggerChildren: 0.1 }}
            >
              <motion.button
                onClick={() => navigate("/phq9")} 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-400 text-lg font-semibold rounded-lg text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-indigo-900 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95"
                whileHover={{ boxShadow: "0px 0px 25px rgba(250, 204, 21, 0.7)" }}
              >
                <FaClipboardCheck className="mr-3 h-6 w-6" />
                Free Mental Health Check
              </motion.button>
              <motion.button
                onClick={() => navigate("/chat")}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95"
                whileHover={{ boxShadow: "0px 0px 25px rgba(16, 185, 129, 0.7)" }}
              >
                <FaComments className="mr-3 h-6 w-6" />
                Talk to MindCare AI
              </motion.button>
              <motion.button
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-purple-400 text-lg font-semibold rounded-lg text-purple-400 bg-transparent hover:bg-purple-400 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95"
                whileHover={{ boxShadow: "0px 0px 25px rgba(192, 132, 252, 0.7)" }}
              >
                <GiBrain className="mr-3 h-6 w-6" />
                Explore Self-Help Tools
              </motion.button>
            </motion.div>
          

          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="relative w-full max-w-4xl">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-2xl blur opacity-75"
                animate={{
                  opacity: [0.5, 0.75, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative bg-white rounded-2xl p-1">
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <div className="flex justify-center space-x-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoMdHappy className="h-10 w-10 text-green-500" />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoMdSad className="h-10 w-10 text-blue-500" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    How are you feeling today?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Our AI companion is ready to listen whenever you need
                    support.
                  </p>
                  <motion.button
                    onClick={() =>
                      session ? navigate("/chat") : navigate("/login")
                    }
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Share Your Thoughts
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Common Problems People Face Because of Depression */}
      <motion.section 
        id="common-problems"
        className="py-20 bg-gray-50"
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1}}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 text-center mb-4"
            initial={{ y: 20, opacity: 0}}
            whileInView={{ y: 0, opacity: 1}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Depression isn’t just sadness. It affects every corner of your life.
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 text-center mb-12"
            initial={{ y: 20, opacity: 0}}
            whileInView={{ y: 0, opacity: 1}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Top Problems Faced:
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { icon: "🛏️", title: "Sleep Issues", text: "Trouble falling asleep, oversleeping, or feeling tired all day" },
              { icon: "🍽️", title: "Changes in Appetite", text: "Eating too much or too little, without enjoyment" },
              { icon: "🙇‍♀️", title: "Low Energy & Motivation", text: "Difficulty getting out of bed or starting daily tasks" },
              { icon: "💔", title: "Isolation", text: "Pulling away from friends, family, and social activities" },
              { icon: "🧠", title: "Negative Thoughts", text: "Feeling worthless, hopeless, or excessively guilty" },
              { icon: "💼", title: "Work/School Struggles", text: "Poor focus, memory issues, or lack of interest in tasks" },
              { icon: "😟", title: "Physical Aches", text: "Unexplained pain or discomfort in the body" },
              { icon: "💬", title: "Suicidal Thoughts", text: "Feeling like life isn’t worth living (If you are in crisis, please seek immediate help)" },
            ].map((problem, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30, scale: 0.95}}
                whileInView={{ opacity: 1, y: 0, scale: 1}}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{problem.title}</h3>
                <p className="text-gray-600 text-sm">{problem.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20}}
            whileInView={{ opacity: 1, y: 0}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-700 mb-2">Not sure if what you're feeling is depression?</p>
            <motion.button
              onClick={() => navigate("/phq9")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Take the Depression Self-Screening Quiz <FaArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Why This Platform? */}
      <motion.section 
        id="why-platform"
        className="py-20 bg-indigo-50"
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1}}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 text-center mb-12"
            initial={{ y: 20, opacity: 0}}
            whileInView={{ y: 0, opacity: 1}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose MindCare?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[ 
              { icon: "🧠", title: "Evidence-Based Tools", text: "Guided by the latest psychology and neuroscience" },
              { icon: "💬", title: "Private & Confidential", text: "No judgments, just safe conversations" },
              { icon: "👂", title: "Real Human Support", text: "From trained therapists and empathetic listeners (AI-assisted for now)" },
              { icon: "📱", title: "Easy Access", text: "Anytime, anywhere, at your pace" },
            ].map((reason, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                initial={{ opacity: 0, y: 30, scale: 0.95}}
                whileInView={{ opacity: 1, y: 0, scale: 1}}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                <div className="text-5xl mb-4 inline-block p-3 bg-indigo-100 rounded-full text-indigo-600">{reason.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{reason.title}</h3>
                <p className="text-gray-600 text-sm">{reason.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 4: What You Can Do Here */}
      <motion.section 
        id="what-to-do"
        className="py-20 bg-white"
        initial={{ opacity: 0}}
        whileInView={{ opacity: 1}}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 text-center mb-12"
            initial={{ y: 20, opacity: 0}}
            whileInView={{ y: 0, opacity: 1}}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What You Can Do Here
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ 
              { icon: <FaComments className="h-8 w-8 text-indigo-600"/>, title: "Chat with MindCare AI", text: "Get instant, empathetic support and guidance.", link: "/chat" },
              { icon: <FaClipboardCheck className="h-8 w-8 text-green-600"/>, title: "Access Self-Help Workbooks", text: "Interactive guides for various mental health topics.", link: "/resources" },
              { icon: <FaUserPlus className="h-8 w-8 text-blue-600"/>, title: "Join Anonymous Peer Groups", text: "Connect with others who understand. (Coming Soon)", link: "#" },
              { icon: <FaChartLine className="h-8 w-8 text-yellow-600"/>, title: "Track Your Mood & Progress", text: "Visualize your journey and identify patterns.", link: "/mood-tracker" },
              { icon: <GiBrain className="h-8 w-8 text-purple-600"/>, title: "Understand Your Symptoms", text: "Learn more about what you're experiencing.", link: "/learn" },
              { icon: <FaHeart className="h-8 w-8 text-red-600"/>, title: "Get Tips for Family Support", text: "Help your loved ones understand and support you.", link: "/family-support" },
            ].map((action, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30, scale: 0.95}}
                whileInView={{ opacity: 1, y: 0, scale: 1}}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                <div className="p-3 rounded-full bg-white shadow-md mb-4">{action.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{action.text}</p>
                <motion.button
                  onClick={() => action.link === "#" ? null : navigate(action.link)}
                  className={`mt-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${action.link === "#" ? 'bg-gray-400 cursor-not-allowed' : 'text-white bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm`}
                  whileHover={{ scale: action.link === "#" ? 1 : 1.05 }}
                  whileTap={{ scale: action.link === "#" ? 1 : 0.95 }}
                  disabled={action.link === "#"}
                >
                  {action.link === "#" ? "Coming Soon" : (action.title.startsWith("Chat") ? "Start Chatting" : "Learn More")}
                  {action.link !== "#" && <FaArrowRight className="ml-2 h-4 w-4" />}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* New Features Section - Alternating Layout */}
    <section 
      id="features" 
      ref={featuresRef} 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Tools Designed for <span className="text-indigo-600">Your Wellbeing</span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Explore interactive resources and compassionate support systems, crafted to empower your mental health journey with clarity and ease.
          </motion.p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative overflow-hidden">
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
                  className="text-5xl font-extrabold mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xl font-medium">{stat.label}</div>
                <p className="mt-2 text-indigo-100">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="stories"
        className="py-20 bg-gray-50 relative overflow-hidden"
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
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Voices of Healing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover how our community is finding hope and support.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="p-8">
                <FaQuoteLeft className="text-indigo-100 text-4xl absolute top-8 left-8" />
                <div className="relative pl-12">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeTestimonial}
                      className="text-xl text-gray-700 italic"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      {testimonials[activeTestimonial].quote}
                    </motion.p>
                  </AnimatePresence>
                  <div className="mt-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`author-${activeTestimonial}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <p className="text-lg font-semibold text-indigo-600">
                          {testimonials[activeTestimonial].author}
                        </p>
                        <p className="text-gray-500">
                          {testimonials[activeTestimonial].role}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="flex justify-center pb-8">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`mx-1 w-3 h-3 rounded-full ${
                      activeTestimonial === index
                        ? "bg-indigo-600"
                        : "bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.8 }}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section
        id="resources"
        className="py-20 bg-white relative overflow-hidden"
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
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Helpful Resources
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Educational materials and additional support options.
            </p>
          </motion.div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Crisis Support Card */}
              <motion.div
                className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)",
                }}
              >
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaHeart className="text-red-500 mr-2" />
                  Crisis Support
                </h3>
                <p className="mt-3 text-gray-600">
                  Immediate help is available if you're in distress:
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "<strong>988</strong> Suicide & Crisis Lifeline",
                    "<strong>Text HOME to 741741</strong> Crisis Text Line",
                    "<strong>911</strong> Emergency Services",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-red-500 mr-2">•</span>
                      <span
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Articles Card */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
                }}
              >
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaClipboardCheck className="text-blue-500 mr-2" />
                  Educational Articles
                </h3>
                <p className="mt-3 text-gray-600">
                  Learn about mental health and coping strategies:
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Understanding Depression & Anxiety",
                    "Cognitive Behavioral Techniques",
                    "Mindfulness & Meditation Guides",
                    ...(showMore
                      ? [
                          "Building Healthy Relationships",
                          "Managing Stress at Work",
                        ]
                      : []),
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                  <li>
                    <motion.button
                      onClick={() => setShowMore(!showMore)}
                      className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showMore ? "Show less" : "Show more articles"}
                      {showMore ? (
                        <FaChevronUp className="ml-1" />
                      ) : (
                        <FaChevronDown className="ml-1" />
                      )}
                    </motion.button>
                  </li>
                </ul>
              </motion.div>

              {/* Community Card */}
              <motion.div
                className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)",
                }}
              >
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaComments className="text-green-500 mr-2" />
                  Community Support
                </h3>
                <p className="mt-3 text-gray-600">
                  Connect with others who understand your journey:
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Anonymous Support Groups",
                    "Peer-to-Peer Chat Rooms",
                    "Local Therapist Directory",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  onClick={() =>
                    session ? navigate("/chat") : navigate("/login")
                  }
                  className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 5px 15px -3px rgba(5, 150, 105, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Our Community
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden">
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
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to prioritize your mental health?
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-indigo-100">
              Join thousands who have found support and understanding through
              our platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                onClick={() =>
                  session ? navigate("/chat") : navigate("/login")
                }
                className="inline-flex items-center justify-center px-8 py-4 border bg-white border-transparent text-lg font-medium rounded-full shadow-lg text-indigo-600"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {session ? "Continue Your Journey" : "Get Started Now"}
                <FaArrowRight className="ml-2" />
              </motion.button>
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
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400"
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
      </footer>
    </div>
  );
};

export default Home;