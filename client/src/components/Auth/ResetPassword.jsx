import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';

const ResetPassword = () => {
  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentMood, setCurrentMood] = useState('hopeful');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mood emojis and colors
  const moodData = {
    happy: { emoji: '😊', color: 'from-yellow-300 to-yellow-500' },
    sad: { emoji: '😢', color: 'from-blue-300 to-blue-500' },
    anxious: { emoji: '😰', color: 'from-purple-300 to-purple-500' },
    angry: { emoji: '😠', color: 'from-red-300 to-red-500' },
    neutral: { emoji: '😐', color: 'from-gray-300 to-gray-500' },
    hopeful: { emoji: '🤗', color: 'from-green-300 to-green-500' }
  };

  // Password strength checker
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    
    // Length check
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    return Math.min(strength, 5); // Max strength is 5
  };

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      errors.password = 'Password is too weak. Include uppercase, numbers, and symbols.';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setCurrentMood('sad');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setCurrentMood('hopeful');

    try {
      // Check for token in both hash and query parameters
      let accessToken = null;
      
      // First try to get token from hash (fragment) - some Supabase versions use this
      if (location.hash) {
        const hash = location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        accessToken = hashParams.get('access_token');
      }
      
      // If not in hash, try query parameters - newer Supabase versions use this
      if (!accessToken && location.search) {
        const queryParams = new URLSearchParams(location.search);
        accessToken = queryParams.get('token') || queryParams.get('access_token');
      }
      
      // If still no token, check if we're in an authenticated session already
      if (!accessToken) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.access_token) {
          accessToken = sessionData.session.access_token;
        }
      }
      
      if (!accessToken) {
        throw new Error('No access token found. Please try the reset link again.');
      }

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setSuccessMessage('Your password has been successfully reset! You can now log in with your new password.');
      setCurrentMood('happy');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'An error occurred during password reset');
      setCurrentMood('sad');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const renderPasswordStrength = () => {
    if (!password) return null;
    
    const strengthText = [
      'Very Weak',
      'Weak',
      'Moderate',
      'Strong',
      'Very Strong'
    ][Math.floor(passwordStrength / 5 * 4)];
    
    const strengthColor = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-blue-500',
      'bg-green-500'
    ][Math.floor(passwordStrength / 5 * 4)];
    
    return (
      <div className="mt-1">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${strengthColor}`} 
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-gray-600">{strengthText}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {passwordStrength < 3 && 'Tip: Add uppercase letters, numbers, and symbols to strengthen your password.'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div 
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-200 opacity-20 blur-3xl"
        initial={{ x: 100, y: -100, scale: 0.8 }}
        animate={{ 
          x: [100, 120, 100], 
          y: [-100, -80, -100],
          scale: [0.8, 0.85, 0.8]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-purple-200 opacity-20 blur-3xl"
        initial={{ x: -100, y: 100, scale: 0.7 }}
        animate={{ 
          x: [-100, -80, -100], 
          y: [100, 120, 100],
          scale: [0.7, 0.75, 0.7]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(128,90,213,0.25)] border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div 
                className="flex justify-center mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${moodData[currentMood].color} flex items-center justify-center shadow-lg`}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaLock className="text-white text-3xl" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Reset Your Password
              </motion.h2>
              <p className="mt-2 text-gray-600">
                Create a new secure password for your account
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="mr-2">😔</span>
                  <div>
                    <span className="block sm:inline">{error}</span>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-1 text-xs underline text-red-800 hover:text-red-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}

              {successMessage && (
                <motion.div 
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="mr-2">🌟</span>
                  <div>
                    <span className="block sm:inline">{successMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-4" onSubmit={handleResetPassword}>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10`}
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                  {renderPasswordStrength()}
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10`}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 ${loading ? 'bg-purple-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600'} text-white font-medium rounded-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">
                        <FaShieldAlt className="inline" />
                      </span>
                      Reset Password
                    </>
                  )}
                </button>
              </motion.div>

              <div className="text-center pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => navigate('/login')} 
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </motion.div>
        
        {/* Affirmation message */}
        <motion.div 
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            {currentMood === 'happy' && "You're doing great! Keep shining 🌟"}
            {currentMood === 'sad' && "It's okay to not be okay. We're here for you ❤️"}
            {currentMood === 'anxious' && "Breathe. This is a safe space. You're not alone 🧘"}
            {currentMood === 'angry' && "Your feelings are valid. Let's work through this together 💪"}
            {currentMood === 'neutral' && "Every journey begins with a single step 🚶‍♂️"}
            {currentMood === 'hopeful' && "Better days are ahead. We believe in you ✨"}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;