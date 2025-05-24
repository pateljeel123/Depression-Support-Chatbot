import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient'; // Adjust path as needed
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const Profile = () => {
  const { session } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          // Assuming you have a 'profiles' table or similar where user-specific data is stored
          // Or, you might just use session.user directly if it contains all needed info
          // For this example, let's assume session.user has email and we might fetch a 'full_name' or 'username'
          // from a 'profiles' table linked by user_id.
          
          // If your user data is directly in session.user and doesn't need another fetch:
          setUserData({
            email: session.user.email,
            // You might need to fetch/store username separately if not in session.user
            // For now, let's use a placeholder or part of the email
            name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          });
          setLoading(false);
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          setError('Failed to load profile data.');
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('You must be logged in to view this page.');
      }
    };

    fetchUserData();
  }, [session]);

  const handleChangePassword = () => {
    // Implement password change functionality
    // This typically involves redirecting to a Supabase password recovery flow
    // or using supabase.auth.updateUser({ password: newPassword })
    // For security, Supabase usually requires the user to be recently re-authenticated
    // or to confirm their current password before changing to a new one.
    // A common approach is to send a password reset email.
    alert('Password change functionality to be implemented. This might involve sending a reset link.');
    // Example: Trigger Supabase password recovery
    // const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
    //   redirectTo: 'http://localhost:5173/update-password', // URL of your password update page
    // });
    // if (error) console.error('Error sending password reset email:', error.message);
    // else alert('Password reset email sent!');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="flex items-center justify-center h-screen">Could not load user data.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300 ease-in-out">
        <div className="p-8">
          <div className="text-center mb-8">
            {/* Profile Picture Placeholder */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-600 dark:to-blue-700 mx-auto mb-4 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-700">
              <span className="text-5xl text-white font-semibold">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{userData.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{userData.email}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Full Name</label>
              <p id="fullName" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 shadow-sm">
                {userData.name}
              </p>
            </div>

            <div>
              <label htmlFor="emailAddress" className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Email Address</label>
              <p id="emailAddress" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 shadow-sm">
                {userData.email}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Joined: {session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;