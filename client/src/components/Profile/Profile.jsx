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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header Section */}
        <div className="bg-slate-100 dark:bg-slate-700 p-6 sm:p-8 border-b border-slate-200 dark:border-slate-600">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center text-white text-4xl sm:text-5xl font-semibold shadow-md ring-4 ring-white dark:ring-slate-800 flex-shrink-0">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{userData.name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
              <p id="fullName" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 text-sm">
                {userData.name}
              </p>
            </div>
            <div>
              <label htmlFor="emailAddress" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
              <p id="emailAddress" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 text-sm">
                {userData.email}
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="joinedDate" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">Joined Date</label>
            <p id="joinedDate" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-200 text-sm">
              {session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </p>
          </div>

          {/* Actions Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-600">
            <button
              onClick={handleChangePassword}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors duration-150 ease-in-out"
            >
              Change Password
            </button>
          </div>
        </div>
        
        {/* Footer (Optional) */}
        {/* <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-600 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your profile settings.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;