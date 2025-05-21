import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if cytractic table exists and create user entry
const createProfilesTable = async () => {
  try {
    // We don't need to create the table as it already exists in Supabase
    // Just check if we can access it
    const { error } = await supabase
      .from('cytractic')
      .select('count')
      .limit(1);

    if (error) throw error;
    console.log('Successfully connected to cytractic table');
  } catch (error) {
    console.error('Error connecting to cytractic table:', error.message);
    console.info('Please ensure the cytractic table exists in your Supabase dashboard');
  }
};

// Helper function to get current user
const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Helper function to get user profile
const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Helper function to update user profile
const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
};

export {
  supabase,
  createProfilesTable,
  getCurrentUser,
  getUserProfile,
  updateUserProfile
};