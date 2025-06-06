
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

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
                duration: 1, 
                delay: 0.2 + index * 0.3,
                type: "spring",
                stiffness: 80
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                z: 100
              }}
              className="group perspective-1000"
            >
              <Card className={`h-full bg-gradient-to-br ${solution.bgColor} backdrop-blur-xl border border-white/10 shadow-2xl transform-gpu overflow-hidden relative`}>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl`} />
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotateZ: 360,
                      rotateY: 180
                    }}
                    transition={{ duration: 0.8 }}
                    className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${solution.color} mb-6 shadow-2xl mx-auto`}
                  >
                    <solution.icon size={40} className="text-white" />
                  </motion.div>
                  
                  <CardTitle className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg leading-relaxed">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  <ul className="space-y-4">
                    {solution.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.3 + featureIndex * 0.1 }}
                        className="flex items-center space-x-4"
                      >
                        <motion.div
                          whileHover={{ scale: 1.3, rotateZ: 360 }}
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${solution.color} shadow-lg`}
                        />
                        <span className="text-gray-300 text-lg">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.3 }}
                    className="pt-6"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${solution.color} hover:shadow-2xl hover:shadow-purple-500/25 text-white font-semibold py-4 rounded-2xl transition-all duration-300 group/btn`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Learn More
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight size={20} />
                          </motion.div>
                        </span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>

                {/* Floating particles inside card */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.8
                      }}
                      className="absolute"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${30 + i * 15}%`
                      }}
                    >
                      <Sparkles size={16} className="text-white/30" />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
