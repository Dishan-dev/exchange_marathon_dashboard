"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the loading screen after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Subtle background glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-[500px] h-[500px] bg-[#ffcd00]/10 rounded-full blur-[120px]"
          />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                }
              }}
              className="relative w-32 h-32 md:w-40 md:h-40"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_20px_rgba(255,205,0,0.3)]"
                priority
              />
            </motion.div>

            {/* Progress bar line */}
            <div className="mt-8 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut" 
                }}
                className="w-full h-full bg-[#ffcd00] shadow-[0_0_10px_#ffcd00]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.4, duration: 0.6 }
              }}
              className="mt-4 text-[#ffcd00] font-mono text-xs tracking-[0.3em] uppercase opacity-70"
            >
              Initializing Marathon
            </motion.p>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-[#ffcd00]/30" />
          <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-[#ffcd00]/30" />
          <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-[#ffcd00]/30" />
          <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-[#ffcd00]/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
