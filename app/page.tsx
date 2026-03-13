"use client";

import { useState } from "react";
import Link from "next/link";

interface TeamCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
}

const teams: TeamCard[] = [
  {
    id: "b2b",
    name: "B2B",
    description: "Partnership building, outreach, and business performance tracking for corporate entities.",
    icon: "🤝",
    href: "/dashboard/b2b",
  },
  {
    id: "ir",
    name: "IR",
    description: "International relations and external coordination across global exchange networks.",
    icon: "🌍",
    href: "/dashboard/ir",
  },
  {
    id: "matching",
    name: "Matching",
    description: "Real-time matching progress, follow-ups, and conversion rate optimization metrics.",
    icon: "🔗",
    href: "/dashboard/matching",
  },
  {
    id: "marcom",
    name: "Marcom",
    description: "Campaign visibility, audience reach, and social engagement analytics.",
    icon: "📣",
    href: "/dashboard/marcom",
  },
];

function TeamCardComponent({
  team,
  isSelected,
  onSelect,
}: {
  team: TeamCard;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Link href={team.href} onClick={onSelect}>
      <div
        className={`group relative h-full rounded-2xl border-2 p-8 transition-all duration-300 cursor-pointer
          ${
            isSelected
              ? "border-purple-500/60 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent shadow-xl shadow-purple-500/20"
              : "border-purple-500/20 bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-transparent hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/10"
          }
          backdrop-blur-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50
        `}
      >
        {/* Animated background glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.15), transparent 50%)`,
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Icon and header */}
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-2xl transition-transform group-hover:scale-110">
              {team.icon}
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">{team.name}</h3>
            <p className="text-sm leading-relaxed text-slate-300">{team.description}</p>
          </div>

          {/* Button and arrow */}
          <div className="flex items-center justify-between gap-4 pt-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400/80 transition-colors group-hover:text-blue-400/80">
              Enter Dashboard
            </span>
            <svg
              className="h-4 w-4 text-purple-400/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-400/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-slate-600/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-between min-h-screen">
        {/* Hero section */}
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20">
          {/* Season badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              Season 2024 Live
            </span>
          </div>

          {/* Main title */}
          <h1 className="mb-4 text-center font-bold tracking-tight text-white">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Exchange</span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Marathon
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-3 text-center text-lg sm:text-xl text-slate-300 font-medium max-w-2xl">
            Track performance. Compete harder. Lead the board.
          </p>

          {/* Helper text */}
          <p className="text-center text-sm sm:text-base text-slate-400 max-w-xl">
            Select your team to enter your competition dashboard and
            <br className="hidden sm:block" /> view real-time metrics
          </p>
        </div>

        {/* Team cards grid */}
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 pb-16 sm:pb-20">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {teams.map((team) => (
              <TeamCardComponent
                key={team.id}
                team={team}
                isSelected={selectedTeam === team.id}
                onSelect={() => setSelectedTeam(team.id)}
              />
            ))}
          </div>
        </div>

        {/* Bottom status section */}
        <div className="w-full border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:gap-8">
            <div className="flex flex-col gap-3 sm:gap-6 sm:flex-row text-center sm:text-left text-sm text-slate-400">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-slate-500">📊</span>
                <span>Internal competition tracking platform</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-slate-500">📈</span>
                <span>Bi-weekly leaderboard updates</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-slate-500">🎵</span>
                <span>Spotify-style recap generation</span>
              </div>
            </div>
            <a
              href="#"
              className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              SYSTEM STATUS
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
