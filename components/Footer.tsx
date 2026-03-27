"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-3 bg-black border-t border-white/5 flex items-center justify-center relative">
      <div className="flex items-center gap-3">
        {/* Mascot Image */}
        <Image
          src="/stand-white.png"
          alt="EB Sharks Mascot"
          width={32}
          height={32}
          className="w-6 h-6 object-contain opacity-50"
        />
        
        {/* Credit Phrase with interesting tagline inline */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] md:text-[10px] font-bold text-[#ffcd00] tracking-widest uppercase">
            EB Sharks 26.27
          </span>
          <span className="text-[9px] md:text-[10px] font-medium text-white/20 uppercase tracking-tighter">
            | The hunt never ends
          </span>
        </div>
      </div>
    </footer>
  );
}
