"use client";

import { motion } from "framer-motion";

export default function HexagonGrid() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute -bottom-20 -right-20 flex gap-4 rotate-12">
        <Hexagon color="#ffcd00" size={120} delay={0} />
        <div className="flex flex-col gap-4 -translate-y-12">
          <Hexagon color="#3d474e" size={100} delay={0.2} />
          <Hexagon color="#2c2f38" size={110} delay={0.4} />
        </div>
      </div>
      
      <div className="absolute -top-20 -left-20 flex gap-6 -rotate-12">
        <Hexagon color="#2c2f38" size={150} delay={0.6} />
        <Hexagon color="#3d474e" size={80} delay={0.8} />
      </div>
    </div>
  );
}

function Hexagon({ color, size, delay }: { color: string; size: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      }}
      className="shadow-xl"
    />
  );
}
