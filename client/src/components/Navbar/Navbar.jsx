import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaComments
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if we're on the home page
  const isHomePage = window.location.pathname === "/";

  return (
    <>
    <motion.nav
      className="sticky top-0 z-50 w-full bg-transparent shadow-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto filter invert"
                src="/logo.svg"
                alt="MindfulAI Logo"
              />
              <span className="ml-2 text-xl font-bold text-white">MindfulAI</span>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/chat")}
              className="nav-link px-3 py-2 rounded-md text-sm font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              Chat
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.button>
          </div>

          {isHomePage && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {["Home", "Features", "Stories", "Resources"].map(
                  (item, index) => (
                    <motion.button
                      key={item}
                      onClick={() =>
                        document
                          .getElementById(item.toLowerCase())
                          .scrollIntoView({ behavior: "smooth" })
                      }
                      className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium relative group"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item}
                      <motion.span
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                      />
                    </motion.button>
                  )
                )}
              </div>
            </div>
          )}
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {session ? (
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none"
                  >
                    <span className="hidden md:block">
                      {session.user?.name || "User"}
                    </span>
                    <FaUserCircle className="h-8 w-8" />
                  </button>
                </div>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/signup")}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-black bg-opacity-90 backdrop-blur-sm pb-3 space-y-1 sm:px-3 fixed top-16 left-0 right-0 z-40"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {isHomePage &&
            ["Home", "Features", "Stories", "Resources"].map((item) => (
              <MobileNavLink
                key={item}
                to={`#${item.toLowerCase()}`}
                onClick={() => {
                  document
                    .getElementById(item.toLowerCase())
                    .scrollIntoView({ behavior: "smooth" });
                  setIsMobileMenuOpen(false);
                }}
              >
                {item}
              </MobileNavLink>
            ))}
          <MobileNavLink to="/chat" icon={<FaComments />} onClick={() => setIsMobileMenuOpen(false)}>Chat</MobileNavLink>
          {session ? (
            <>
              <MobileNavLink to="/profile" icon={<FaUserCircle />} onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>
              <button
                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-red-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" icon={<FaSignInAlt />} onClick={() => setIsMobileMenuOpen(false)}>Login</MobileNavLink>
              <MobileNavLink to="/signup" icon={<FaUserPlus />} onClick={() => setIsMobileMenuOpen(false)}>Sign Up</MobileNavLink>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

const MobileNavLink = ({ to, icon, children, onClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to.startsWith('#')) {
      // Handle internal page links for smooth scrolling
      const elementId = to.substring(1);
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(to);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 hover:text-gray-200"
    >
      {icon && React.cloneElement(icon, { className: "mr-3 h-5 w-5" })}
      {children}
    </button>
  );
};

export default Navbar;