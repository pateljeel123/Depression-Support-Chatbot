import { useState } from 'react'
import { signIn, signUp, resetPassword } from '../../services/supabaseClient'
import './AuthComponents.css'

export const Login = ({ onSuccess, onSignUpClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await signIn(email, password)
      if (error) throw error
      if (onSuccess) onSuccess(data.user)
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setResetSent(true)
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message || 'Failed to send reset password email')
    } finally {
      setLoading(false)
    }
  }

  if (showResetPassword) {
    return (
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Reset Password</h2>
        {resetSent ? (
          <div className="reset-success">
            <p className="text-gray-600 dark:text-gray-300 mb-5">Password reset instructions have been sent to your email.</p>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors" 
              onClick={() => setShowResetPassword(false)}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="mb-4">
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">{error}</div>}
            <div className="flex justify-between gap-3 mt-2">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors" 
                onClick={() => setShowResetPassword(false)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Welcome Back</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Sign in to continue your mental wellbeing journey</p>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {error && <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">{error}</div>}
        
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 flex flex-col items-center gap-3">
        <button 
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm" 
          onClick={() => setShowResetPassword(true)}
        >
          Forgot password?
        </button>
        <button 
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm" 
          onClick={onSignUpClick}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  )
}

// SignUp Component
export const SignUp = ({ onSuccess, onLoginClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await signUp(email, password)
      if (error) throw error
      
      // Store user name in local storage for profile
      if (data.user) {
        localStorage.setItem('userProfile', JSON.stringify({
          name,
          email: data.user.email
        }))
      }
      
      if (onSuccess) onSuccess(data.user)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">Create Account</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Join Support Companion for your mental wellbeing journey</p>
      
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or nickname"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {error && <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm">{error}</div>}
        
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" 
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 flex flex-col items-center gap-3">
        <button 
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm" 
          onClick={onLoginClick}
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  )
}

// Auth Container Component
export const AuthContainer = ({ onAuthSuccess }) => {
  const [showLogin, setShowLogin] = useState(true)
  
  const handleAuthSuccess = (user) => {
    if (onAuthSuccess) onAuthSuccess(user)
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-900/20 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-blue-600 dark:text-purple-400 text-2xl font-bold mb-2">Support Companion</h1>
          <p className="text-gray-600 dark:text-gray-400 m-0">A safe space for your mental wellbeing</p>
        </div>
        
        {showLogin ? (
          <Login 
            onSuccess={handleAuthSuccess} 
            onSignUpClick={() => setShowLogin(false)} 
          />
        ) : (
          <SignUp 
            onSuccess={handleAuthSuccess} 
            onLoginClick={() => setShowLogin(true)} 
          />
        )}
      </div>
    </div>
  )
}