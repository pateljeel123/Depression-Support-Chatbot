import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);



// Helper function to get current user
const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};





// Function to ensure 'users' table exists with necessary columns
const ensureAiChatTableExists = async () => {
  // Supabase doesn't have a direct way to list tables or check if a table exists via client SDK for security reasons.
  // We will attempt to create it, and if it exists, it should not error out or handle the error gracefully.
  // A more robust way would be to use Supabase Edge Functions or a backend to manage schema migrations.
  // For this client-side approach, we'll define the table structure and attempt an insert/select to verify.

  // The creation of tables is typically done via the Supabase Dashboard SQL editor or migrations.
  // However, to demonstrate the concept, we can try a select query and handle the error if the table doesn't exist.
  // console.log("Checking if 'AiChat' table exists or needs creation (conceptual).");
  // Actual table creation SQL (run this in Supabase SQL Editor):
  /*
  CREATE TABLE IF NOT EXISTS public.AiChat (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INTEGER,
    gender TEXT,
    preferred_topics JSONB,
    communication_style TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- RLS Policies (example, adjust as needed)
  ALTER TABLE public.AiChat ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can insert their own profile." ON public.AiChat
  FOR INSERT WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update their own profile." ON public.AiChat
  FOR UPDATE USING (auth.uid() = id);

  CREATE POLICY "Users can view their own profile." ON public.AiChat
  FOR SELECT USING (auth.uid() = id);
  */
  // Since we can't create tables directly from client-side JS securely,
  // we assume the table is created via Supabase Studio or a migration script.
  // This function will now primarily serve as a placeholder or for logging.
  console.log("Ensure 'AiChat' table is created in Supabase with columns: id (FK to auth.users), full_name, age, gender, preferred_topics, communication_style, created_at, updated_at.");
};

// Function to create a user profile in the 'AiChat' table
const createUserProfileInTable = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('AiChat')
    .insert([
      {
        id: userId,
        full_name: profileData.full_name,
        age: profileData.age,
        gender: profileData.gender,
        preferred_topics: profileData.preferred_topics,
        communication_style: profileData.communication_style,
      },
    ]);

  if (error) {
    console.error('Error creating user profile in table:', error);
    throw error;
  }
  return data;
};

export {
  supabase,
  getCurrentUser,
  ensureAiChatTableExists, // Exporting for potential use in app initialization
  createUserProfileInTable
};