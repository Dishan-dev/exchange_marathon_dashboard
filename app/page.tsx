"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MascotAvatar from "@/components/MascotAvatar";
import LiquidEther from "@/components/LiquidEther";
import Footer from "@/components/Footer";
import HexagonGrid from "@/components/HexagonGrid";

interface Squad {
  id: string;
  name: string;
  href: string;
}

interface TeamCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  squads: Squad[];
}

const functions: TeamCard[] = [
  {
    id: "igv",
    name: "IGV",
    description: "Incoming Global Volunteer: Managing social impact projects for incoming exchange participants.",
    icon: "🏠",
    color: "var(--igv-color)",
    squads: [
      { id: "igv-ops", name: "B2B", href: "/dashboard/igv_b2b" },
      { id: "igv-ir", name: "IR Matching", href: "/dashboard/igv_ir" }
    ]
  },
  {
    id: "igt",
    name: "IGT",
    description: "Incoming Global Talent: Connecting global talent with local corporate opportunities.",
    icon: "💼",
    color: "var(--igt-color)",
    squads: [
      { id: "igt-b2b", name: "B2B Dashboard", href: "/dashboard/igt_b2b" },
      { id: "igt-ir", name: "IR Matching", href: "/dashboard/igt_ir" }
    ]
  },
  {
    id: "ogt",
    name: "OGT",
    description: "Outgoing Global Talent: Facilitating professional growth through global internships.",
    icon: "🌍",
    color: "var(--ogt-color)",
    squads: [
      { id: "ogt-global", name: "OGT Dashboard", href: "/dashboard/ogt" }
    ]
  },
  {
    id: "ogv",
    name: "OGV",
    description: "Outgoing Global Volunteer: Empowering members to create global social impact through outgoing exchange.",
    icon: "🌱",
    color: "var(--igv-color)",
    squads: [
      { id: "ogv-ops", name: "OGV Dashboard", href: "/dashboard/ogv" }
    ]
  },
  {
    id: "mst",
    name: "MST",
    description: "Marketing & Strategy: Scaling the marathon through strategic outreach and growth.",
    icon: "📈",
    color: "var(--mst-color)",
    squads: [
      { id: "mst-members", name: "Members", href: "/dashboard/members" },
      { id: "mst-tls", name: "TLs", href: "/dashboard/tls" }
    ]
  },
];

