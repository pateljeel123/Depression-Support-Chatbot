import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import backgroundMusic from "../music/lxstnght-night-angel.mp3";
import hoverSound from "../music/preloader-2s-001.mp3";
import { FaMusic, FaVolumeUp, FaVolumeMute, FaPlay, FaPause, FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Circular Audio Controls Component
export const AudioControls = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMuted, toggleMute } = useHoverSound();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMainButtonClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
      togglePlay();
      setShowVolumeSlider(false);
    }
  };

  const toggleVolumeSlider = (e) => {
    e.stopPropagation();
    setShowVolumeSlider(!showVolumeSlider);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-2 -right-2.5 z-50">
      {/* Main circular button */}
      <motion.div 
        className={`relative flex items-center justify-center cursor-pointer`}
        onClick={handleMainButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Main circular button */}
        <motion.div 
          className={`w-16 h-16 rounded-full ${isExpanded ? 'rounded-l-3xl' : 'rounded-r-3xl'} bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white z-10`}
          animate={{
            rotate: isExpanded ? 180 : 0,
            boxShadow: isExpanded 
              ? '0 0 20px 8px rgba(129, 140, 248, 0.6)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          transition={{ duration: 0.3 }}
        >
          <FaMusic className="text-2xl" />
        </motion.div>

        {/* Expanded controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="absolute top-0 left-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {/* Circular menu background */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-95 backdrop-blur-md shadow-2xl border-2 border-indigo-500/40 flex items-center justify-center overflow-hidden">
                {/* Center decoration */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 absolute flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                    <FaMusic className="text-indigo-400 text-xl" />
                  </div>
                </div>
                
                {/* Circular glow effect */}
                <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 animate-pulse"></div>
                
                {/* Circular menu items */}
                <div className="relative w-full h-full">
                  {/* Play/Pause Button */}
                  <motion.button
                    className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 flex items-center justify-center text-white shadow-lg border-2 border-indigo-400/30"
                    whileHover={{ scale: 1.1, boxShadow: '0 0 15px 5px rgba(129, 140, 248, 0.3)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                  >
                    {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl" />}
                  </motion.button>

                  {/* Volume Button */}
                  <motion.button
                    className="absolute top-1/2 -translate-y-1/2 right-10 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 flex items-center justify-center text-white shadow-lg border-2 border-indigo-400/30"
                    whileHover={{ scale: 1.1, boxShadow: '0 0 15px 5px rgba(129, 140, 248, 0.3)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVolumeSlider}
                  >
                    <FaCog className="text-2xl" />
                  </motion.button>

                  {/* Hover Sound Button */}
                  <motion.button
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 flex items-center justify-center text-white shadow-lg border-2 border-indigo-400/30"
                    whileHover={{ scale: 1.1, boxShadow: '0 0 15px 5px rgba(129, 140, 248, 0.3)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                  >
                    {isMuted ? <FaVolumeMute className="text-2xl" /> : <FaVolumeUp className="text-2xl" />}
                  </motion.button>

                  {/* Audio Element */}
                  <audio ref={audioRef} loop autoPlay preload="auto">
                    <source src={backgroundMusic} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>

                  {/* Volume Slider */}
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gray-800/90 rounded-2xl p-5 shadow-lg z-50 border border-indigo-500/30 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-white text-sm font-medium bg-indigo-600/80 px-3 py-1 rounded-full w-16 text-center">
                            {Math.round(volume * 100)}%
                          </span>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume} 
                            onChange={handleVolumeChange}
                            className="w-48 h-2 accent-indigo-500 cursor-pointer"
                          />
                          <div className="flex justify-between w-full px-1 text-xs text-gray-400">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status Labels */}
                  <div className="absolute top-32 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-indigo-600/80 px-4 py-1.5 rounded-full shadow-md">
                    {isPlaying ? "Playing" : "Paused"}
                  </div>
                  <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-indigo-600/80 px-4 py-1.5 rounded-full shadow-md">
                    {isMuted ? "Sound Off" : "Sound On"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Hover Sound Effect Context
const HoverSoundContext = createContext();

export const useHoverSound = () => useContext(HoverSoundContext);

export const HoverSoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize Web Audio API
  useEffect(() => {
    console.log("HoverSoundProvider mounted");
    
    // Create AudioContext
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);
    
    // Load sound file
    fetch(hoverSound)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(buffer => {
        console.log("Hover sound loaded successfully with Web Audio API");
        setAudioBuffer(buffer);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error("Error loading hover sound with Web Audio API:", error);
        setIsLoaded(false);
      });
      
    return () => {
      // Clean up
      if (context && context.state !== 'closed') {
        context.close();
      }
    };
  }, []);

  const playHoverSound = () => {
    if (!isMuted && audioContext && audioBuffer) {
      try {
        // Create a new source for each play
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        // Create a gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // Set volume to 50%
        
        // Connect the nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play the sound
        source.start(0);
        console.log("Hover sound played");
      } catch (error) {
        console.error("Error playing hover sound with Web Audio API:", error);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log(`Sound ${!isMuted ? 'muted' : 'unmuted'}`);
  };

  return (
    <HoverSoundContext.Provider value={{ playHoverSound, isMuted, toggleMute, isLoaded }}>
      {children}
    </HoverSoundContext.Provider>
  );
};

// For backward compatibility
export const AudioPlayer = AudioControls;