import { createContext, useState, useEffect, useContext } from 'react'
import { supabase, getCurrentUser } from '../services/supabaseClient'

// Create the authentication context
const AuthContext = createContext(null)

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for user session on initial load
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true)
        const { user: currentUser, error: userError } = await getCurrentUser()
        
        if (userError) {
          throw userError
        }
        
        setUser(currentUser)
      } catch (err) {
        console.error('Error checking authentication:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )
    
    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  // Authentication values and functions to provide
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext