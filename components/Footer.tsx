"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-transparent border-t border-white/5 flex items-center justify-center relative overflow-hidden backdrop-blur-3xl">
      <div className="flex flex-row items-center gap-6 md:gap-8">
        {/* Mascot Image */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#ffcd00]/10 rounded-full blur-2xl group-hover:bg-[#ffcd00]/20 transition-all duration-700" />
          <Image
            src="/stand-white.png"
            alt="EB Sharks Mascot"
            width={50}
            height={50}
            className="relative w-20 h-20 object-contain opacity-90 transition-all duration-500 group-hover:scale-110 active:scale-95 cursor-pointer drop-shadow-[0_0_15px_rgba(255,205,0,0.3)]"
          />
        </div>
        
        {/* Branding Line */}
        <div className="flex items-center gap-3 text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-white/30">
          <span>Ours Truly</span>
          <span className="text-[#ffcd00] animate-pulse">✦</span>
          <span className="text-[#ffcd00] drop-shadow-[0_0_10px_rgba(255,205,0,0.3)]">EB Sharks 26.27</span>
        </div>
      </div>
    </footer>
  );
}
