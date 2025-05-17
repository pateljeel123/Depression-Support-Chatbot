import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = "https://opikactoprbbmhsjdkhw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waWthY3RvcHJiYm1oc2pka2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0Njc0MDgsImV4cCI6MjA2MzA0MzQwOH0.BQ3-sgU-p7bdiPCkAZ3vsuzK9QklemPnNr7LaDgJ4Ho"

// Check if actual environment variables are available

// Create Supabase client with validated credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helper functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user || null, error }
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  return { error }
}

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  resetPassword,
  supabase
}