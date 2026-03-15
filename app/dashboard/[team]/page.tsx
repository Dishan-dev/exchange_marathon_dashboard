"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Performer {
  name: string;
  role: string;
  score: number;
  streak: string;
  avatar: string;
}

interface MiniTeamData {
  name: string;
  rank: number;
  points: number;
  growth: number;
  icon: string;
  performers: Performer[];
}

interface TeamData {
  name: string;
  displayName: string;
  miniTeams: MiniTeamData[];
  totalPoints: number;
  totalGrowth: number;
  completedActions: number;
  weeklyGrowth: number;
}

const teamDataMap: Record<string, TeamData> = {
  b2b: {
    name: "B2B",
    displayName: "Partnership Building & Business Performance",
    miniTeams: [
      {
        name: "B2B Titans",
        rank: 1,
        points: 1320,
        growth: 180,
        icon: "🚀",
        performers: [
          { name: "Ariana Cole", role: "Deal Closer", score: 540, streak: "9 wins", avatar: "AC" },
          { name: "Brian Kim", role: "Pipeline Builder", score: 470, streak: "7 wins", avatar: "BK" },
          { name: "Nina Park", role: "Partner Lead", score: 410, streak: "5 wins", avatar: "NP" },
        ],
      },
      {
        name: "B2B Hunters",
        rank: 2,
        points: 1130,
        growth: 140,
        icon: "🎯",
        performers: [
          { name: "Marco Lee", role: "Outreach Lead", score: 500, streak: "8 wins", avatar: "ML" },
          { name: "Sasha Ray", role: "Prospect Analyst", score: 390, streak: "6 wins", avatar: "SR" },
          { name: "Dion Cruz", role: "Follow-up Owner", score: 350, streak: "4 wins", avatar: "DC" },
        ],
      },
    ],
    totalPoints: 2450,
    totalGrowth: 320,
    completedActions: 86,
    weeklyGrowth: 340,
  },
  ir: {
    name: "IR",
    displayName: "International Relations & Global Coordination",
    miniTeams: [
      {
        name: "IR Nexus",
        rank: 1,
        points: 1280,
        growth: 165,
        icon: "🌐",
        performers: [
          { name: "Layla Noor", role: "Exchange Liaison", score: 520, streak: "10 wins", avatar: "LN" },
          { name: "Theo Grant", role: "Country Lead", score: 430, streak: "7 wins", avatar: "TG" },
          { name: "Mina Sol", role: "Partnership Support", score: 330, streak: "5 wins", avatar: "MS" },
        ],
      },
      {
        name: "IR Connectors",
        rank: 2,
        points: 1210,
        growth: 155,
        icon: "🔗",
        performers: [
          { name: "Ethan Vale", role: "Network Builder", score: 480, streak: "8 wins", avatar: "EV" },
          { name: "Ivy Chen", role: "Account Partner", score: 410, streak: "6 wins", avatar: "IC" },
          { name: "Sara Moon", role: "Process Lead", score: 320, streak: "4 wins", avatar: "SM" },
        ],
      },
    ],
    totalPoints: 2490,
    totalGrowth: 320,
    completedActions: 92,
    weeklyGrowth: 365,
  },
  matching: {
    name: "Matching",
    displayName: "Real-time Matching & Conversion Optimization",
    miniTeams: [
      {
        name: "Matching Pros",
        rank: 1,
        points: 1350,
        growth: 195,
        icon: "⚡",
        performers: [
          { name: "Jade Brooks", role: "Conversion Lead", score: 560, streak: "11 wins", avatar: "JB" },
          { name: "Noel Hart", role: "Ops Specialist", score: 450, streak: "7 wins", avatar: "NH" },
          { name: "Kira Dean", role: "Matcher", score: 340, streak: "5 wins", avatar: "KD" },
        ],
      },
      {
        name: "Matching Core",
        rank: 2,
        points: 1100,
        growth: 130,
        icon: "💎",
        performers: [
          { name: "Rico Barnes", role: "Workflow Lead", score: 430, streak: "7 wins", avatar: "RB" },
          { name: "Tina Moss", role: "Follow-up Owner", score: 370, streak: "5 wins", avatar: "TM" },
          { name: "Ava Quinn", role: "Data Tracker", score: 300, streak: "4 wins", avatar: "AQ" },
        ],
      },
    ],
    totalPoints: 2450,
    totalGrowth: 325,
    completedActions: 78,
    weeklyGrowth: 355,
  },
  marcom: {
    name: "Marcom",
    displayName: "Campaign Visibility & Social Engagement",
    miniTeams: [
      {
        name: "Marcom Stars",
        rank: 1,
        points: 1290,
        growth: 170,
        icon: "⭐",
        performers: [
          { name: "Pia Logan", role: "Campaign Lead", score: 510, streak: "9 wins", avatar: "PL" },
          { name: "Cody Wynn", role: "Content Strategist", score: 430, streak: "7 wins", avatar: "CW" },
          { name: "Lena Ford", role: "Brand Owner", score: 350, streak: "5 wins", avatar: "LF" },
        ],
      },
      {
        name: "Marcom Wave",
        rank: 2,
        points: 1160,
        growth: 145,
        icon: "🌊",
        performers: [
          { name: "Mason Hale", role: "Media Planner", score: 460, streak: "8 wins", avatar: "MH" },
          { name: "Ella Reed", role: "Audience Lead", score: 390, streak: "6 wins", avatar: "ER" },
          { name: "Zane Ortiz", role: "Social Manager", score: 310, streak: "4 wins", avatar: "ZO" },
        ],
      },
    ],
    totalPoints: 2450,
    totalGrowth: 315,
    completedActions: 94,
    weeklyGrowth: 330,
  },
};

