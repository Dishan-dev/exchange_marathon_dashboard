"use client";

import { motion } from "framer-motion";

export default function PawPrints() {
  const leftTrail = Array.from({ length: 15 }).map((_, i) => ({ 
    x: `${2 + (i % 2) * 2}%`, 
    y: `${5 + i * 6}%`, 
    rot: i % 2 === 0 ? 10 : -10 
  }));

  const rightTrail = Array.from({ length: 15 }).map((_, i) => ({ 
    x: `${94 + (i % 2) * 2}%`, 
    y: `${5 + i * 6}%`, 
    rot: i % 2 === 0 ? -10 : 10 
  }));

  const trails = [...leftTrail, ...rightTrail];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {trails.map((print, i) => (
        <PawPrint 
          key={i} 
          x={print.x} 
          y={print.y} 
          rotate={print.rot} 
          delay={2 + i * 0.3} // Slower, more deliberate "walking" pace
        />
      ))}
    </div>
  );
}

function PawPrint({ x, y, rotate, delay }: { x: string; y: string; rotate: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 5 }}
      animate={{ 
        opacity: [0, 0.2, 0.42], 
        scale: [0.5, 1.2, 1],
        y: [5, -2, 0]
      }}
      transition={{ 
        duration: 0.5, 
        delay, 
        times: [0, 0.4, 1],
        ease: "easeOut"
      }}
      style={{ left: x, top: y, rotate: `${rotate}deg` }}
      className="absolute text-white"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5-2.7 5-6 5z" opacity="0.6" />
        <circle cx="5" cy="8" r="2.5" />
        <circle cx="9" cy="4" r="2.5" />
        <circle cx="15" cy="4" r="2.5" />
        <circle cx="19" cy="8" r="2.5" />
      </svg>
    </motion.div>
  );
}
