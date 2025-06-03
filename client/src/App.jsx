import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Auth from './components/Auth/Auth'
import Home from './components/Home/Home'
import Chat from './components/Chat/Chat';
import Profile from './components/Profile/Profile'; // Import the Profile component
import Navbar from './components/common/Navbar'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/chat';

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={<Home />} 
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
          element={
            <ProtectedRoute>
                    <Chat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
};

const App = () => {
  // Apply the font to the entire app by adding to the root element or body
  // For this example, we'll assume a main wrapper div in App.jsx
  // If your structure is different, you might apply this to document.body directly
  // or to a more specific top-level component wrapper.

  return (
    // Apply the design system fonts and colors to the entire app
    <div className="font-sans bg-background text-text-dark dark:bg-background-dark dark:text-text-white min-h-screen">
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
    </div>
  )
}

export default App
