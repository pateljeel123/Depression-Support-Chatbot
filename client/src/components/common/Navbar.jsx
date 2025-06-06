import React, { useState, useEffect } from "react";
import { Link, NavLink as RouterNavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaLeaf,
  FaUserCircle,
  FaChevronDown,
  FaTimes,
  FaHome,
  FaComments,
  FaHeart,
  FaBookMedical,
  FaBrain,
  FaRegLightbulb,
} from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md"; // Added icons
import { GiBrain, GiMeditation } from "react-icons/gi";
import { Brain, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import ShineBorder from "../ui/shine-border";
import Marquee from "../magicui/marquee";

// Helper NavLink component (adapted from Home.jsx)
const NavLink = ({ to, label, exact, icon }) => {
  const location = useLocation();
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          `${location.pathname === '/' ? 'text-text-light hover:text-text-dark' : 'text-text-light hover:text-text-dark dark:text-text-white dark:hover:text-text-dark'} px-3 py-2 rounded-md text-sm font-medium transition-colors font-heading flex items-center gap-2`,
          isActive ? `${location.pathname === '/' ? 'bg-accent text-text-dark' : 'bg-accent text-text-dark dark:bg-accent-dark dark:text-text-white'} shadow-sm` : "hover:bg-accent/50"
        )
      }
      end={exact}
    >
      {icon && <span className="text-primary dark:text-primary-light">{icon}</span>}
      {label}
    </RouterNavLink>
  );
};

