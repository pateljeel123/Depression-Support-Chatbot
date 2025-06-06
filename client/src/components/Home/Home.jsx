import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AudioPlayer, HoverSoundProvider, useHoverSound } from "../AudioComponents";
import {
  FaHeart,
  FaComments,
  FaChartLine,
  FaClipboardCheck,
  FaArrowRight,
  FaQuoteLeft,
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaUserPlus,
  FaUserCircle,
  FaLeaf,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { GiBrain, GiMeditation, GiHeartBeats } from "react-icons/gi";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import { Brain, Cloud, Heart, Shield, Users, BookOpen, Sparkles, ArrowRight, Clock, TrendingUp, ArrowDown, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { EnhancedMeteors } from "../magicui/enhanced-meteors";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSound } = useHoverSound();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Hover sound handler
  const handleMouseEnter = () => {
    playSound();
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.scrollBehavior = "smooth";
    document.body.style.backgroundColor = "#0a0a0f";
    return () => {
      document.body.style.scrollBehavior = "auto";
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-950">
      {/* Enhanced progress indicator with glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 z-50 shadow-lg shadow-purple-500/50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />
      
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Problem Section */}
      <ProblemSection />
      
      {/* Quote Section */}
      <QuoteSection />
      
      {/* Solution Section */}
      <SolutionSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Footer Section */}
      <FooterSection />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  const { playSound } = useHoverSound();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);

  // Hover sound handler
  const handleMouseEnter = () => {
    playSound();
  };

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900">
      {/* 3D Background layers */}
      <motion.div
        style={{ y, rotateX }}
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-cyan-900/20"
      />
      
      {/* Animated geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotateZ: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1
            }}
            className={`absolute rounded-full border border-purple-500/20 backdrop-blur-sm`}
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${15 + i * 10}%`,
              top: `${20 + i * 8}%`,
              background: `linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))`
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="perspective-1000"
        >
          <motion.h1
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight transform-gpu"
          >
            Struggling with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent inline-block">
              Depression?
            </span>
            <br />
            <motion.span 
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.5)',
                  '0 0 40px rgba(236, 72, 153, 0.5)',
                  '0 0 20px rgba(168, 85, 247, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-white"
            >
              Let's Talk Together.
            </motion.span>
          </motion.h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-2xl md:text-3xl text-gray-300 mb-12 font-light"
        >
          Discover hope, support & strength in your journey
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate("/chat")}
            onMouseEnter={handleMouseEnter}
            whileHover={{ scale: 1.05, backgroundColor: "#8B5CF6" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-purple-600 text-white rounded-full font-medium text-lg shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Talking Now
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/resources")}
            onMouseEnter={handleMouseEnter}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-medium text-lg backdrop-blur-sm flex items-center justify-center gap-2"
          >
            Explore Resources
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/70 cursor-pointer"
            onClick={() => {
              document.getElementById('problem-section').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-sm">Learn More</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Problem Section Component
const ProblemSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const problems = [
    { 
      title: "Overwhelming Loneliness", 
      description: "Feeling isolated and disconnected from the world around you",
      icon: Heart,
      color: "from-red-500 to-pink-500"
    },
    { 
      title: "Persistent Fatigue", 
      description: "Struggling with exhaustion that sleep doesn't seem to fix",
      icon: Cloud,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Loss of Hope", 
      description: "Difficulty seeing a positive future or finding meaning",
      icon: Brain,
      color: "from-purple-500 to-indigo-500"
    },
    { 
      title: "Social Stigma", 
      description: "Fear of judgment prevents seeking the help you deserve",
      icon: Shield,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section id="problem-section" ref={ref} className="relative py-32 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
      {/* 3D Background elements */}
      <motion.div
        style={{ y, rotateY }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={inViewRef}
          style={{ scale }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 perspective-1000"
          >
            Understanding
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Depression
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Depression affects millions, but you don't have to face it alone. 
            Recognizing these feelings is the first step toward healing.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto overflow-auto overflow-hidden" style={{ scrollBehavior: 'smooth' }}>
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 100, 
                rotateY: -45,
                scale: 0.5
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateY: 0,
                scale: 1
              }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 * index,
                type: "spring",
                stiffness: 100
              }}
              className={`relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br ${problem.color} p-1 cursor-pointer`}
            >
              <div className="bg-gray-900 rounded-xl p-8 h-full">
                <div className="flex items-start gap-6">
                  <motion.div 
                    className={`p-3 rounded-xl bg-gradient-to-br ${problem.color} shadow-lg`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.2,
                      transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                  >
                    {React.createElement(problem.icon, { className: "w-8 h-8 text-white" })}
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{problem.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{problem.description}</p>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 pt-6 border-t border-gray-800"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + 0.2 * index }}
                >
                  <h4 className="text-lg font-semibold text-white mb-3">How it feels:</h4>
                  <ul className="space-y-2">
                    {[
                      "Feeling empty or numb",
                      "Losing interest in activities",
                      "Changes in sleep and appetite",
                      "Difficulty concentrating"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Quote Section Component
const QuoteSection = () => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.2),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.2),transparent_70%)]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={inViewRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <FaQuoteLeft className="mx-auto text-5xl text-purple-500 opacity-50 mb-6" />
          
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl md:text-4xl font-light italic text-white leading-relaxed"
          >
            Depression is not a sign of weakness. It is a sign that you have been trying to be strong for too long.
          </motion.blockquote>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 text-xl text-gray-400"
          >
            — S.B. Williams
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Solution Section Component
const SolutionSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const solutions = [
    {
      icon: Brain,
      title: 'Personal Counseling',
      description: 'One-on-one sessions with licensed therapists who understand your unique journey',
      features: ['Individual therapy', 'Cognitive behavioral therapy', 'Personalized treatment plans'],
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-500/10 to-indigo-500/10'
    },
    {
      icon: Users,
      title: 'Community Support Groups',
      description: 'Connect with others who share similar experiences in a safe, welcoming environment',
      features: ['Weekly group sessions', 'Peer support networks', 'Shared experiences'],
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-500/10 to-rose-500/10'
    },
    {
      icon: BookOpen,
      title: 'Self-Help Resources',
      description: 'Access tools, exercises, and educational materials to support your healing',
      features: ['Guided meditation', 'Mood tracking tools', 'Educational content'],
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-500/10 to-blue-500/10'
    }
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
      {/* 3D floating background elements */}
      <motion.div
        style={{ y, rotateY }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={inViewRef}
          style={{ y }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 perspective-1000"
          >
            How We
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Support You
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Our comprehensive approach combines professional expertise with peer support and self-empowerment tools
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 100, 
                rotateY: -90,
                scale: 0.5
              }}
              animate={inView ? { 
                opacity: 1, 
                y: 0, 
                rotateY: 0,
                scale: 1
              } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 * index,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                z: 100
              }}
              className="group perspective-1000 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl transform-gpu overflow-hidden relative rounded-2xl p-8"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl`} />
              
              <div className="text-center pb-6 relative z-10">
                <motion.div
                  whileHover={{ 
                    scale: 1.2, 
                    rotateZ: 360,
                    rotateY: 180
                  }}
                  transition={{ duration: 0.8 }}
                  className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${solution.color} mb-6 shadow-2xl mx-auto`}
                >
                  {React.createElement(solution.icon, { size: 40, className: "text-white" })}
                </motion.div>
                
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {solution.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {solution.description}
                </p>
              </div>
              
              <div className="space-y-6 relative z-10">
                <ul className="space-y-4">
                  {solution.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.3 + featureIndex * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${solution.color}`}></span>
                      <span className="text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-white/70 hover:text-white group-hover:text-purple-300 transition-colors duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Community Member",
      quote: "Finding this community changed my life. For the first time in months, I felt like I wasn't alone in my struggle.",
      rating: 5,
      avatar: "🌸",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      name: "Michael R.",
      role: "Support Group Participant",
      quote: "The counseling sessions gave me tools I never knew existed. I'm learning to manage my thoughts and emotions better each day.",
      rating: 5,
      avatar: "🌟",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Jennifer L.",
      role: "Recovery Journey",
      quote: "Six months ago, I couldn't get out of bed. Today, I'm helping others find their way out of the darkness. Recovery is possible.",
      rating: 5,
      avatar: "🦋",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "David K.",
      role: "Therapy Graduate",
      quote: "The self-help resources were a game-changer. Having 24/7 access to support tools made all the difference during tough times.",
      rating: 5,
      avatar: "🌱",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
      {/* 3D Animated background */}
      <motion.div
        style={{ y: backgroundY, rotateX }}
        className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950"
      />

      {/* Floating 3D elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 60 - 30, 0],
              rotateZ: [0, 360],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${testimonials[i % testimonials.length].gradient} opacity-40 shadow-lg`} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={inViewRef}
          style={{ y }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 perspective-1000"
          >
            Success
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Stories
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Real stories from real people who found hope and healing in our community
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Main testimonial card with 3D effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -45 }}
            animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative perspective-1000"
          >
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl transform-gpu rounded-2xl">
              <div className="p-12 md:p-16">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -100, rotateY: -90 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  className="text-center"
                >
                  {/* 3D Avatar */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotateY: 360,
                      rotateX: 15
                    }}
                    transition={{ duration: 1 }}
                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${testimonials[currentIndex].gradient} mb-8 text-4xl shadow-2xl`}
                  >
                    {testimonials[currentIndex].avatar}
                  </motion.div>
                  
                  <motion.blockquote 
                    whileHover={{ scale: 1.02, rotateX: 2 }}
                    className="text-2xl md:text-3xl text-white mb-8 font-light leading-relaxed italic"
                    style={{
                      textShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    "{testimonials[currentIndex].quote}"
                  </motion.blockquote>
                  
                  {/* 3D Stars */}
                  <div className="flex justify-center mb-6 gap-2">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotateZ: -180 }}
                        animate={{ scale: 1, rotateZ: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                        whileHover={{ 
                          scale: 1.3, 
                          rotateZ: 360,
                          y: -5
                        }}
                      >
                        <Star className={`w-8 h-8 fill-yellow-400 text-yellow-400 drop-shadow-lg`} />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div>
                    <motion.p 
                      whileHover={{ scale: 1.05 }}
                      className={`font-semibold text-2xl bg-gradient-to-r ${testimonials[currentIndex].gradient} bg-clip-text text-transparent mb-2`}
                    >
                      {testimonials[currentIndex].name}
                    </motion.p>
                    <p className="text-gray-400 text-lg">{testimonials[currentIndex].role}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* 3D Navigation */}
          <div className="flex justify-center items-center space-x-8 mt-12">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.2, rotateY: -15 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25 backdrop-blur-sm border border-white/10"
            >
              <FaChevronLeft size={28} />
            </motion.button>

            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.4, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? `bg-gradient-to-r ${testimonials[index].gradient} shadow-lg` 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.2, rotateY: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-2xl shadow-cyan-500/25 backdrop-blur-sm border border-white/10"
            >
              <FaChevronRight size={28} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Benefits Section Component
const BenefitsSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const benefits = [
    {
      title: "Reduced Isolation",
      description: "Connect with a community that understands your journey",
      icon: Users,
      color: "from-purple-500 to-indigo-500",
      emoji: "🤝"
    },
    {
      title: "Access to Professionals",
      description: "Licensed therapists and counselors available when you need them",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      emoji: "👩‍⚕️"
    },
    {
      title: "24/7 Community Support",
      description: "Round-the-clock access to peer support and resources",
      icon: Clock,
      color: "from-cyan-500 to-blue-500",
      emoji: "🌙"
    },
    {
      title: "Scientifically Proven Methods",
      description: "Evidence-based therapeutic approaches tailored to your needs",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      emoji: "🔬"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your mental health journey with personalized tools",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      emoji: "📊"
    },
    {
      title: "Safe Environment",
      description: "Confidential, judgment-free space to share and heal",
      icon: Shield,
      color: "from-violet-500 to-purple-500",
      emoji: "🛡️"
    }
  ];

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
      {/* 3D Background layers */}
      <motion.div
        style={{ y, rotateY }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={inViewRef}
          style={{ y }}
          className="text-center mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 perspective-1000"
          >
            Why Choose
            <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Our Support?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            We're committed to providing accessible, effective mental health support
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 50,
                scale: 0.9
              }}
              animate={inView ? { 
                opacity: 1, 
                y: 0,
                scale: 1
              } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 * index
              }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group"
            >
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${benefit.color} shadow-lg text-2xl flex items-center justify-center`}>
                  <span>{benefit.emoji}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-medium text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 mx-auto"
          >
            Start Your Journey Today
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Section Component
const FooterSection = () => {
  return (
    <footer className="relative bg-gray-950 text-white pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">
              MindCare
            </h2>
            <p className="text-gray-400 mb-6">
              Supporting your mental health journey with compassion, understanding, and evidence-based resources.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: "#a855f7" }}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
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
              {[
                "Home",
                "About Us",
                "Services",
                "Resources",
                "Contact",
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-500 hover:text-indigo-400">
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
                  <a href="#" className="text-gray-500 hover:text-indigo-400">
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
            <p className="mt-4 text-gray-500">
              Subscribe to our newsletter for mental health tips and updates.
            </p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-r-lg"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-500"
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
      
      {/* Enhanced Meteors effect container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <EnhancedMeteors 
          number={30}
          density="high" 
          speed="medium" 
          color="purple" 
          className="w-full h-full" 
        />
      </div>
    </footer>
  );
};

// Wrap the export with the HoverSoundProvider
export default function HomeWithSound() {
  return (
    <HoverSoundProvider>
      <Home />
    </HoverSoundProvider>
  );
};
