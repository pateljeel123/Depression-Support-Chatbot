import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Changed to named export to match the import in Home.jsx
export const MagicCard = ({
  children,
  className = '',
  gradientSize = 400, // Size of the gradient in pixels
  gradientColor = 'rgba(200, 200, 200, 0.15)', // Color of the gradient
  gradientOpacity = 0.5, // Opacity of the gradient
  gradientBorderColor = 'rgba(255, 255, 255, 0.15)', // Border color
  gradientBorderWidth = 1, // Border width
  gradientStartColor = 'rgba(255, 255, 255, 0.4)', // Start color of the gradient
  gradientEndColor = 'rgba(255, 255, 255, 0)', // End color of the gradient
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse movement for desktop
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
  };

  // Handle mouse enter for desktop
  const handleMouseEnter = () => {
    if (isMobile) return;
    
    setIsHovered(true);
    
    // Center the gradient initially
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({ 
        x: rect.width / 2, 
        y: rect.height / 2 
      });
    }
  };

  // Handle mouse leave for desktop
  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (!isMobile || !cardRef.current) return;
    
    setIsHovered(true);
    
    // Center the gradient initially on touch
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ 
      x: rect.width / 2, 
      y: rect.height / 2 
    });
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setPosition({ x, y });
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    
    // Keep the hover effect for a moment after touch ends for better UX
    setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        boxShadow: isMobile && isHovered ? '0 10px 30px rgba(0, 0, 0, 0.1)' : undefined,
      }}
      {...props}
    >
      {/* Gradient overlay */}
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            left: position.x - gradientSize / 2,
            top: position.y - gradientSize / 2,
            width: gradientSize,
            height: gradientSize,
            background: `radial-gradient(circle at center, ${gradientStartColor} 0%, ${gradientEndColor} 70%)`,
            opacity: gradientOpacity,
            zIndex: 1,
          }}
        />
      )}
      
      {/* Border gradient */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            border: `${gradientBorderWidth}px solid ${gradientBorderColor}`,
            borderRadius: 'inherit',
            zIndex: 1,
          }}
        />
      )}
      
      {/* Card content */}
      <div className="relative z-0">{children}</div>
    </motion.div>
  );
};

// Also keep default export for backward compatibility
export default MagicCard;