const activityFeed = [
  { event: "+40 points added for outreach completion", time: "2 hours ago", icon: "✅" },
  { event: "Campaign support task submitted", time: "4 hours ago", icon: "📤" },
  { event: "Weekly scores refreshed", time: "6 hours ago", icon: "🔄" },
  { event: "Leaderboard updated", time: "8 hours ago", icon: "📋" },
  { event: "Mini team moved into first place", time: "12 hours ago", icon: "🎉" },
];

const quickInsights = [
  { label: "Most Improved Team", value: "B2B Hunters", growth: "+12.4%" },
  { label: "Top Contributor", value: "Alex Johnson", growth: "+8 actions" },
  { label: "Fastest Growth Category", value: "Outreach", growth: "+28%" },
  { label: "Last Updated", value: "2 minutes ago", growth: "Real-time" },
];

function MiniTeamCard({
  team,
  isLeader,
  onSelect,
}: {
  team: MiniTeamData;
  isLeader: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-2xl border-2 p-8 text-left transition-all duration-300 ${
      isLeader
        ? "border-yellow-400/50 bg-linear-to-br from-yellow-500/15 via-orange-500/5 to-transparent shadow-xl shadow-yellow-500/20"
        : "border-slate-700/50 bg-linear-to-br from-slate-800/30 to-transparent hover:border-purple-400/30"
    }`}>
      {/* Medal badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm ${
          isLeader
            ? "bg-linear-to-br from-yellow-400 to-orange-400 text-slate-900"
            : "bg-linear-to-br from-slate-700 to-slate-600 text-slate-200"
        }`}>
          {isLeader ? "🥇" : "🥈"}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{team.name}</h3>
            <p className="text-sm text-slate-400 mt-1">#{team.rank} Position</p>
          </div>
          <span className="text-3xl">{team.icon}</span>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">Total Points</p>
            <p className="text-2xl font-bold text-white">{team.points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">This Cycle Growth</p>
            <p className={`text-lg font-semibold ${isLeader ? "text-emerald-400" : "text-blue-400"}`}>
              +{team.growth}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="w-full h-2 rounded-full bg-slate-700/30 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLeader
                  ? "bg-linear-to-r from-yellow-400 to-orange-400"
                  : "bg-linear-to-r from-purple-400 to-blue-400"
              }`}
              style={{ width: `${(team.points / 1350) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Click to view top performers
          </p>
        </div>
      </div>
    </button>
  );
}

