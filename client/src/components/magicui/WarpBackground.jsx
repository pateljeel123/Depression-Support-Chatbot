"use client";

import { cn } from "../../lib/utils"; // Adjusted path
import { motion } from "framer-motion";
import React, { useEffect, useId, useRef, useState } from "react";

export function WarpBackground({
  children,
  className,
  speed = "normal",
  color = "#7A00D4",
  size = 1000,
  mouseEffect = true,
  gyroEffect = false,
  camera = {
    position: {
      x: 0,
      y: 0,
      z: 1,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    fov: 75,
  },
}) {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouseMoved = useRef(false);
  const id = useId();

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId;
    const stars = [];
    const numStars = 1000;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        opacity: Math.random(),
      });
    }

    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const perspective = size / (size + star.z);
        const x = centerX + (star.x - centerX) * perspective;
        const y = centerY + (star.y - centerY) * perspective;
        const s = Math.max(0, perspective * 2);
        const falloff = Math.max(0, 2 - perspective * 2);
        const opacity = star.opacity * falloff;

        context.beginPath();
        context.arc(x, y, s, 0, Math.PI * 2);
        context.fillStyle = `rgba(${hexToRgb(color)}, ${opacity})`;
        context.fill();

        star.z -= getSpeed(speed);
        if (star.z < 0) {
          star.z = canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const handleMouseMove = (event) => {
      mousePosition.current = { x: event.clientX, y: event.clientY };
      mouseMoved.current = true;
    };

    handleResize();
    draw();

    if (mouseEffect) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (mouseEffect) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [color, speed, size, mouseEffect]);

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const getSpeed = (s) => {
    switch (s) {
      case "slow":
        return 0.1;
      case "fast":
        return 0.5;
      default:
        return 0.2;
    }
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      <motion.canvas
        id={id}
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full w-full bg-transparent"
      />
      <div className="absolute inset-0 z-[1]">{children}</div>
    </div>
  );
}