import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaShieldAlt, FaUserShield } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';

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
  
  // Security features
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navigate = useNavigate();
  
  // Available topics for preferences
  const availableTopics = [
    { id: 'relationship', name: 'Relationship Advice' },
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'loneliness', name: 'Loneliness' },
    { id: 'trauma', name: 'Past Mental Trauma' },
    { id: 'gossip', name: 'No One to Talk' },
    { id: 'self-care', name: 'Self-Care' },
    { id: 'motivation', name: 'Motivation' }
  ];
  
  // Communication style options
  const communicationStyles = [
    { id: 'direct', name: 'Direct and Straightforward' },
    { id: 'empathetic', name: 'Warm and Empathetic' },
    { id: 'balanced', name: 'Balanced' },
    { id: 'analytical', name: 'Analytical and Detailed' },
    { id: 'encouraging', name: 'Encouraging and Positive' }
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
        setError('Too many failed attempts. Please wait 5 minutes before trying again.');
        setLoading(true);
        const timer = setTimeout(() => {
          setLoading(false);
          setLoginAttempts(0);
          setError(null);
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
        .from('users') // Changed table name to 'users'
        .insert([
          {
            id: userId, // Changed user_id to id
            fullname: userData.full_name, // Changed full_name to fullname
            email: email, // email is from component state
            age: userData.age ? parseInt(userData.age) : null,
            gender: userData.gender || null,
            TopicsOfInterest: userData.preferred_topics, // Changed preferred_topics to TopicsOfInterest
            PreferredCommunication: userData.communication_style // Changed communication_style to PreferredCommunication
            // Removed is_admin, last_login, account_status, security_level as per new schema
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
        
      if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found error
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        // Check if email already exists
        const { data: existingUsers, error: emailCheckError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email);
          
        if (emailCheckError) throw emailCheckError;
        if (existingUsers && existingUsers.length > 0) {
          throw new Error('This email is already registered. Please sign in.');
        }
        
        // Check if this is an admin registration
        const adminCheck = await checkAdminEmail(email);
        setIsAdmin(adminCheck);

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullname: name, // Changed full_name to fullname
              age: age || null,
              gender: gender || null,
              TopicsOfInterest: preferredTopics, // Changed preferred_topics to TopicsOfInterest
              PreferredCommunication: communicationStyle, // Changed communication_style to PreferredCommunication
              is_admin: adminCheck // Kept is_admin for auth.users.user_metadata
            },
            emailRedirectTo: `${window.location.origin}/chat`
          }
        });

        if (authError) throw authError;
        
        if (authData.user) {
          // Create profile in AiAuth table
          await createUserProfile(authData.user.id, {
            full_name: name,
            age: age || null,
            gender: gender || null,
            preferred_topics: preferredTopics,
            communication_style: communicationStyle
          });
          
          // Send verification email if not automatically sent
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
      } else {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setLoginAttempts(prev => prev + 1);
          setLastAttempt(new Date());
          throw error;
        }
        
        // last_login update removed as it's not in the new 'users' table schema
        // account_status check removed as it's not in the new 'users' table schema

        // Get admin status from user_metadata if set during sign-up
        const isAdminFromMetadata = data.user.user_metadata?.is_admin;
        
        // The 'AdminAccess' table check for admin status is still separate if needed by other logic
        // For navigation, we rely on metadata or a simplified approach if admin status isn't in 'users' table.

        setSuccessMessage('Login successful!');
        
        // Navigate based on admin status from metadata
        setTimeout(() => navigate(isAdminFromMetadata ? '/admin' : '/chat'), 1000);
      }
    } catch (error) {
      console.error('Full authentication error:', error); // Added for detailed error logging
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSuccessMessage('Password reset link sent to your email!');
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              Depression Support - A safe place for treatment
            </span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
            {requiresVerification && (
              <button 
                onClick={() => {
                  setVerificationSent(false);
                  setRequiresVerification(false);
                }}
                className="mt-2 text-xs underline text-green-800 hover:text-green-600"
              >
                Resend verification email
              </button>
            )}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm space-y-3">
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowPreferences(!showPreferences)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 mb-2"
                  >
                    {showPreferences ? 'Hide Personalization Options' : 'Show Personalization Options'}
                    <FaQuestionCircle className="ml-1" title="These options help personalize your experience" />
                  </button>
                  
                  {showPreferences && (
                    <div className="space-y-3 p-3 bg-indigo-50 rounded-md">
                      <p className="text-xs text-gray-600 mb-2">These preferences help us personalize your experience (all fields are optional)</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                          <input
                            id="age"
                            name="age"
                            type="number"
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formErrors.age ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
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
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        <select
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={communicationStyle}
                          onChange={(e) => setCommunicationStyle(e.target.value)}
                        >
                          {communicationStyles.map(style => (
                            <option key={style.id} value={style.id}>{style.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Topics of Interest (select multiple)</label>
                        <div className="grid grid-cols-2 gap-1">
                          {availableTopics.map(topic => (
                            <div key={topic.id} className="flex items-center">
                              <input
                                id={`topic-${topic.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                                {topic.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {renderPasswordStrength()}
              {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
            </div>
            {isSignUp && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            {!isSignUp && (
              <div className="text-sm">
                <button 
                  type="button"
                  onClick={handlePasswordReset}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || (loginAttempts >= 3 && new Date() - lastAttempt < 300000)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isSignUp ? (
                      <FaUserShield className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                    ) : (
                      <FaShieldAlt className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                    )}
                  </span>
                  {isSignUp ? 'Sign Up Securely' : 'Sign In Securely'}
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => {
                setIsSignUp(!isSignUp);
                navigate(isSignUp ? '/login' : '/signup');
              }} 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;