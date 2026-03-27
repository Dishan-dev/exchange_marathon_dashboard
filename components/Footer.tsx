"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-black border-t border-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center gap-5">
        {/* Mascot Image */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-[#ffcd00]/10 rounded-full blur-xl group-hover:bg-[#ffcd00]/20 transition-all duration-500" />
          <Image
            src="/stand-white.png"
            alt="EB Sharks Mascot"
            width={40}
            height={40}
            className="relative w-10 h-10 object-contain opacity-90 transition-all duration-300 group-hover:scale-110"
          />
        </div>
        
        {/* Credit Phrase with creative tagline */}
        <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-3">
          <span className="text-xs md:text-sm font-black text-[#ffcd00] tracking-[0.2em] uppercase">
            EB Sharks 26.27
          </span>
          <span className="hidden md:block w-px h-3 bg-white/20" />
          <span className="text-[10px] md:text-xs font-medium text-white/40 uppercase tracking-widest italic font-serif">
            Precision in every strike • Impact in every goal
          </span>
        </div>
      </div>
    </footer>
  );
}
