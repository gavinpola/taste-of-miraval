"use client";

import { motion } from "framer-motion";

interface BreathingCircleProps {
  size?: number;
  color?: string;
  duration?: number;
  className?: string;
}

export default function BreathingCircle({
  size = 200,
  color = "rgba(212, 165, 116, 0.3)",
  duration = 6,
  className = "",
}: BreathingCircleProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ring */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          position: "absolute",
        }}
      />
      {/* Middle ring */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          position: "absolute",
        }}
      />
      {/* Core */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        style={{
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: "50%",
          background: color,
        }}
      />
    </div>
  );
}

