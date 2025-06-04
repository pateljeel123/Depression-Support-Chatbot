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
} from "react-icons/fa";
import { MdDashboard, MdOutlineWavingHand } from "react-icons/md"; // Added icons
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

  // Effect to update login state whenever session changes
  useEffect(() => {
    setIsLoggedIn(!!session);
  }, [session]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 text-sm ${location.pathname === '/' ? 'text-foreground hover:bg-accent hover:text-primary' : 'text-foreground hover:bg-accent hover:text-primary dark:text-text-white dark:hover:bg-accent-dark dark:hover:text-primary-light'} transition-colors rounded-md`}
        onClick={() => setIsProfileDropdownOpen(false)}
      >
        {icon && <span className="text-primary dark:text-primary-light">{icon}</span>}
        {children}
      </Link>
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
    { label: "Dashboard", to: "/dashboard", icon: <MdDashboard className="w-5 h-5 mb-1" /> },
    { label: "Profile", to: "/profile", icon: <FaUserCircle className="w-5 h-5 mb-1" /> },
    ...(isLoggedIn ? [{ label: "AI Chat", to: "/chat", icon: <FaComments className="w-5 h-5 mb-1" /> }] : []), // Only show AI Chat when logged in
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-50 w-full ${location.pathname === '/' ? 'bg-background/80' : 'bg-background/80 dark:bg-background-dark/90'} shadow-md border-b border-border/40 backdrop-blur-lg`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-text-dark hover:text-primary transition-colors font-heading group">
                <motion.div 
                  className="relative inline-block"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <FaLeaf className="h-8 w-8 text-primary transform transition-transform group-hover:rotate-12 group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-primary font-bold">MindCare</span>
                  <span className="text-xs text-foreground">Mental Wellness</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
              <NavLink to="/" label="Home" exact icon={<FaHome className="w-4 h-4" />} />
              {location.pathname === '/' ? (
                <>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading flex items-center gap-2"
                  >
                    <FaHeart className="w-4 h-4 text-primary" />
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('stories')} 
                    className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading flex items-center gap-2"
                  >
                    <MdOutlineWavingHand className="w-4 h-4 text-primary" />
                    Community
                  </button>
                  <button 
                    onClick={() => scrollToSection('resources')} 
                    className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading flex items-center gap-2"
                  >
                    <FaBookMedical className="w-4 h-4 text-primary" />
                    Resources
                  </button>
                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/chat")}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FaComments className="mr-2" /> AI Chat
                    </motion.button>
                  )}
                </>

              ) : (
                <>
                  <NavLink to="/features" label="Features" icon={<FaHeart className="w-4 h-4" />} />
                  <NavLink to="/community" label="Community" icon={<MdOutlineWavingHand className="w-4 h-4" />} />
                  <NavLink to="/resources" label="Resources" icon={<FaBookMedical className="w-4 h-4" />} />
                  {isLoggedIn && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/chat")}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover dark:bg-primary-light dark:hover:bg-primary-light/80 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FaComments className="mr-2" /> AI Chat
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className={`px-4 py-2 text-sm font-medium ${location.pathname === '/' ? 'text-primary border-2 border-primary hover:bg-accent' : 'text-primary border-2 border-primary hover:bg-accent dark:text-primary-light dark:border-primary-light dark:hover:bg-accent-dark'} hover:bg-opacity-75 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading hover:shadow-md transform hover:-translate-y-0.5`}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/signup")}
                    className={`px-4 py-2 text-sm font-medium text-white ${location.pathname === '/' ? 'bg-primary hover:bg-primary-hover' : 'bg-primary hover:bg-primary-hover dark:bg-primary-light dark:hover:bg-primary-light/80'} rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                  >
                    Sign Up
                  </motion.button>
                </>
              ) : (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center space-x-2 text-sm font-medium ${location.pathname === '/' ? 'text-foreground hover:text-primary/80' : 'text-foreground hover:text-primary/80 dark:text-text-white dark:hover:text-primary-light/80'} transition-colors focus:outline-none p-2 rounded-full hover:bg-accent/50`}
                  >
                    <div className="relative">
                      <FaUserCircle className="h-8 w-8 rounded-full text-primary" />
                      {isLoggedIn && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white"></span>
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
                        className={`absolute right-0 mt-2 w-56 ${location.pathname === '/' ? 'bg-card' : 'bg-card dark:bg-card-dark'} rounded-xl shadow-lg py-2 z-50 border border-border overflow-hidden`}
                      >
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium text-foreground dark:text-text-white">{session.user?.email?.split('@')[0] || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                        </div>
                        <div className="py-1">
                          <ProfileDropdownLink to="/profile" icon={<FaUserCircle className="w-4 h-4" />}>Your Profile</ProfileDropdownLink>
                          <ProfileDropdownLink to="/dashboard" icon={<MdDashboard className="w-4 h-4" />}>Dashboard</ProfileDropdownLink>
                          {isLoggedIn && (
                            <ProfileDropdownLink to="/chat" icon={<FaComments className="w-4 h-4" />}>AI Chat</ProfileDropdownLink>
                          )}
                        </div>
                        <div className="py-1 border-t border-border">
                          <button
                            onClick={handleSignOut}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${location.pathname === '/' ? 'text-destructive hover:bg-accent hover:text-destructive/80' : 'text-destructive hover:bg-accent hover:text-destructive/80 dark:text-destructive-light dark:hover:bg-accent-dark dark:hover:text-destructive-light/80'} transition-colors rounded-md`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Logout
                          </button>
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
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${location.pathname === '/' ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground dark:text-text-white dark:hover:text-text-white'} focus:outline-none focus:text-foreground p-2 rounded-full hover:bg-accent/50`}
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
              className={`md:hidden ${location.pathname === '/' ? 'bg-card' : 'bg-card dark:bg-card-dark'} border-t border-border shadow-lg`}
            >
              <nav className="px-4 pt-3 pb-4 space-y-2">
                <MobileNavLink to="/" label="Home" icon={<FaHome className="w-5 h-5" />} />
                {location.pathname === '/' ? (
                  <>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-opacity-75 transition-colors"
                    >
                      <FaHeart className="w-5 h-5 text-primary" />
                      Features
                    </button>
                    <button 
                      onClick={() => scrollToSection('stories')} 
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-opacity-75 transition-colors"
                    >
                      <MdOutlineWavingHand className="w-5 h-5 text-primary" />
                      Community
                    </button>
                    <button 
                      onClick={() => scrollToSection('resources')} 
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-opacity-75 transition-colors"
                    >
                      <FaBookMedical className="w-5 h-5 text-primary" />
                      Resources
                    </button>
                    {isLoggedIn && <MobileNavLink to="/chat" label="AI Chat" icon={<FaComments className="w-5 h-5" />} />}
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/features" label="Features" icon={<FaHeart className="w-5 h-5" />} />
                    <MobileNavLink to="/community" label="Community" icon={<MdOutlineWavingHand className="w-5 h-5" />} />
                    <MobileNavLink to="/resources" label="Resources" icon={<FaBookMedical className="w-5 h-5" />} />
                    {isLoggedIn && <MobileNavLink to="/chat" label="AI Chat" icon={<FaComments className="w-5 h-5" />} />}
                  </>
                )}
              </nav>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-5 border-t border-border/60 px-4">
                {!session ? (
                  <div className="flex flex-col space-y-3">
                    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} borderRadius="0.5rem" className="w-full">
                      <button
                        onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                        className={`w-full px-4 py-2.5 text-sm font-medium ${location.pathname === '/' ? 'text-primary' : 'text-primary dark:text-primary-light'} bg-transparent hover:bg-accent/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading`}
                      >
                        Login
                      </button>
                    </ShineBorder>
                    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} borderRadius="0.5rem" className="w-full">
                      <button
                        onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                        className={`w-full px-4 py-2.5 text-sm font-medium ${location.pathname === '/' ? 'text-white' : 'text-white dark:text-white'} bg-primary hover:bg-primary-hover dark:bg-primary-light dark:hover:bg-primary-light/90 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading`}
                      >
                        Sign Up
                      </button>
                    </ShineBorder>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-accent/30 rounded-lg">
                      <div className="relative">
                        <FaUserCircle className="h-10 w-10 rounded-full text-primary mr-3" />
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${location.pathname === '/' ? 'text-foreground' : 'text-foreground dark:text-text-white'}`}>{session.user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <MobileNavLink to="/profile" label="Your Profile" icon={<FaUserCircle className="w-4 h-4" />} />
                      <MobileNavLink to="/dashboard" label="Dashboard" icon={<MdDashboard className="w-4 h-4" />} />
                    </div>
                    <button
                      onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-destructive hover:bg-accent/50 hover:text-destructive/80' : 'text-destructive hover:bg-accent/50 hover:text-destructive/80 dark:text-destructive-light dark:hover:bg-accent-dark/50 dark:hover:text-destructive-light/80'} transition-colors`}
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
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${location.pathname === '/' ? 'bg-card/90' : 'bg-card/90 dark:bg-card-dark/90'} border-t border-border/60 shadow-lg z-50 backdrop-blur-md`}>
        <div className="container mx-auto px-2">
          <div className="flex justify-around items-center h-16">
            {bottomNavItems.map((item) => (
              <RouterNavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center text-xs font-medium w-full pt-2 pb-1 transition-all font-heading",
                    isActive
                      ? "text-primary scale-105 opacity-100"
                      : "text-text-light hover:text-primary opacity-70 hover:opacity-100"
                  )
                }
                end={item.to === "/"} // Exact match for Home
              >
                <div className={({ isActive }) => cn(
                  "p-1.5 rounded-full mb-1 transition-all",
                  isActive ? "bg-accent/70" : ""  
                )}>
                  {item.icon}
                </div>
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