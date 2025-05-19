import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth/Auth'
import Home from './components/Home/Home'
import Chat from './components/Chat/Chat'
import { createClient } from '@supabase/supabase-js'
import './App.css'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const App = () => {
  const [session, setSession] = useState(null)
  const [authMode, setAuthMode] = useState('login') // Default auth mode

  // Check for an existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle auth mode change
  const handleAuthMode = (mode) => {
    setAuthMode(mode)
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={<Home session={session} />} 
          />
          <Route 
            path="/login" 
            element={<Auth initialMode="login" />} 
          />
          <Route 
            path="/signup" 
            element={<Auth initialMode="signup" />} 
          />
          <Route 
            path="/chat" 
            element={session ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
