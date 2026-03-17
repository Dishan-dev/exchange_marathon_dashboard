"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    color: "var(--b2b-color)",
    squads: [
      { id: "igv-ir", name: "IR Matching", href: "/dashboard/b2b" },
      { id: "igv-b2b", name: "B2B", href: "/dashboard/b2b" }
    ]
  },
  {
    id: "igt",
    name: "IGT",
    description: "Incoming Global Talent: Connecting global talent with local corporate opportunities.",
    icon: "💼",
    color: "var(--ir-color)",
    squads: [
      { id: "igt-ir", name: "IR Matching", href: "/dashboard/ir" },
      { id: "igt-b2b", name: "B2B", href: "/dashboard/ir" }
    ]
  },
  {
    id: "ogv",
    name: "OGV",
    description: "Outgoing Global Volunteer: Empowering local youth through global volunteering experiences.",
    icon: "✈️",
    color: "var(--matching-color)",
    squads: [
      { id: "ogv-ir", name: "IR Matching", href: "/dashboard/matching" },
      { id: "ogv-b2b", name: "B2B", href: "/dashboard/matching" }
    ]
  },
  {
    id: "ogt",
    name: "OGT",
    description: "Outgoing Global Talent: Facilitating professional growth through global internships.",
    icon: "🌍",
    color: "var(--marcom-color)",
    squads: [
      { id: "ogt-ir", name: "IR Matching", href: "/dashboard/marcom" },
      { id: "ogt-b2b", name: "B2B", href: "/dashboard/marcom" }
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
    <div
      onClick={onSelect}
      className="group relative h-full rounded-2xl border-2 border-white/10 bg-white/5 p-8 transition-all duration-300 cursor-pointer overflow-hidden glass-premium hover:border-white/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20"
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${func.color}22, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div 
              className="inline-flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              style={{ 
                background: `linear-gradient(135deg, ${func.color}44, ${func.color}11)`,
                boxShadow: `0 0 20px ${func.color}22`
              }}
            >
              {func.icon}
            </div>
          </div>

          <h3 className="mb-2 text-3xl font-black tracking-tight text-[#F7F7F8] group-hover:translate-x-1 transition-transform">{func.name}</h3>
          <p className="text-sm leading-relaxed text-[#F7F7F8]/70">{func.description}</p>
        </div>

        <div className="flex items-center justify-end pt-8">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <svg className="h-5 w-5 transition-all duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
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
      <div
        className="group relative rounded-2xl border-2 border-white/10 bg-white/5 p-8 transition-all duration-300 cursor-pointer overflow-hidden glass-premium hover:border-white/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.05] focus:outline-none"
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}33, transparent 70%)`,
          }}
        />
        <div className="relative z-10 text-center">
          <h4 className="text-2xl font-black tracking-tight text-[#F7F7F8] group-hover:scale-105 transition-transform">{squad.name}</h4>
          <span className="mt-4 inline-block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Enter Secure Arena</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [selectedFunction, setSelectedFunction] = useState<TeamCard | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#051B1D] via-[#003339] to-[#051B1D]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00666B]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#39A8AD]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#73FFFF]/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-[92%] flex-col items-center justify-between lg:w-[80%]">
        <div className="w-full flex-1 flex flex-col items-center justify-center py-12">
          <motion.div 
            layout
            className="flex flex-col items-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pulse-gold px-6 py-2 backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-[var(--xp-gold)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--xp-gold)]">
                {selectedFunction ? `SELECT YOUR ${selectedFunction.name} SQUAD` : "Season 2026 Live Arena"}
              </span>
            </div>

            {/* Main title */}
            <h1 className="mb-6 text-center font-black tracking-tighter text-[#F7F7F8]">
              <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl opacity-20 uppercase">
                {selectedFunction ? selectedFunction.name : "EXCHANGE"}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl -mt-8 sm:-mt-10 md:-mt-12 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent uppercase">
                {selectedFunction ? "SQUAD" : "MARATHON"}
              </span>
            </h1>

            <p className="mb-8 text-center text-lg sm:text-xl text-[#F7F7F8]/60 font-medium max-w-2xl tracking-wide">
              {selectedFunction 
                ? `Choose the specific ${selectedFunction.name} team you belong to below.`
                : "Level up your performance. Dominate the leaderboard."}
            </p>
          </motion.div>
        </div>

        <div className="w-full flex-[2] flex flex-col items-center justify-center pb-16">
          <AnimatePresence mode="wait">
            {!selectedFunction ? (
              <motion.div
                key="functions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
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
                className="w-full max-w-4xl"
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {selectedFunction.squads.map((squad) => (
                    <SquadCard key={squad.id} squad={squad} color={selectedFunction.color} />
                  ))}
                </div>
                <div className="mt-12 text-center">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </main>
    </div>
  );
}
