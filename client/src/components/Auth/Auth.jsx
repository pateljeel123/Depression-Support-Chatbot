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
            <div className="bg-red-50 border border-red-100 rounded-md p-2 mt-1">
              <p className="font-medium text-red-700">Password requirements:</p>
              <ul className="list-disc list-inside text-red-600 text-xs mt-1">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters {password.length >= 8 && '✓'}</li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>At least one uppercase letter {/[A-Z]/.test(password) && '✓'}</li>
                <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>At least one number {/[0-9]/.test(password) && '✓'}</li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>At least one special character {/[^A-Za-z0-9]/.test(password) && '✓'}</li>
              </ul>
            </div>
          ) : (
            <p className="text-green-600 font-medium">Your password meets the strength requirements ✓</p>
          )}
        </div>
      </div>
    );
  };

  // Mood selector component
  const MoodSelector = () => (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">How are you feeling today?</label>
      <div className="flex space-x-2">
        {Object.entries(moodData).map(([mood, { emoji }]) => (
          <motion.button
            key={mood}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-2xl p-2 rounded-full ${currentMood === mood ? `bg-gradient-to-br ${moodData[mood].color} text-white shadow-md` : 'bg-gray-100'}`}
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Therapeutic floating elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-200 opacity-20 blur-3xl"
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
        className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-200 opacity-20 blur-3xl"
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
      
      {/* Floating hearts */}
      <motion.div
        className="absolute top-1/3 left-1/4 text-4xl text-pink-300 opacity-60"
        initial={{ y: 0, x: 0 }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        ❤️
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-5xl text-blue-300 opacity-60"
        initial={{ y: 0, x: 0 }}
        animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      >
        ☁️
      </motion.div>
      
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <motion.div 
          className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/30"
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
                    <FaHandHoldingHeart className="text-white text-3xl" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {isSignUp ? 'Find Your Safe Space' : 'Welcome Back to Support'}
              </motion.h2>
              <p className="mt-2 text-gray-600">
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

            <form className="space-y-4" onSubmit={handleAuth}>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isSignUp && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                          placeholder="How should we call you?"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    
                    <MoodSelector />
                    
                    <div className="mt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowPreferences(!showPreferences)}
                        className="flex items-center text-sm text-purple-600 hover:text-purple-500 mb-2 transition-colors duration-200"
                      >
                        {showPreferences ? 'Hide Personalization Options' : 'Personalize Your Experience'}
                        <FaQuestionCircle className="ml-1" title="These options help us support you better" />
                      </button>
                      
                      <AnimatePresence>
                        {showPreferences && (
                          <motion.div 
                            className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-100"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-xs text-gray-600 mb-2">These preferences help us personalize your support (all optional)</p>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                                <input
                                  id="age"
                                  name="age"
                                  type="number"
                                  className={`w-full px-3 py-2 rounded-lg border ${formErrors.age ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm`}
                                  placeholder="Your age"
                                  value={age}
                                  onChange={(e) => setAge(e.target.value)}
                                />
                                {formErrors.age && <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>}
                              </div>
                              
                              <div>
                                <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                  id="gender"
                                  name="gender"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                                  value={gender}
                                  onChange={(e) => setGender(e.target.value)}
                                >
                                  <option value="">Prefer not to say</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="non-binary">Non-binary</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Communication Style</label>
                              <div className="grid grid-cols-2 gap-2">
                                {communicationStyles.map(style => (
                                  <motion.div 
                                    key={style.id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-2 rounded-lg border ${communicationStyle === style.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} cursor-pointer`}
                                    onClick={() => setCommunicationStyle(style.id)}
                                  >
                                    <div className="flex items-center">
                                      <span className="text-lg mr-2">{style.emoji}</span>
                                      <div>
                                        <div className="text-xs font-medium">{style.name}</div>
                                        <div className="text-xs text-gray-500">{style.desc}</div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Topics You'd Like Support With</label>
                              <div className="grid grid-cols-2 gap-2">
                                {availableTopics.map(topic => (
                                  <motion.div 
                                    key={topic.id} 
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`topic-${topic.id}`}
                                      type="checkbox"
                                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                      checked={preferredTopics.includes(topic.id)}
                                      onChange={() => {
                                        if (preferredTopics.includes(topic.id)) {
                                          setPreferredTopics(preferredTopics.filter(t => t !== topic.id));
                                        } else {
                                          setPreferredTopics([...preferredTopics, topic.id]);
                                        }
                                      }}
                                    />
                                    <label htmlFor={`topic-${topic.id}`} className="ml-2 block text-xs text-gray-700">
                                      <span className="mr-1">{topic.icon}</span>
                                      {topic.name}
                                    </label>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
                
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.password ? 'border-red-500' : passwordStrength >= 3 && password ? 'border-green-500' : 'border-gray-300'} focus:outline-none focus:ring-2 ${passwordStrength >= 3 && password ? 'focus:ring-green-500' : 'focus:ring-purple-500'} focus:border-transparent transition-all duration-200 pr-10`}
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
                  {isSignUp && renderPasswordStrength()}
                </div>
                
                {isSignUp && (
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
                )}
              </motion.div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                {!isSignUp && (
                  <div className="text-sm">
                    <button 
                      type="button"
                      onClick={handlePasswordReset}
                      className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  disabled={loading || (loginAttempts >= 3 && new Date() - lastAttempt < 300000)}
                  className={`w-full py-3 px-4 bg-gradient-to-br ${moodData[currentMood].color} text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isSignUp ? 'Creating Your Safe Space...' : 'Entering Your Space...'}
                    </>
                  ) : (
                    <>
                      <span className="mr-2">
                        {isSignUp ? (
                          <FaUserShield className="inline" />
                        ) : (
                          <FaShieldAlt className="inline" />
                        )}
                      </span>
                      {isSignUp ? 'Join Our Support Community' : 'Access Your Support'}
                    </>
                  )}
                </button>
              </motion.div>
              
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative px-4 text-sm text-gray-500 bg-white/40 backdrop-blur-sm rounded-md">
                  Or continue with
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaGoogle className="mr-2 text-red-500" />
                      Sign {isSignUp ? 'up' : 'in'} with Google
                    </>
                  )}
                </button>
              </motion.div>

              <div className="text-center pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    navigate(isSignUp ? '/login' : '/signup');
                  }} 
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need support? Create an Account'}
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

export default Auth;