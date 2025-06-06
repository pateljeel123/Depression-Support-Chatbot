
import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProblemSection from '../components/ProblemSection';
import QuoteSection from '../components/QuoteSection';
import SolutionSection from '../components/SolutionSection';
import TestimonialsSection from '../components/TestimonialsSection';
import BenefitsSection from '../components/BenefitsSection';
import FooterSection from '../components/FooterSection';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
    document.body.style.scrollBehavior = 'smooth';
    document.body.style.backgroundColor = '#0a0a0f';
    return () => {
      document.body.style.scrollBehavior = 'auto';
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
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
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
      
      <HeroSection />
      <ProblemSection />
      <QuoteSection />
      <SolutionSection />
      <TestimonialsSection />
      <BenefitsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