function PerformerModal({
  team,
  onClose,
}: {
  team: MiniTeamData;
  onClose: () => void;
}) {
  const [first, second, third] = team.performers;
  const podiumOrder = [second, first, third].filter(Boolean);
  const podiumHeights = ["h-28", "h-36", "h-24"];
  const podiumColors = [
    "from-slate-300 to-slate-500 text-slate-950",
    "from-yellow-300 to-orange-400 text-slate-950",
    "from-amber-700 to-orange-900 text-white",
  ];
  const podiumLabels = ["#2", "#1", "#3"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-4xl rounded-4xl border border-slate-700/60 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/70 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">Top Ranked Performers</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{team.name}</h3>
            <p className="mt-2 text-sm text-slate-400">Podium for the strongest contributors in this mini team.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700/70 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/55 p-6">
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              {podiumOrder.map((performer, index) => (
                <div key={performer.name} className="flex flex-1 flex-col items-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-sm font-bold text-white">
                    {performer.avatar}
                  </div>
                  <div className="mb-3 text-center">
                    <p className="text-sm font-semibold text-white">{performer.name}</p>
                    <p className="text-xs text-slate-400">{performer.role}</p>
                  </div>
                  <div className={`flex w-full max-w-28 flex-col items-center justify-center rounded-t-3xl bg-linear-to-b ${podiumColors[index]} ${podiumHeights[index]} px-3 py-4`}>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">{podiumLabels[index]}</span>
                    <span className="mt-2 text-2xl font-black">{performer.score}</span>
                    <span className="mt-1 text-[11px] font-semibold opacity-80">points</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/55 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Leaderboard Detail</p>
            <div className="mt-5 space-y-4">
              {team.performers.map((performer, index) => (
                <div key={performer.name} className="flex items-center gap-4 rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                    {performer.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{performer.name}</p>
                    <p className="text-xs text-slate-400">{performer.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rank #{index + 1}</p>
                    <p className="mt-1 text-base font-bold text-white">{performer.score} pts</p>
                    <p className="text-xs text-emerald-400">{performer.streak}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamDashboard() {
  const params = useParams();
  const teamParam = (params?.team as string)?.toLowerCase() || "b2b";
  const teamData = teamDataMap[teamParam] || teamDataMap.b2b;
  const [selectedMiniTeam, setSelectedMiniTeam] = useState<MiniTeamData | null>(null);
  const [hoveredBar, setHoveredBar] = useState<{ chart: number; bar: number } | null>(null);

  const leaderTeam = teamData.miniTeams[0];
  const secondTeam = teamData.miniTeams[1];
  const podiumPeople = [...leaderTeam.performers]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const [firstPodium, secondPodium, thirdPodium] = podiumPeople;
  const podiumVisualOrder = [secondPodium, firstPodium, thirdPodium].filter(Boolean);

  const leaderboardRows = teamData.miniTeams
    .flatMap((miniTeam) =>
      miniTeam.performers.map((performer) => ({
        team: miniTeam.name,
        name: performer.name,
        role: performer.role,
        streak: performer.streak,
        points: performer.score,
        growth: Math.round((performer.score / miniTeam.points) * miniTeam.growth),
      })),
    )
    .sort((a, b) => b.points - a.points)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const barColors = ["bg-blue-500", "bg-cyan-500", "bg-amber-500", "bg-green-500", "bg-purple-500", "bg-rose-500"];
  const allPerformers = teamData.miniTeams.flatMap((mt) =>
    mt.performers.map((p) => ({ ...p, teamName: mt.name })),
  );
  const chartDefs = [
    {
      title: "Points Scored",
      subtitle: "TOP PERFORMANCE RACE",
      unit: "pts",
      entries: allPerformers.map((p) => ({ label: p.name, sub: p.teamName, value: p.score })),
    },
    {
      title: "Growth Momentum",
      subtitle: "MINI TEAM COMPARISON",
      unit: "pts growth",
      entries: teamData.miniTeams.map((mt) => ({ label: mt.name, sub: `Rank #${mt.rank}`, value: mt.growth })),
    },
    {
      title: "Performer Win Streaks",
      subtitle: "STREAK LEADERBOARD",
      unit: "wins",
      entries: allPerformers.map((p) => ({ label: p.name, sub: p.teamName, value: parseInt(p.streak) })),
    },
    {
      title: "Team Points Race",
      subtitle: "MINI TEAM TOTALS",
      unit: "pts",
      entries: teamData.miniTeams.map((mt) => ({ label: mt.name, sub: mt.icon, value: mt.points })),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Main content */}
      <div>
        {/* Top navbar */}
        <nav className="sticky top-0 z-20 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">{teamData.name} Dashboard</h1>
                <p className="text-xs text-slate-400 mt-1">{teamData.displayName}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {teamData.miniTeams.map((mt, i) => (
                  <div
                    key={mt.name}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
                      i === 0
                        ? "border-blue-500/30 bg-blue-500/10"
                        : "border-purple-500/30 bg-purple-500/10"
                    }`}
                  >
                    <span className="text-base">{mt.icon}</span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{mt.name}</p>
                      <p className="mt-0.5 text-sm font-bold text-white">
                        {mt.points.toLocaleString()}{" "}
                        <span className="text-[10px] font-semibold text-slate-400">pts</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notification bell */}
              <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors relative">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* Back button */}
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              >
                ← Back
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <main className="space-y-10 p-5 md:p-8">
          <header className="pt-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300/80">Performance Snapshot</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">{teamData.name} Team Performance Dashboard</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm font-medium text-slate-400 md:text-base">
              Tracking live ranking momentum, role contributions, and performer impact across your mini teams.
            </p>
          </header>

          <section className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 via-slate-950 to-slate-900/80 p-4 shadow-2xl shadow-slate-950/60 md:p-8">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white md:text-2xl">Top Performer Podium</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">From {leaderTeam.name}</p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Total Ranked People</p>
                <p className="mt-1 text-lg font-bold text-white">{leaderTeam.performers.length}</p>
              </div>
            </div>

            <div className="mx-auto flex h-68 max-w-4xl items-end justify-center gap-2 sm:gap-6">
              {podiumVisualOrder.map((performer, index) => (
                <div key={performer.name} className={`group flex flex-col items-center ${index === 1 ? "w-[38%]" : "w-[31%]"}`}>
                  <div className="mb-6 text-center">
                    <p className={`truncate px-2 font-black ${index === 1 ? "text-lg text-white" : "text-sm text-slate-400"}`}>{performer.name}</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600/80 px-3 py-1 ring-2 ring-blue-300/20">
                      <span className="text-xs font-black text-white">{performer.score.toLocaleString()}</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-blue-100">pts</span>
                    </div>
                  </div>
                  <div className={`relative w-full rounded-t-3xl border border-slate-700/70 bg-linear-to-b pt-8 text-center shadow-xl transition-transform duration-300 group-hover:-translate-y-1 ${
                    index === 0
                      ? "h-38 from-slate-500 to-slate-700"
                      : index === 1
                        ? "h-50 from-blue-500 to-blue-700"
                        : "h-30 from-orange-500 to-orange-700"
                  }`}>
                    <div className={`absolute -top-5 left-1/2 -translate-x-1/2 rounded-xl border border-white/20 p-2 shadow-lg ${
                      index === 0 ? "bg-slate-200 text-slate-700" : index === 1 ? "bg-amber-300 text-amber-900" : "bg-orange-300 text-orange-900"
                    }`}>
                      {index === 0 ? "🥈" : index === 1 ? "🏆" : "🥉"}
                    </div>
                    <p className="text-5xl font-black text-white/30">{index === 0 ? "2" : index === 1 ? "1" : "3"}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                      {index === 1 ? "Champion" : index === 0 ? "Runner Up" : "Third Place"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white md:text-2xl">Mini Team Leaderboard</h3>
              <p className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {leaderboardRows.length} ranked entries
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/65 shadow-xl shadow-black/30">
              <div className="overflow-x-auto">
                <table className="w-full min-w-170 border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-900/95">
                      <th className="border-b border-slate-800 px-4 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Performer</th>
                      <th className="border-b border-slate-800 px-4 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Team</th>
                      <th className="border-b border-slate-800 px-4 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Points</th>
                      <th className="border-b border-slate-800 px-4 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Growth</th>
                      <th className="border-b border-slate-800 px-4 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardRows.map((row) => (
                      <tr key={`${row.team}-${row.name}`} className="border-b border-slate-800/60 transition-colors hover:bg-blue-500/10">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.role}</p>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-300">{row.team}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-white">{row.points.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400">+{row.growth}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${
                            row.rank === 1
                              ? "border-amber-400/60 bg-amber-400/20 text-amber-300"
                              : row.rank === 2
                                ? "border-slate-400/60 bg-slate-400/20 text-slate-200"
                                : row.rank === 3
                                  ? "border-orange-400/60 bg-orange-400/20 text-orange-300"
                                  : "border-slate-700 bg-slate-800/80 text-slate-400"
                          }`}
                          >
                            {row.rank}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white md:text-2xl">Performance Breakdowns</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hover bars for detail</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {chartDefs.map((chart, chartIdx) => {
                const maxVal = Math.max(...chart.entries.map((e) => e.value));
                return (
                  <div key={chart.title} className="rounded-3xl border border-slate-800/70 bg-slate-900/65 p-6 shadow-xl shadow-black/20">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{chart.subtitle}</p>
                    <h4 className="mt-1 text-lg font-bold text-white">{chart.title}</h4>
                    <div className="mt-6 space-y-4">
                      {chart.entries.map((entry, barIdx) => {
                        const isHovered = hoveredBar?.chart === chartIdx && hoveredBar?.bar === barIdx;
                        const pct = Math.round((entry.value / maxVal) * 100);
                        return (
                          <div
                            key={entry.label}
                            className="relative"
                            onMouseEnter={() => setHoveredBar({ chart: chartIdx, bar: barIdx })}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            <div className="mb-1.5 flex items-center justify-between">
                              <p className="max-w-28 truncate text-xs font-medium text-slate-300">{entry.label}</p>
                              <p className="text-xs font-semibold tabular-nums text-slate-400">
                                {entry.value.toLocaleString()} {chart.unit}
                              </p>
                            </div>
                            <div className="h-7 w-full overflow-hidden rounded-full bg-slate-800/80">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${barColors[barIdx % barColors.length]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            {isHovered && (
                              <div className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-slate-700/80 bg-slate-800/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-sm">
                                <p className="text-sm font-black text-white">{entry.label}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{entry.sub}</p>
                                <p className="mt-1 text-sm font-bold text-blue-300">
                                  {entry.value.toLocaleString()}{" "}
                                  <span className="text-[10px] font-semibold text-slate-500">{chart.unit}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-slate-800/70 bg-linear-to-br from-slate-900/75 via-slate-950 to-slate-900/75 p-5">
              <h4 className="text-lg font-bold text-white">Team Cards</h4>
              <p className="mt-1 text-sm text-slate-400">Click a team card to open its performer podium and detailed ranking.</p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <MiniTeamCard team={leaderTeam} isLeader={true} onSelect={() => setSelectedMiniTeam(leaderTeam)} />
                <MiniTeamCard team={secondTeam} isLeader={false} onSelect={() => setSelectedMiniTeam(secondTeam)} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800/70 bg-linear-to-br from-slate-900/75 via-slate-950 to-slate-900/75 p-5">
              <h4 className="text-lg font-bold text-white">Quick Insights</h4>
              <div className="mt-4 space-y-3">
                {quickInsights.map((insight, index) => (
                  <div key={index} className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{insight.label}</p>
                    <p className="mt-1 text-sm font-bold text-white">{insight.value}</p>
                    <p className="mt-1 text-xs font-semibold text-blue-300">{insight.growth}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800/70 bg-linear-to-br from-slate-900/75 via-slate-950 to-slate-900/75 p-5">
            <h4 className="text-lg font-bold text-white">Live Activity Feed</h4>
            <div className="mt-4 divide-y divide-slate-800/70">
              {activityFeed.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.event}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {selectedMiniTeam && <PerformerModal team={selectedMiniTeam} onClose={() => setSelectedMiniTeam(null)} />}
    </div>
  );
}
