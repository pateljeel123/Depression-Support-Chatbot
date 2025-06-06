
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Brain, Cloud, Heart, Shield } from 'lucide-react';

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
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 100, 
                rotateY: -45,
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
                delay: 0.2 + index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                z: 50
              }}
              className="group perspective-1000"
            >
              <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${problem.color} bg-opacity-10 backdrop-blur-lg border border-white/10 shadow-2xl transform-gpu`}>
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
                
                <motion.div
                  whileHover={{ scale: 1.2, rotateZ: 360 }}
                  transition={{ duration: 0.8 }}
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${problem.color} mb-6 shadow-lg`}
                >
                  <problem.icon size={32} className="text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {problem.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {problem.description}
                </p>

                {/* Floating particles inside card */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      className="absolute w-2 h-2 bg-white/30 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
