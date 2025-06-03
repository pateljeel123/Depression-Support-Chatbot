import React, { useState } from "react";
import { Link, NavLink as RouterNavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaLeaf,
  FaUserCircle,
  FaChevronDown,
  FaTimes,
  FaHome,
  FaComments, // Re-using for AI Advisor, or could use FaRobot, GiBrain etc.
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md"; // Added for Dashboard icon
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import ShineBorder from "../ui/shine-border";

// Helper NavLink component (adapted from Home.jsx)
const NavLink = ({ to, label, exact }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors font-heading",
        isActive ? "bg-accent text-text-dark shadow-sm" : "hover:bg-accent/50"
      )
    }
    end={exact}
  >
    {label}
  </RouterNavLink>
);

const Navbar = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const ProfileDropdownLink = ({ to, children }) => (
    <Link
      to={to}
      className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
      onClick={() => setIsProfileDropdownOpen(false)}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, label, onClick: externalOnClick }) => (
    <Link
      to={to}
      onClick={() => {
        setIsMobileMenuOpen(false);
        if (externalOnClick) externalOnClick();
      }}
      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:bg-opacity-75 transition-colors"
    >
      {label}
    </Link>
  );

  const bottomNavItems = [
    { label: "Home", to: "/", icon: <FaHome className="w-5 h-5 mb-1" /> },
    { label: "Dashboard", to: "/dashboard", icon: <MdDashboard className="w-5 h-5 mb-1" /> },
    { label: "Profile", to: "/profile", icon: <FaUserCircle className="w-5 h-5 mb-1" /> },
    { label: "AI Advisor", to: "/chat", icon: <FaComments className="w-5 h-5 mb-1" /> }, // Assuming /chat is the AI advisor page
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background shadow-sm border-b border-border/40 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-text-dark hover:text-primary transition-colors font-heading">
              <FaLeaf className="h-7 w-7 text-primary" />
              <span>MindCare</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <NavLink to="/" label="Home" exact />
            {location.pathname === '/' ? (
              <>
                <button onClick={() => scrollToSection('features')} className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading">Features</button>
                <button onClick={() => scrollToSection('stories')} className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading">Community</button>
                <button onClick={() => scrollToSection('resources')} className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading">Resources</button>
                <button onClick={() => scrollToSection('footer-contact')} className="text-text-light hover:text-text-dark px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:bg-opacity-50 font-heading">Contact</button>
              </>
            ) : (
              <>
                <NavLink to="/features" label="Features" />
                <NavLink to="/community" label="Community" />
                <NavLink to="/resources" label="Resources" />
                <NavLink to="/contact" label="Contact" />
              </>
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-3">
            {!session ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-accent hover:bg-opacity-75 rounded-button transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-button transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 font-heading"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary/80 transition-colors focus:outline-none"
                >
                  <FaUserCircle className="h-7 w-7 rounded-full" />
                  <span className="hidden lg:inline">{session.user?.email?.split('@')[0] || 'Profile'}</span>
                  <FaChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-md py-1 z-50 border border-border"
                    >
                      <ProfileDropdownLink to="/profile">Profile</ProfileDropdownLink>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent hover:text-destructive/80 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground p-2 rounded-md"
              aria-label="Open main menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-card border-t border-border"
          >
            <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              {location.pathname === '/' ? (
                <>
                  <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:text-white hover:bg-purple-600 hover:bg-opacity-75 transition-colors">Features</button>
                  <button onClick={() => scrollToSection('stories')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:text-white hover:bg-purple-600 hover:bg-opacity-75 transition-colors">Community</button>
                  <button onClick={() => scrollToSection('resources')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:text-white hover:bg-purple-600 hover:bg-opacity-75 transition-colors">Resources</button>
                  <button onClick={() => scrollToSection('footer-contact')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:text-white hover:bg-purple-600 hover:bg-opacity-75 transition-colors">Contact</button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/features" label="Features" />
                  <MobileNavLink to="/community" label="Community" />
                  <MobileNavLink to="/resources" label="Resources" />
                  <MobileNavLink to="/contact" label="Contact" />
                </>
              )}
            </nav>
            <div className="pt-4 pb-3 border-t border-gray-700">
              {!session ? (
                <div className="flex flex-col space-y-2 px-3">
                   <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} borderRadius="0.375rem" className="w-full">
                    <button
                      onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-transparent hover:bg-indigo-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Login
                    </button>
                  </ShineBorder>
                  <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={2} borderRadius="0.375rem" className="w-full">
                    <button
                      onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Sign Up
                    </button>
                  </ShineBorder>
                </div>
              ) : (
                <div className="px-3 space-y-1">
                  <div className="flex items-center mb-2 px-1">
                    <FaUserCircle className="h-8 w-8 rounded-full text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-white">{session.user?.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs text-gray-400">{session.user?.email}</p>
                    </div>
                  </div>
                  <MobileNavLink to="/profile" label="Your Profile" />
                  <button
                    onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                  >
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card dark:bg-card-dark border-t border-border shadow-lg z-50">
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {bottomNavItems.map((item) => (
            <RouterNavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center text-xs font-medium w-full pt-2 pb-1 transition-colors font-heading",
                  isActive
                    ? "text-primary scale-105"
                    : "text-text-light hover:text-primary"
                )
              }
              end={item.to === "/"} // Exact match for Home
            >
              {item.icon}
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