const Navbar = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Effect to update login state whenever session changes
  useEffect(() => {
    setIsLoggedIn(!!session);
  }, [session]);

  // Effect to detect which section is currently in view
  useEffect(() => {
    if (location.pathname !== '/') return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // 60% of the element must be visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe sections
    const sections = ['features', 'stories', 'resources'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) sectionObserver.observe(element);
    });

    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) sectionObserver.unobserve(element);
      });
    };
  }, [location.pathname]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id); // Set active section when clicked
    }
    setIsMobileMenuOpen(false); // Close mobile menu after click
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const ProfileDropdownLink = ({ to, children, icon }) => {
    const location = useLocation();
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Link
          to={to}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-purple-900/40 hover:text-white transition-all duration-300 rounded-md border border-transparent hover:border-purple-500/20"
          onClick={() => setIsProfileDropdownOpen(false)}
        >
          {icon && <span className="text-purple-400">{icon}</span>}
          {children}
        </Link>
      </motion.div>
    );
  };

  const MobileNavLink = ({ to, label, onClick: externalOnClick, icon }) => {
    const location = useLocation();
    return (
      <Link
        to={to}
        onClick={() => {
          setIsMobileMenuOpen(false);
          if (externalOnClick) externalOnClick();
        }}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground dark:text-text-white dark:hover:text-text-white'} hover:bg-accent hover:bg-opacity-75 transition-colors`}
      >
        {icon && <span className="text-primary dark:text-primary-light">{icon}</span>}
        {label}
      </Link>
    );
  };

  const bottomNavItems = [
    { label: "Home", to: "/", icon: <FaHome className="w-5 h-5 mb-1" /> },
    { label: "Profile", to: "/profile", icon: <FaUserCircle className="w-5 h-5 mb-1" /> },
    ...(isLoggedIn ? [{ label: "AI Chat", to: "/chat", icon: <FaComments className="w-5 h-5 mb-1" /> }] : []), // Only show AI Chat when logged in
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-50 w-full ${location.pathname === '/' ? 'bg-gradient-to-r from-gray-950 via-purple-950/95 to-gray-950/90' : 'bg-gradient-to-r from-gray-950 via-purple-950/95 to-gray-950/90'} shadow-[0_4px_20px_rgba(128,90,213,0.25)] border-b border-purple-500/30 backdrop-blur-lg`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-purple-400 transition-colors font-heading group">
                <motion.div 
                  className="relative inline-block"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="relative">
                    <Brain className="h-8 w-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text transform transition-transform group-hover:rotate-12 group-hover:scale-110" />
                    <motion.div 
                      className="absolute -inset-1 rounded-full opacity-70 blur-sm bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
                      animate={{ 
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    />
                  </div>
                </motion.div>
                <div className="flex flex-col">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-bold">MindCare</span>
                  <span className="text-xs text-gray-300">Mental Wellness</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
              <NavLink to="/" label="Home" exact icon={<FaHome className="w-4 h-4 text-purple-400" />} />
              {location.pathname === '/' ? (
                <>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-heading flex items-center gap-2 ${activeSection === 'features' ? 'bg-purple-900/50 text-white shadow-md border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-900/30 hover:border hover:border-purple-500/20'}`}
                  >
                    <GiBrain className="w-4 h-4 text-purple-400" />
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('stories')} 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-heading flex items-center gap-2 ${activeSection === 'stories' ? 'bg-purple-900/50 text-white shadow-md border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-900/30 hover:border hover:border-purple-500/20'}`}
                  >
                    <MdOutlineWavingHand className="w-4 h-4 text-pink-400" />
                    Community
                  </button>
                  <button 
                    onClick={() => scrollToSection('resources')} 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-heading flex items-center gap-2 ${activeSection === 'resources' ? 'bg-purple-900/50 text-white shadow-md border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-900/30 hover:border hover:border-purple-500/20'}`}
                  >
                    <GiMeditation className="w-4 h-4 text-cyan-400" />
                    Resources
                  </button>
                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/chat")}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-heading shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <Sparkles className="mr-2 w-4 h-4" /> AI Chat
                    </motion.button>
                  )}
                </>

              ) : (
                <>
                  <NavLink to="/features" label="Features" icon={<GiBrain className="w-4 h-4 text-purple-400" />} />
                  <NavLink to="/community" label="Community" icon={<MdOutlineWavingHand className="w-4 h-4 text-pink-400" />} />
                  <NavLink to="/resources" label="Resources" icon={<GiMeditation className="w-4 h-4 text-cyan-400" />} />
                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/chat")}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-heading shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <Sparkles className="mr-2 w-4 h-4" /> AI Chat
                    </motion.button>
                  )}
                </>
              )}
            </nav>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {!session ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-sm font-medium text-purple-400 border-2 border-purple-500/50 hover:bg-purple-900/30 hover:text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-heading hover:shadow-md transform hover:-translate-y-1 backdrop-blur-sm"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-heading shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Sign Up
                  </motion.button>
                </>
              ) : (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.15)" }}
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-all focus:outline-none p-2 rounded-full hover:bg-purple-900/30 border border-transparent hover:border-purple-500/20"
                  >
                    <div className="relative">
                      <div className="relative">
                        <FaUserCircle className="h-8 w-8 rounded-full text-purple-400" />
                        <motion.div 
                          className="absolute -inset-1 rounded-full opacity-70 blur-sm bg-gradient-to-r from-purple-500 to-pink-500"
                          animate={{ 
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        />
                      </div>
                      {isLoggedIn && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-gray-900"></span>
                      )}
                    </div>
                    <span className="hidden lg:inline">{session.user?.email?.split('@')[0] || 'Profile'}</span>
                    <FaChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                  </motion.button>
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-gray-950 via-purple-950/90 to-gray-950/95 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(128,90,213,0.3)] py-2 z-50 border border-purple-500/30 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-purple-500/30">
                          <p className="text-sm font-medium text-white">{session.user?.email?.split('@')[0] || 'User'}</p>
                          <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                        </div>
                        <div className="py-1">
                          <ProfileDropdownLink to="/profile" icon={<FaUserCircle className="w-4 h-4" />}>Your Profile</ProfileDropdownLink>
                          {isLoggedIn && (
                            <ProfileDropdownLink to="/chat" icon={<FaComments className="w-4 h-4" />}>AI Chat</ProfileDropdownLink>
                          )}
                        </div>
                        <div className="py-1 border-t border-purple-500/20">
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300 rounded-md border border-transparent hover:border-red-500/20"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                              Logout
                            </button>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(160, 124, 254, 0.15)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${location.pathname === '/' ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground dark:text-text-white dark:hover:text-text-white'} focus:outline-none focus:text-foreground p-2 rounded-full hover:bg-accent/50 transition-all`}
                aria-label="Open main menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-gradient-to-b from-gray-950 via-purple-950/90 to-gray-950/95 border-t border-purple-500/30 shadow-[inset_0_2px_10px_rgba(128,90,213,0.2)] backdrop-blur-xl"
            >
              <nav className="px-4 pt-3 pb-4 space-y-2">
                <MobileNavLink to="/" label="Home" icon={<FaHome className="w-5 h-5 text-purple-400" />} />
                {location.pathname === '/' ? (
                  <>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${activeSection === 'features' ? 'bg-purple-900/50 text-white border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-900/30 hover:border hover:border-purple-500/20'}`}
                    >
                      <GiBrain className="w-5 h-5 text-purple-400" />
                      Features
                    </button>
                    <button 
                      onClick={() => scrollToSection('stories')} 
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${activeSection === 'stories' ? 'bg-purple-900/50 text-white border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-900/30 hover:border hover:border-purple-500/20'}`}
                    >
                      <MdOutlineWavingHand className="w-5 h-5 text-pink-400" />
                      Community
                    </button>
                    <button 
                      onClick={() => scrollToSection('resources')} 
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${activeSection === 'resources' ? 'bg-purple-900/50 text-white border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-900/30 hover:border hover:border-purple-500/20'}`}
                    >
                      <GiMeditation className="w-5 h-5 text-cyan-400" />
                      Resources
                    </button>
                    {isLoggedIn && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Link 
                          to="/chat" 
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white transition-all"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Sparkles className="w-5 h-5" />
                          AI Chat
                        </Link>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/features" label="Features" icon={<GiBrain className="w-5 h-5 text-purple-400" />} />
                    <MobileNavLink to="/community" label="Community" icon={<MdOutlineWavingHand className="w-5 h-5 text-pink-400" />} />
                    <MobileNavLink to="/resources" label="Resources" icon={<GiMeditation className="w-5 h-5 text-cyan-400" />} />
                    {isLoggedIn && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Link 
                          to="/chat" 
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white transition-all"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Sparkles className="w-5 h-5" />
                          AI Chat
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </nav>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-5 border-t border-purple-500/20 px-4">
                {!session ? (
                  <div className="flex flex-col space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <button
                        onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-purple-400 border-2 border-purple-500/50 hover:bg-purple-900/30 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-heading backdrop-blur-sm"
                      >
                        Login
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <button
                        onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-heading"
                      >
                        Sign Up
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
                      <div className="relative">
                        <div className="relative">
                          <FaUserCircle className="h-10 w-10 rounded-full text-purple-400 mr-3" />
                          <motion.div 
                            className="absolute -inset-1 rounded-full opacity-70 blur-sm bg-gradient-to-r from-purple-500 to-pink-500"
                            animate={{ 
                              opacity: [0.3, 0.5, 0.3],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity,
                              ease: "easeInOut" 
                            }}
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-gray-900"></span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{session.user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-900/30 border border-transparent hover:border-purple-500/20 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUserCircle className="w-4 h-4 text-purple-400" />
                        Your Profile
                      </Link>
                    </div>
                    <button
                      onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950/90 border-t border-purple-500/20 shadow-lg z-50 backdrop-blur-md">
        <div className="container mx-auto px-2">
          <div className="flex justify-around items-center h-16">
            {bottomNavItems.map((item, index) => (
              <RouterNavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center text-xs font-medium w-full pt-2 pb-1 transition-all font-heading",
                    isActive
                      ? "text-white scale-105 opacity-100"
                      : "text-gray-400 hover:text-white opacity-70 hover:opacity-100"
                  )
                }
                end={item.to === "/"} // Exact match for Home
              >
                <motion.div 
                  className={({ isActive }) => cn(
                    "p-1.5 rounded-full mb-1 transition-all relative",
                    isActive ? "bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600" : "bg-transparent"  
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    delay: index * 0.1
                  }}
                >
                  {item.to === "/chat" ? <Sparkles className="w-5 h-5" /> : item.icon}
                  {({ isActive }) => isActive && (
                    <motion.div 
                      className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 z-0 opacity-70"
                      animate={{ 
                        opacity: [0.4, 0.7, 0.4],
                        scale: [0.95, 1.05, 0.95],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    />
                  )}
                </motion.div>
                <span>{item.label}</span>
              </RouterNavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;