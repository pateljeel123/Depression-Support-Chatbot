
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

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
    <section ref={ref} className="relative py-32 overflow-hidden">
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
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl transform-gpu">
              <CardContent className="p-12 md:p-16">
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
              </CardContent>
            </Card>
          </motion.div>

          {/* 3D Navigation */}
          <div className="flex justify-center items-center space-x-8 mt-12">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.2, rotateY: -15 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25 backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft size={28} />
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
              <ChevronRight size={28} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
