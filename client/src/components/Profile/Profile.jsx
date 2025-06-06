import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, User, Mail, Calendar, Key, CheckCircle, AlertCircle, X } from 'lucide-react';

const Profile = () => {
  const { session } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
          const email = session.user.email;
          
          setUserData({
            email,
            name,
          });
          
          setFormValues({
            name,
            email
          });
          
          setLoading(false);
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          setError('Failed to load profile data.');
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('You must be logged in to view this page.');
      }
    };

    fetchUserData();
  }, [session]);

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(userData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      showNotification({
        type: 'success',
        message: 'Password reset link has been sent to your email!',
      });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      showNotification({
        type: 'error',
        message: error.message || 'Failed to send reset password email. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (notification) => {
    setNotification(notification);
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/90 to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-lg bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-gray-800/20 backdrop-blur-lg border border-purple-500/30 shadow-[0_4px_20px_rgba(128,90,213,0.3)]"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="mb-4"
            >
              <Brain className="h-12 w-12 text-purple-400" />
            </motion.div>
            <p className="text-white text-lg">Loading profile...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/90 to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-lg bg-gradient-to-br from-red-500/20 via-red-600/10 to-gray-800/20 backdrop-blur-lg border border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
        >
          <p className="text-red-400 text-lg">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/90 to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-lg bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-gray-800/20 backdrop-blur-lg border border-yellow-500/30 shadow-[0_4px_20px_rgba(234,179,8,0.3)]"
        >
          <p className="text-yellow-400 text-lg">Could not load user data.</p>
        </motion.div>
      </div>
    );
  }

  // Animated background elements
  const FloatingElement = ({ children, delay, duration, x, y }) => (
    <motion.div
      className="absolute opacity-30"
      animate={{
        x: [x, x + 20, x],
        y: [y, y - 20, y],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/90 to-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Notification popup */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md ${notification.type === 'success' ? 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 text-white' : 'bg-gradient-to-r from-red-500/90 to-rose-600/90 text-white'}`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-white/80 hover:text-white focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background elements */}
      <FloatingElement delay={0} duration={5} x={100} y={100}>
        <Brain className="h-24 w-24 text-purple-500/20" />
      </FloatingElement>
      <FloatingElement delay={1} duration={7} x={-150} y={-100}>
        <Sparkles className="h-32 w-32 text-cyan-500/20" />
      </FloatingElement>
      <FloatingElement delay={2} duration={6} x={200} y={-150}>
        <Brain className="h-20 w-20 text-pink-500/20" />
      </FloatingElement>
      <FloatingElement delay={3} duration={8} x={-100} y={200}>
        <Sparkles className="h-28 w-28 text-purple-500/20" />
      </FloatingElement>
      
      {/* Glowing background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] opacity-30">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-600/30 blur-[100px]" 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-cyan-600/30 blur-[100px]" 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-gradient-to-br from-gray-900/90 via-purple-950/80 to-gray-900/90 rounded-xl shadow-[0_8px_30px_rgba(128,90,213,0.3)] overflow-hidden border border-purple-500/30 backdrop-blur-xl relative z-10"
      >
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-900/50 via-purple-800/30 to-purple-900/50 p-6 sm:p-8 border-b border-purple-500/30"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-semibold shadow-[0_4px_20px_rgba(128,90,213,0.4)] flex-shrink-0 relative z-10">
                {formValues.name ? formValues.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <motion.div 
                className="absolute -inset-1 rounded-full opacity-70 blur-sm bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{formValues.name}</h1>
              <p className="text-sm text-purple-200/80 mt-1">{formValues.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Details Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label htmlFor="name" className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <User className="h-3 w-3" /> Full Name
              </label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-md text-white text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                placeholder="Your full name"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="email" className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-md text-white text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200"
                placeholder="Your email address"
                readOnly
              />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label htmlFor="joinedDate" className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Joined Date
            </label>
            <div className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-md text-white text-sm shadow-inner flex items-center">
              <p id="joinedDate" className="flex-grow">
                {session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </motion.div>

          {/* Actions Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-6 border-t border-purple-500/30"
          >
            <motion.button
              onClick={handleChangePassword}
              whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(129,140,248,0.6)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-2.5 px-6 rounded-md shadow-[0_4px_10px_rgba(129,140,248,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 ease-in-out flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="h-4 w-4" />
                  </motion.div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  <span>Reset Password</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Footer with animated gradient */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="p-4 border-t border-purple-500/30 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/5 to-purple-600/10" 
              animate={{ 
                x: ['-100%', '100%'],
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
          </div>
          <p className="text-xs text-purple-300/70 relative z-10">
            Manage your profile settings and preferences
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;