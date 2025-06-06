
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);

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
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight transform-gpu"
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
              Let's Walk Together.
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
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.1, rotateY: 10 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 border border-purple-400/20"
            >
              <Sparkles className="mr-2" />
              Join Our Community
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, rotateY: -10 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200 px-12 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-lg mb-4 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ rotateX: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <ArrowDown size={32} className="text-purple-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
