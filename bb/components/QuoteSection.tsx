
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const QuoteSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic 3D background */}
      <motion.div
        style={{ y, rotateX }}
        className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
      />
      
      {/* Animated constellation background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
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
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-400/50" />
            {/* Connection lines */}
            {i < 10 && (
              <motion.div
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                className="absolute w-20 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent transform rotate-45 origin-left"
              />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        ref={inViewRef}
        style={{ scale }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto perspective-1000"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1.5 }}
          className="relative"
        >
          {/* 3D Quote icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
            animate={inView ? { opacity: 1, scale: 1, rotateZ: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            whileHover={{ scale: 1.2, rotateY: 360 }}
            className="flex justify-center mb-8"
          >
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10">
              <Quote size={48} className="text-purple-300" />
            </div>
          </motion.div>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.8 }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            className="text-4xl md:text-6xl font-light text-white leading-relaxed mb-12 transform-gpu"
            style={{
              textShadow: '0 0 30px rgba(168, 85, 247, 0.3)'
            }}
          >
            The bravest thing I ever did was{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              continuing my life
            </span>{' '}
            when I wanted to die.
          </motion.blockquote>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="relative"
          >
            <div className="text-2xl text-purple-200 font-medium mb-4">
              — You are stronger than you know
            </div>
            
            {/* Floating hearts */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -30, 0],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.8
                  }}
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${Math.random() * 20}%`
                  }}
                >
                  💜
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Gradient overlay with 3D effect */}
      <motion.div 
        style={{ y: y.get() * -0.5 }}
        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent pointer-events-none"
      />
    </section>
  );
};

export default QuoteSection;
