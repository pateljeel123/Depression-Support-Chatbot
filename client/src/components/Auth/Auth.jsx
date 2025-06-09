import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaShieldAlt, FaUserShield, FaMagic, FaEye, FaEyeSlash, FaHeart, FaHandHoldingHeart, FaBrain, FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';
import { createUserProfileInTable } from '../../services/supabaseClient';

const Auth = ({ initialMode }) => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [preferredTopics, setPreferredTopics] = useState([]);
  const [communicationStyle, setCommunicationStyle] = useState('balanced');
  const [showPreferences, setShowPreferences] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  
  // Security features
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navigate = useNavigate();
  
  // Mood emojis and colors
  const moodData = {
    happy: { emoji: '😊', color: 'from-yellow-300 to-yellow-500' },
    sad: { emoji: '😢', color: 'from-blue-300 to-blue-500' },
    anxious: { emoji: '😰', color: 'from-purple-300 to-purple-500' },
    angry: { emoji: '😠', color: 'from-red-300 to-red-500' },
    neutral: { emoji: '😐', color: 'from-gray-300 to-gray-500' },
    hopeful: { emoji: '🤗', color: 'from-green-300 to-green-500' }
  };

  // Available topics for preferences
  const availableTopics = [
    { id: 'relationship', name: 'Relationship Advice', icon: '💑' },
    { id: 'anxiety', name: 'Anxiety', icon: '😟' },
    { id: 'loneliness', name: 'Loneliness', icon: '🏙️' },
    { id: 'trauma', name: 'Past Trauma', icon: '🕊️' },
    { id: 'gossip', name: 'Need to Talk', icon: '💬' },
    { id: 'self-care', name: 'Self-Care', icon: '🧖' },
    { id: 'motivation', name: 'Motivation', icon: '🚀' },
    { id: 'depression', name: 'Depression', icon: '☁️' },
    { id: 'stress', name: 'Stress', icon: '🧘' }
  ];
  
  // Communication style options
  const communicationStyles = [
    { id: 'direct', name: 'Direct', emoji: '🎯', desc: 'Straightforward advice' },
    { id: 'empathetic', name: 'Empathetic', emoji: '🤗', desc: 'Warm and understanding' },
    { id: 'balanced', name: 'Balanced', emoji: '⚖️', desc: 'Mix of both approaches' },
    { id: 'analytical', name: 'Analytical', emoji: '🧠', desc: 'Detailed perspectives' },
    { id: 'encouraging', name: 'Encouraging', emoji: '🌟', desc: 'Positive reinforcement' }
  ];

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

  // Reset form errors when switching between signup and signin
  useEffect(() => {
    setFormErrors({});
    if (!isSignUp) {
      setName('');
      setConfirmPassword('');
      setAge('');
      setGender('');
      setPreferredTopics([]);
      setCommunicationStyle('balanced');
      setShowPreferences(false);
    }
  }, [isSignUp]);

  // Check for brute force attempts
  useEffect(() => {
    if (loginAttempts >= 3) {
      const now = new Date();
      if (lastAttempt && (now - lastAttempt) < 300000) { // 5 minutes
        setError('Too many failed attempts. Please take a deep breath and try again in 5 minutes.');
        setCurrentMood('anxious');
        setLoading(true);
        const timer = setTimeout(() => {
          setLoading(false);
          setLoginAttempts(0);
          setError(null);
          setCurrentMood('neutral');
        }, 300000);
        return () => clearTimeout(timer);
      }
    }
  }, [loginAttempts, lastAttempt]);

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (isSignUp) {
      if (!name.trim()) errors.name = 'Name is required';
      else if (name.length < 2) errors.name = 'Name must be at least 2 characters';
      
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (passwordStrength < 3) {
        errors.password = 'Password is too weak. Include uppercase, numbers, and symbols.';
      }
      
      // Validate age if provided
      if (age && (isNaN(age) || parseInt(age) < 13 || parseInt(age) > 120)) {
        errors.age = 'Please enter a valid age (13-120)';
      }
    }
    
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    
    if (!password) errors.password = 'Password is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create user profile in users table
  const createUserProfile = async (userId, userData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            fullname: userData.full_name,
            email: email,
            age: userData.age ? parseInt(userData.age) : null,
            gender: userData.gender || null,
            TopicsOfInterest: userData.preferred_topics,
            PreferredCommunication: userData.communication_style,
            current_mood: currentMood
          }
        ]);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  // Check if email is admin
  const checkAdminEmail = async (email) => {
    try {
      const { data, error } = await supabase
        .from('AdminAccess')
        .select('*')
        .eq('admin_email', email)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setCurrentMood('sad');
      return;
    }
    
    // Additional check for password strength during sign-up
    if (isSignUp && passwordStrength < 3) {
      setFormErrors(prev => ({
        ...prev,
        password: 'Please create a stronger password before signing up. Add uppercase letters, numbers, or symbols.'
      }));
      setCurrentMood('sad');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setCurrentMood('hopeful');

    try {
      if (isSignUp) {
        const { data: existingUsers, error: emailCheckError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email);
          
        if (emailCheckError) throw emailCheckError;
        if (existingUsers && existingUsers.length > 0) {
          throw new Error('This email is already registered. Please sign in.');
        }
        
        const adminCheck = await checkAdminEmail(email);
        setIsAdmin(adminCheck);

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullname: name,
              age: age || null,
              gender: gender || null,
              TopicsOfInterest: preferredTopics,
              PreferredCommunication: communicationStyle,
              is_admin: adminCheck,
              current_mood: currentMood
            },
            emailRedirectTo: `${window.location.origin}/chat`
          }
        });

        if (authError) throw authError;
        
        if (authData.user) {
          await createUserProfile(authData.user.id, {
            full_name: name,
            age: age || null,
            gender: gender || null,
            preferred_topics: preferredTopics,
            communication_style: communicationStyle
          });
          
          if (!authData.user.identities || authData.user.identities.length === 0) {
            const { error: verificationError } = await supabase.auth.resend({
              type: 'signup',
              email: email
            });
            
            if (verificationError) throw verificationError;
            setVerificationSent(true);
          }
        }

        setSuccessMessage(verificationSent 
          ? 'Verification email sent! Please check your inbox.' 
          : 'Registration successful! Please check your email for verification.');
          
        setRequiresVerification(true);
        setCurrentMood('happy');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setLoginAttempts(prev => prev + 1);
          setLastAttempt(new Date());
          setCurrentMood('sad');
          throw error;
        }
        
        const isAdminFromMetadata = data.user.user_metadata?.is_admin;
        
        setSuccessMessage('Login successful! Redirecting you to a safe space...');
        setCurrentMood('happy');
        
        setTimeout(() => navigate(isAdminFromMetadata ? '/admin' : '/chat'), 1500);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
      setCurrentMood('sad');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      setCurrentMood('hopeful');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
      // The user will be redirected to Google for authentication,
      // and then back to the redirectTo URL if successful
      
    } catch (error) {
      console.error('Google authentication error:', error);
      setError(error.message || 'An error occurred during Google authentication');
      setCurrentMood('sad');
      setLoading(false);
    }
  };
  
  // Handle user data after OAuth sign-in
  useEffect(() => {
    const handleAuthStateChange = async ({ event, session }) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Check if user exists in our users table
          const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userCheckError && userCheckError.code !== 'PGRST116') {
            console.error('Error checking user:', userCheckError);
          }
          
          // If user doesn't exist in our table, create profile
          if (!existingUser) {
            const adminCheck = await checkAdminEmail(session.user.email);
            
            // Get user details from OAuth provider metadata
            const fullName = session.user.user_metadata?.full_name || 
                            session.user.user_metadata?.name || 
                            'User';
                            
            await createUserProfile(session.user.id, {
              full_name: fullName,
              email: session.user.email,
              age: null,
              gender: null,
              preferred_topics: [],
              communication_style: 'balanced',
              is_admin: adminCheck,
              current_mood: currentMood
            });
            
            // Also create entry in AiChat table if needed
            try {
              await createUserProfileInTable(session.user.id, {
                full_name: fullName,
                age: null,
                gender: null,
                preferred_topics: [],
                communication_style: 'balanced'
              });
            } catch (error) {
              console.error('Error creating AiChat profile:', error);
              // Non-blocking error, continue with auth flow
            }
          }
          
          // Check if user is admin
          const isAdminFromMetadata = session.user.user_metadata?.is_admin;
          const adminCheck = await checkAdminEmail(session.user.email);
          
          if (adminCheck && !isAdminFromMetadata) {
            // Update user metadata to mark as admin
            await supabase.auth.updateUser({
              data: { is_admin: true }
            });
          }
          
          // Navigate based on admin status
          const destination = adminCheck ? '/admin' : '/chat';
          navigate(destination);
          
        } catch (error) {
          console.error('Error processing OAuth sign-in:', error);
        }
      }
    };
    
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, currentMood]);

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      setCurrentMood('sad');
      return;
    }
    
    try {
      setLoading(true);
      setCurrentMood('hopeful');
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSuccessMessage('Password reset link sent to your email! You deserve support.');
      setCurrentMood('happy');
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
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
          <span className={`ml-2 text-xs font-medium ${passwordStrength < 3 ? 'text-red-600' : 'text-gray-600'}`}>{strengthText}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {passwordStrength < 3 ? (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-md p-4 mt-2 shadow-[0_4px_16px_rgba(128,90,213,0.2)]">
              <p className="font-medium text-white/80 mb-2">Password requirements:</p>
              <ul className="space-y-2 text-sm">
                <li className={`flex items-center ${password.length >= 8 ? 'text-green-400' : 'text-white/60'}`}>
                  {password.length >= 8 ? '✓' : '•'} <span className="ml-2">At least 8 characters</span>
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                  {/[A-Z]/.test(password) ? '✓' : '•'} <span className="ml-2">At least one uppercase letter</span>
                </li>
                <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                  {/[0-9]/.test(password) ? '✓' : '•'} <span className="ml-2">At least one number</span>
                </li>
                <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : 'text-white/60'}`}>
                  {/[^A-Za-z0-9]/.test(password) ? '✓' : '•'} <span className="ml-2">At least one special character</span>
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-green-400 font-medium mt-2 flex items-center"><span className="mr-2">✓</span>Your password meets all requirements</p>
          )}
        </div>
      </div>
    );
  };

  // Mood selector component
  const MoodSelector = () => (
    <div className="mb-4">
      <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2">How are you feeling today?</label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(moodData).map(([mood, { emoji }]) => (
          <motion.button
            key={mood}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-base sm:text-xl md:text-2xl p-1.5 sm:p-2 rounded-full ${currentMood === mood ? `bg-gradient-to-br ${moodData[mood].color} text-white shadow-md` : 'bg-gray-800/50 backdrop-blur-sm border border-purple-500/20'}`}
            onClick={() => setCurrentMood(mood)}
            title={mood.charAt(0).toUpperCase() + mood.slice(1)}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 flex items-center justify-center relative overflow-hidden p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full bg-indigo-200/20 opacity-20 blur-[100px] md:blur-[120px] lg:blur-[150px]"
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
        className="absolute bottom-1/3 left-1/4 w-64 h-64 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] rounded-full bg-purple-200/20 opacity-20 blur-[120px] md:blur-[150px] lg:blur-[180px]"
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
      
      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(128,90,213,0.3)] border border-purple-500/30 overflow-hidden transform hover:shadow-[0_12px_40px_rgba(128,90,213,0.4)] transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="text-center mb-8 md:mb-10">
              <motion.div 
                className="flex justify-center mb-6 md:mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-15 h-15 sm:w-18 sm:h-18 md:w-23 md:h-23 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br ${moodData[currentMood].color} flex items-center justify-center shadow-lg ring-4 ring-purple-500/30 ring-offset-4 ring-offset-gray-900 transform hover:rotate-12 transition-all duration-300`}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FaHandHoldingHeart className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent font-heading tracking-tight mb-1 md:mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {isSignUp ? 'Find Your Safe Space' : 'Welcome Back'}
              </motion.h2>
              <p className="text-sm text-gray-100/90 font-medium tracking-wide">
                {isSignUp ? 'Join our compassionate community' : 'Continue your healing journey'}
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
                    {requiresVerification && (
                      <button 
                        onClick={() => {
                          setVerificationSent(false);
                          setRequiresVerification(false);
                        }}
                        className="mt-1 text-xs underline text-green-800 hover:text-green-600"
                      >
                        Resend verification email
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleAuth} className="space-y-6 md:space-y-8">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-start transform hover:scale-[1.02] transition-transform duration-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FaQuestionCircle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {successMessage && (
                  <motion.div 
                    className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-200 px-4 py-3 rounded-xl flex items-start transform hover:scale-[1.02] transition-transform duration-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <FaShieldAlt className="text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name input - only for signup */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="relative group">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 sm:h-14 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 border border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 placeholder-gray-400 group-hover:border-purple-500/30 text-sm sm:text-base"
                        placeholder="Enter your name . . ."
                      />
                      {formErrors.name && (
                        <motion.p 
                          className="mt-1 text-xs sm:text-sm text-red-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {formErrors.name}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email input */}
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 sm:h-12 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 border border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 placeholder-gray-400 group-hover:border-purple-500/30 text-sm sm:text-base"
                  placeholder="Enter your email . . . "
                />
                {formErrors.email && (
                  <motion.p 
                    className="mt-1 text-xs sm:text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formErrors.email}
                  </motion.p>
                )}
              </div>

              {/* Password input */}
              <div className="relative group">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 sm:h-12 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 pr-12 border border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 placeholder-gray-400 group-hover:border-purple-500/30 text-sm sm:text-base"
                    placeholder="Enter your password . . ."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-2"
                  >
                    {showPassword ? <FaEyeSlash className="text-lg sm:text-xl" /> : <FaEye className="text-lg sm:text-xl" />}
                  </button>
                </div>
                {formErrors.password && (
                  <motion.p 
                    className="mt-1 text-xs sm:text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formErrors.password}
                  </motion.p>
                )}
                {isSignUp && renderPasswordStrength()}
              </div>

              {/* Confirm Password - only for signup */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="relative group">
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-12 sm:h-14 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl px-4 pr-12 border border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 placeholder-gray-400 group-hover:border-purple-500/30 text-sm sm:text-base"
                          placeholder="Enter your confirm password . . ."
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-2"
                        >
                          {showConfirmPassword ? <FaEyeSlash className="text-lg sm:text-xl" /> : <FaEye className="text-lg sm:text-xl" />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <motion.p 
                          className="mt-1 text-xs sm:text-sm text-red-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {formErrors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mood Selector */}
              <MoodSelector />

              {/* Submit button */}
              <motion.button
                type="submit"
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="ml-2">{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span className="group-hover:tracking-wider transition-all duration-150">
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </span>
                    <FaMagic className="text-lg sm:text-xl opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-150" />
                  </>
                )}
              </motion.button>

              {/* Google Sign In */}
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-12 sm:h-14 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 shadow-lg shadow-black/20 hover:shadow-black/30 hover:bg-white/15 transform hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-3 group mt-4 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                <FaGoogle className="text-lg sm:text-xl text-red-500 group-hover:text-red-400 transition-colors duration-150" />
                <span className="group-hover:tracking-wider transition-all duration-150">Continue with Google</span>
              </motion.button>

              {/* Toggle between sign up and sign in */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    navigate(isSignUp ? '/login' : '/signup');
                  }}
                  className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-150 hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
        
        {/* Affirmation message */}
        <motion.div 
          className="mt-6 text-center text-xs sm:text-sm text-gray-400/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            animate={{ scale: [1, 1.01, 1] }}
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

export default Auth;