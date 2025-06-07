import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Auth from './components/Auth/Auth'
import Home from './components/Home/Home'
import Chat from './components/Chat/Chat';
import Profile from './components/Profile/Profile'; // Import the Profile component
import ResetPassword from './components/Auth/ResetPassword'; // Import the ResetPassword component
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
          path="/reset-password" 
          element={<ResetPassword />} 
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
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
