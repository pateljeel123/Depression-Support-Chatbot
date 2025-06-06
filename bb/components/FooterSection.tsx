
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const FooterSection = () => {
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

  const socialIcons = [
    { name: 'Facebook', icon: '📘', link: '#', color: 'from-blue-500 to-blue-600' },
    { name: 'Twitter', icon: '🐦', link: '#', color: 'from-cyan-500 to-blue-500' },
    { name: 'Instagram', icon: '📷', link: '#', color: 'from-pink-500 to-purple-500' },
    { name: 'LinkedIn', icon: '💼', link: '#', color: 'from-blue-600 to-indigo-600' }
  ];

  const quickLinks = [
    { name: 'About Us', link: '#' },
    { name: 'Our Services', link: '#' },
    { name: 'Support Groups', link: '#' },
    { name: 'Resources', link: '#' },
    { name: 'Contact', link: '#' },
    { name: 'Privacy Policy', link: '#' }
  ];

  const contactInfo = [
    { icon: Phone, text: 'Crisis Hotline: 988', color: 'from-red-500 to-pink-500' },
    { icon: Mail, text: 'support@depression-support.com', color: 'from-purple-500 to-indigo-500' },
    { icon: MapPin, text: '24/7 Support Available', color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <footer ref={ref} className="relative bg-gradient-to-t from-black via-gray-950 to-gray-900 text-white overflow-hidden">
      {/* 3D Background elements */}
      <motion.div
        style={{ y, rotateY }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl" />
      </motion.div>

      {/* Newsletter Section with 3D effects */}
      <motion.div
        ref={inViewRef}
        style={{ y }}
        className="relative py-20 border-b border-gray-800/50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl mx-auto perspective-1000"
          >
            <motion.h3 
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Stay Connected
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              Get weekly inspiration, mental health tips, and community updates delivered to your inbox
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex-1"
              >
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 h-14 text-lg backdrop-blur-xl"
                />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, rotateY: 10 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 h-14 text-lg font-semibold rounded-xl shadow-2xl shadow-purple-500/25">
                  Subscribe
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Footer Content with 3D cards */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: -45 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="md:col-span-2 perspective-1000"
            >
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-800/20 to-gray-900/20 backdrop-blur-xl border border-gray-700/30">
                <motion.h2 
                  whileHover={{ scale: 1.05 }}
                  className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                >
                  Depression Support
                </motion.h2>
                <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                  We believe that everyone deserves access to mental health support. 
                  Our mission is to create a safe, welcoming community where healing happens together.
                </p>
                
                <div className="flex space-x-4">
                  {socialIcons.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      whileHover={{ 
                        scale: 1.3, 
                        rotateY: 360,
                        y: -5
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${social.color} flex items-center justify-center text-2xl shadow-2xl transform-gpu`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: 45 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              whileHover={{ scale: 1.02, rotateY: -5 }}
              className="perspective-1000"
            >
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-800/20 to-gray-900/20 backdrop-blur-xl border border-gray-700/30 h-full">
                <h3 className="text-2xl font-semibold mb-8 text-purple-300">Quick Links</h3>
                <ul className="space-y-4">
                  {quickLinks.slice(0, 3).map((link, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 10, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <a 
                        href={link.link}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-lg flex items-center"
                      >
                        <motion.span
                          whileHover={{ rotateZ: 360 }}
                          className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"
                        />
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: 45 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              whileHover={{ scale: 1.02, rotateY: -5 }}
              className="perspective-1000"
            >
              <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-800/20 to-gray-900/20 backdrop-blur-xl border border-gray-700/30 h-full">
                <h3 className="text-2xl font-semibold mb-8 text-cyan-300">Contact</h3>
                <ul className="space-y-6">
                  {contactInfo.map((contact, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center space-x-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotateZ: 360 }}
                        className={`p-2 rounded-lg bg-gradient-to-r ${contact.color}`}
                      >
                        <contact.icon size={20} className="text-white" />
                      </motion.div>
                      <span className="text-gray-300 text-sm">{contact.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with 3D effects */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="border-t border-gray-800/50 py-8"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p 
              whileHover={{ scale: 1.02 }}
              className="text-gray-400 text-lg mb-4 md:mb-0 flex items-center"
            >
              © 2024 Depression Support. All rights reserved. Built with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-2"
              >
                <Heart className="w-5 h-5 text-red-400 fill-current" />
              </motion.span>
              for healing.
            </motion.p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-6 text-lg text-gray-400"
            >
              <span className="text-red-400 font-semibold">Crisis Hotline: 988</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">24/7 Support Available</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            className="absolute text-2xl"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + i * 15}%`
            }}
          >
            💜
          </motion.div>
        ))}
      </div>
    </footer>
  );
};

export default FooterSection;