function FunctionCard({
  func,
  onSelect,
}: {
  func: TeamCard;
  onSelect: () => void;
}) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative h-full cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-black/70 backdrop-blur-xl"
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, #ffcd00, transparent)` }}
      />

      {/* Subtle background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 20%, #ffcd0018, transparent 65%)` }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-7">
        <div>
          {/* Monogram badge */}
          <div className="mb-6 flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all duration-500 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, #ffcd0030, #ffcd0008)`,
                border: `1px solid #ffcd0030`,
                color: '#ffcd00',
              }}
            >
              {func.name}
            </div>
            <div
              className="h-2 w-2 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: '#ffcd00', boxShadow: `0 0 8px #ffcd00` }}
            />
          </div>

          <h3
            className="mb-3 text-3xl font-black tracking-tighter text-[#F7F7F8] transition-transform duration-300 group-hover:translate-x-1"
            style={{ letterSpacing: "-0.03em" }}
          >
            {func.name}
          </h3>
          <p className="text-[11px] leading-relaxed text-white/40">{func.description}</p>
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-300 group-hover:opacity-100 opacity-40 text-[#ffcd00]">
            {func.squads.length} {func.squads.length === 1 ? "squad" : "squads"}
          </span>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-300 group-hover:translate-x-1"
            style={{ borderColor: `#ffcd0033`, background: `#ffcd000a` }}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="#ffcd00" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SquadCard({
  squad,
  color,
}: {
  squad: Squad;
  color: string;
}) {
  return (
    <Link href={squad.href}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-3xl border border-white/8 bg-black/70 backdrop-blur-xl cursor-pointer"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(to right, transparent, #ffcd00, transparent)` }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 20%, #ffcd0018, transparent 60%)` }}
        />
        <div className="relative z-10 flex items-center justify-between gap-4 p-6 sm:p-8">
          <div>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight text-[#F7F7F8]">{squad.name}</h4>
            <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-80 transition-opacity text-[#ffcd00]">Enter Arena</span>
          </div>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:translate-x-1"
            style={{ borderColor: `#ffcd0033`, background: `#ffcd000a` }}
          >
            <svg className="h-4 w-4" fill="none" stroke="#ffcd00" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  const [selectedFunction, setSelectedFunction] = useState<TeamCard | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 opacity-50">
        <LiquidEther 
          colors={['#ffcd00', '#0a0a0a', '#ffd700']} 
          mouseForce={35}
          cursorSize={110}
          autoDemo={true}
          autoSpeed={0.3}
        />
      </div>
      <div className="relative z-10">
        <HexagonGrid />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffcd00]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#ffcd00]/3 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-5 sm:px-8 lg:px-10">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 sm:gap-3 pointer-events-none opacity-60">
          <img src="/logo.png" alt="Xcend Logo" className="w-16 h-16 sm:w-26 sm:h-26 object-contain" />
        </div>
        
        <div className="relative flex w-full flex-col items-center justify-center pb-1 pt-32 sm:pt-24">
          <div className="relative flex w-full max-w-5xl flex-col items-center">
            {/* Mascot layered above and sitting on card border */}
            <div className="pointer-events-none absolute left-0 z-20 hidden -translate-x-[52%] sm:block lg:-translate-x-[18%] -translate-y-39">
              {!selectedFunction && (
                <MascotAvatar 
                  type="flag" 
                  size={530} 
                  glowColor="#ffcd00"
                  className="scale-75 lg:scale-95 origin-bottom"
                />
              )}
            </div>

            {/* Centered Content */}
            <motion.div 
              layout
              className="relative z-10 mb-8 flex flex-col items-center text-center sm:mb-10"
            >
              

              {/* Main title: READY? EXCHANGE GO! */}
              <div className="relative mb-8">
                <h1 className="font-black flex flex-col items-center italic">
                  <span className="text-xl sm:text-2xl md:text-3xl text-white/30 tracking-[0.3em] mb-2">READY?</span>
                  <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#ffcd00] tracking-tighter leading-none drop-shadow-[0_10px_40px_rgba(255,205,0,0.35)] transition-all duration-500 hover:scale-[1.02]">EXCHANGE</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl text-white/60 tracking-[0.4em] mt-2">GO!</span>
                </h1>
              </div>

              <div className="w-16 h-1 bg-[#ffcd00] mb-8" />

              <p className="max-w-2xl text-sm font-medium tracking-wide text-[#F7F7F8]/55 sm:text-base">
                {selectedFunction 
                  ? `Choose the specific ${selectedFunction.name} team you belong to below.`
                  : "Level up your performance. Dominate the leaderboard."}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="flex w-full flex-2 flex-col items-center justify-center pb-10 sm:pb-12">
          <AnimatePresence mode="wait">
            {!selectedFunction ? (
              <motion.div
                key="functions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5"
              >
                {functions.map((func) => (
                  <FunctionCard
                    key={func.id}
                    func={func}
                    onSelect={() => setSelectedFunction(func)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="squads"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-6xl"
              >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
                  {/* Left: Big standing mascot */}
                  <div className="absolute hidden lg:flex -left-110 z-10 flex-1 justify-end pointer-events-none -top-15">
                    <MascotAvatar 
                      type="standing" 
                      size={1200} 
                      glowColor="#ffcd00"
                      className="drop-shadow-[0_20px_80px_rgba(255,205,0,0.1)] origin-center"
                    />
                  </div>

                  {/* Right: Two card selection as rows */}
                  <div className="flex-1 w-full max-w-xl">
                    <div className="grid grid-cols-1 gap-6">
                      {selectedFunction.squads.map((squad) => (
                        <SquadCard key={squad.id} squad={squad} color={selectedFunction.color} />
                      ))}
                    </div>
                    <div className="mt-12 text-center lg:text-left">
                      <button
                        onClick={() => setSelectedFunction(null)}
                        className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                      >
                        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Back to Functions
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </main>

    </div>
  );
}
