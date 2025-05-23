import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  // Determine if we're on the home page
  const isHomePage = window.location.pathname === "/";

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
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
              <FaLeaf className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                MindCare
              </span>
            </div>
          </motion.div>
          
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
                      className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium relative group"
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
          
          <div className="flex items-center space-x-2">
            {!session ? (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none transition duration-150 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignInAlt className="mr-2 h-4 w-4" />
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/signup")}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                  <FaUserPlus className="ml-2 h-4 w-4" />
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/chat")}
                  className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none transition duration-150 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Chat
                </motion.button>
                <motion.button
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(220, 38, 38, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;