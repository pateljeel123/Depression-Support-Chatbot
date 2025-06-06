
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, Heart, Clock, Shield, TrendingUp, Users } from 'lucide-react';

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
            Experience the difference our comprehensive approach makes in your healing journey
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                x: index % 2 === 0 ? -100 : 100,
                rotateY: index % 2 === 0 ? -45 : 45,
                scale: 0.5
              }}
              animate={inView ? { 
                opacity: 1, 
                x: 0,
                rotateY: 0,
                scale: 1
              } : {}}
              transition={{ 
                duration: 1, 
                delay: 0.3 + index * 0.2,
                type: "spring",
                stiffness: 80
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: index % 2 === 0 ? 10 : -10,
                z: 50
              }}
              className="group perspective-1000"
            >
              <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${benefit.color} bg-opacity-10 backdrop-blur-xl border border-white/10 shadow-2xl transform-gpu overflow-hidden`}>
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
                
                <div className="flex items-start space-x-6 relative z-10">
                  <motion.div
                    whileHover={{ 
                      scale: 1.3, 
                      rotateZ: 360,
                      rotateY: 180
                    }}
                    transition={{ duration: 0.8 }}
                    className="flex-shrink-0"
                  >
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-3xl shadow-2xl relative`}>
                      {benefit.emoji}
                      {/* Icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <benefit.icon size={24} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.2, rotateZ: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {/* Floating particles inside card */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -25, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.7
                      }}
                      className="absolute w-2 h-2 bg-white/40 rounded-full"
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

        {/* Call to Action with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="text-center mt-20 perspective-1000"
        >
          <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotateZ: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              💝
            </motion.div>
            <div className="text-left">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
              <p className="text-xl text-gray-300">Join thousands who have found hope and healing in our community</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
