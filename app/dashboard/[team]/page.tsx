"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Performer {
  name: string;
  role: string;
  score: number;
  avatar: string;
  metrics: {
    mous: number;
    coldCalls: number;
    followups: number;
  };
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
          { name: "Ariana Cole", role: "Deal Closer", score: 540, avatar: "AC", metrics: { mous: 24, coldCalls: 45, followups: 12 } },
          { name: "Brian Kim", role: "Pipeline Builder", score: 470, avatar: "BK", metrics: { mous: 18, coldCalls: 38, followups: 15 } },
          { name: "Nina Park", role: "Partner Lead", score: 410, avatar: "NP", metrics: { mous: 22, coldCalls: 30, followups: 10 } },
        ],
      },
      {
        name: "B2B Hunters",
        rank: 2,
        points: 1130,
        growth: 140,
        icon: "🎯",
        performers: [
          { name: "Marco Lee", role: "Outreach Lead", score: 500, avatar: "ML", metrics: { mous: 20, coldCalls: 42, followups: 14 } },
          { name: "Sasha Ray", role: "Prospect Analyst", score: 390, avatar: "SR", metrics: { mous: 15, coldCalls: 35, followups: 18 } },
          { name: "Dion Cruz", role: "Follow-up Owner", score: 350, avatar: "DC", metrics: { mous: 12, coldCalls: 28, followups: 20 } },
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
          { name: "Layla Noor", role: "Exchange Liaison", score: 520, avatar: "LN", metrics: { mous: 21, coldCalls: 48, followups: 11 } },
          { name: "Theo Grant", role: "Country Lead", score: 430, avatar: "TG", metrics: { mous: 17, coldCalls: 40, followups: 16 } },
          { name: "Mina Sol", role: "Partnership Support", score: 330, avatar: "MS", metrics: { mous: 14, coldCalls: 32, followups: 19 } },
        ],
      },
      {
        name: "IR Connectors",
        rank: 2,
        points: 1210,
        growth: 155,
        icon: "🔗",
        performers: [
          { name: "Ethan Vale", role: "Network Builder", score: 480, avatar: "EV", metrics: { mous: 19, coldCalls: 44, followups: 13 } },
          { name: "Ivy Chen", role: "Account Partner", score: 410, avatar: "IC", metrics: { mous: 16, coldCalls: 36, followups: 17 } },
          { name: "Sara Moon", role: "Process Lead", score: 320, avatar: "SM", metrics: { mous: 13, coldCalls: 30, followups: 21 } },
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
          { name: "Jade Brooks", role: "Conversion Lead", score: 560, avatar: "JB", metrics: { mous: 26, coldCalls: 50, followups: 9 } },
          { name: "Noel Hart", role: "Ops Specialist", score: 450, avatar: "NH", metrics: { mous: 20, coldCalls: 42, followups: 14 } },
          { name: "Kira Dean", role: "Matcher", score: 340, avatar: "KD", metrics: { mous: 15, coldCalls: 34, followups: 18 } },
        ],
      },
      {
        name: "Matching Core",
        rank: 2,
        points: 1100,
        growth: 130,
        icon: "💎",
        performers: [
          { name: "Rico Barnes", role: "Workflow Lead", score: 430, avatar: "RB", metrics: { mous: 18, coldCalls: 38, followups: 15 } },
          { name: "Tina Moss", role: "Follow-up Owner", score: 370, avatar: "TM", metrics: { mous: 16, coldCalls: 35, followups: 17 } },
          { name: "Ava Quinn", role: "Data Tracker", score: 300, avatar: "AQ", metrics: { mous: 12, coldCalls: 28, followups: 20 } },
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
          { name: "Pia Logan", role: "Campaign Lead", score: 510, avatar: "PL", metrics: { mous: 22, coldCalls: 46, followups: 12 } },
          { name: "Cody Wynn", role: "Content Strategist", score: 430, avatar: "CW", metrics: { mous: 18, coldCalls: 39, followups: 15 } },
          { name: "Lena Ford", role: "Brand Owner", score: 350, avatar: "LF", metrics: { mous: 14, coldCalls: 31, followups: 20 } },
        ],
      },
      {
        name: "Marcom Wave",
        rank: 2,
        points: 1160,
        growth: 145,
        icon: "🌊",
        performers: [
          { name: "Mason Hale", role: "Media Planner", score: 460, avatar: "MH", metrics: { mous: 19, coldCalls: 43, followups: 14 } },
          { name: "Ella Reed", role: "Audience Lead", score: 390, avatar: "ER", metrics: { mous: 16, coldCalls: 36, followups: 17 } },
          { name: "Zane Ortiz", role: "Social Manager", score: 310, avatar: "ZO", metrics: { mous: 12, coldCalls: 29, followups: 22 } },
        ],
      },
    ],
    totalPoints: 2450,
    totalGrowth: 315,
    completedActions: 94,
    weeklyGrowth: 330,
  },
};

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
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm ${
          isLeader
            ? "bg-linear-to-br from-yellow-400 to-orange-400 text-slate-900"
            : "bg-linear-to-br from-slate-700 to-slate-600 text-slate-200"
        }`}>
          {isLeader ? "🥇" : "🥈"}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">{team.name}</h3>
            <p className="text-sm text-slate-400 mt-1">#{team.rank} Position</p>
          </div>
          <span className="text-3xl">{team.icon}</span>
        </div>

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
    <div className="relative">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/70 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">Top Ranked Performers</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{team.name}</h3>
          <p className="mt-2 text-sm text-slate-400">Podium for the strongest contributors in this mini team.</p>
        </div>
        <button
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
                  <div className="mt-2 flex gap-1.5">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold opacity-60">M</span>
                      <span className="text-[10px] font-black">{performer.metrics.mous}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold opacity-60">C</span>
                      <span className="text-[10px] font-black">{performer.metrics.coldCalls}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold opacity-60">F</span>
                      <span className="text-[10px] font-black">{performer.metrics.followups}</span>
                    </div>
                  </div>
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
                  <div className="mt-2 flex justify-end gap-3 text-[10px] font-bold">
                    <span className="text-blue-400">M: {performer.metrics.mous}</span>
                    <span className="text-emerald-400">C: {performer.metrics.coldCalls}</span>
                    <span className="text-amber-400">F: {performer.metrics.followups}</span>
                  </div>
                </div>
              </div>
            ))}
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

  const leaderboardRows = teamData.miniTeams
    .flatMap((mt) => mt.performers.map((p) => ({ ...p, team: mt.name })))
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1, growth: Math.floor(Math.random() * 50) + 10 }));

  const podiumVisualOrder = [leaderboardRows[1], leaderboardRows[0], leaderboardRows[2]].filter(Boolean);

  const chartDefs = [
    {
      title: "Active Momentum",
      subtitle: "Team Performance Index",
      type: "bar",
      unit: "pts",
      entries: teamData.miniTeams.map((mt) => ({ label: mt.name, value: mt.points, sub: `+${mt.growth} growth` })),
    },
    {
      title: "Growth Trend",
      subtitle: "Weekly Accumulation",
      type: "line",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { name: "Team 1", data: [30, 45, 38, 52, 60, 48, 70], color: "#3b82f6" },
        { name: "Team 2", data: [25, 30, 42, 35, 48, 55, 62], color: "#8b5cf6" },
      ],
    },
    {
      title: "Member Activity Breakdown",
      subtitle: "MOU | CALLS | FOLLOWS",
      type: "stacked-bar",
      entries: leaderTeam.performers.map(p => ({
        label: p.name,
        values: [p.metrics.mous, p.metrics.coldCalls, p.metrics.followups]
      }))
    }
  ];

  const barColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"];

  const getSmoothPath = (data: number[], width: number, height: number, max: number) => {
    if (data.length < 2) return "";
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - (d / max) * height
    }));

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <nav className="sticky top-0 z-20 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">{teamData.name} Dashboard</h1>
                <p className="text-xs text-slate-400 mt-1">{teamData.displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {teamData.miniTeams.map((mt, i) => (
                  <div
                    key={mt.name}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
                      i === 0 ? "border-blue-500/30 bg-blue-500/10" : "border-purple-500/30 bg-purple-500/10"
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



              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              >
                ← Back
              </Link>
            </div>
          </div>
        </nav>

        <main className="space-y-10 p-5 md:p-8">
          <header className="pt-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300/80">Performance Snapshot</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">{teamData.name} Team Performance Dashboard</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm font-medium text-slate-400 md:text-base">
              Tracking live ranking momentum, role contributions, and performer impact across your mini teams.
            </p>
          </header>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-800/80 bg-linear-to-br from-slate-900/80 via-slate-950 to-slate-900/80 p-4 shadow-2xl shadow-slate-950/60 md:p-8"
          >
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white md:text-2xl">Top Performer Podium</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">From {leaderTeam.name}</p>
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
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: index === 0 ? 152 : index === 1 ? 200 : 120, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                    className={`relative w-full rounded-t-3xl border border-slate-700/70 bg-linear-to-b pt-8 text-center shadow-xl transition-transform duration-300 group-hover:-translate-y-1 ${
                    index === 0 ? "from-slate-500 to-slate-700" : index === 1 ? "from-blue-500 to-blue-700" : "from-orange-500 to-orange-700"
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
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
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
                        <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-white">{row.score.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-400">+{row.growth}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${
                            row.rank === 1 ? "border-amber-400/60 bg-amber-400/20 text-amber-300" : row.rank === 2 ? "border-slate-400/60 bg-slate-400/20 text-slate-200" : row.rank === 3 ? "border-orange-400/60 bg-orange-400/20 text-orange-300" : "border-slate-700 bg-slate-800/80 text-slate-400"
                          }`}>
                            {row.rank}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-3xl border border-slate-800/70 bg-linear-to-br from-slate-900/75 via-slate-950 to-slate-900/75 p-5">
              <h4 className="text-lg font-bold text-white">Team Cards</h4>
              <p className="mt-1 text-sm text-slate-400">Click a team card to open its performer podium and detailed ranking.</p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <MiniTeamCard team={leaderTeam} isLeader={true} onSelect={() => setSelectedMiniTeam(leaderTeam)} />
                <MiniTeamCard team={secondTeam} isLeader={false} onSelect={() => setSelectedMiniTeam(secondTeam)} />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              {chartDefs.filter((chart) => chart.type !== "stacked-bar").map((chart, chartIdx) => {
                const maxVal = Math.max(...((chart.entries as any[]) || []).map((e: any) => e.value || 0));
                return (
                  <div key={chart.title} className="rounded-3xl border border-slate-800/70 bg-slate-900/65 p-6 shadow-xl shadow-black/20">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{chart.subtitle}</p>
                    <h4 className="mt-1 text-lg font-bold text-white">{chart.title}</h4>
                    <div className="mt-6 space-y-4">
                      {chart.type === "bar" ? (
                        (chart.entries as any[])?.map((entry: any, barIdx: number) => {
                          const isHovered = hoveredBar?.chart === chartIdx && hoveredBar?.bar === barIdx;
                          const pct = Math.round(((entry.value || 0) / maxVal) * 100);
                          return (
                            <div key={entry.label} className="relative" onMouseEnter={() => setHoveredBar({ chart: chartIdx, bar: barIdx })} onMouseLeave={() => setHoveredBar(null)}>
                              <div className="mb-1.5 flex items-center justify-between">
                                <p className="max-w-28 truncate text-xs font-medium text-slate-300">{entry.label}</p>
                                <p className="text-xs font-semibold tabular-nums text-slate-400">{(entry.value || 0).toLocaleString()} {chart.unit}</p>
                              </div>
                              <div className="h-7 w-full overflow-hidden rounded-full bg-slate-800/80">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${pct}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: barIdx * 0.1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${barColors[barIdx % barColors.length]}`}
                                />
                              </div>
                              {isHovered && (
                                <div className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-slate-700/80 bg-slate-800/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-sm">
                                  <p className="text-sm font-black text-white">{entry.label}</p>
                                  <p className="mt-0.5 text-xs text-slate-400">{entry.sub}</p>
                                  <p className="mt-1 text-sm font-bold text-blue-300">{(entry.value || 0).toLocaleString()} <span className="text-[10px] font-semibold text-slate-500">{chart.unit}</span></p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : chart.type === "stacked-bar" ? (
                        <div className="space-y-6">
                          {chart.entries?.map((entry: any) => {
                            const total = entry.values.reduce((a: number, b: number) => a + b, 0);
                            const maxRowTotal = Math.max(...(chart.entries || []).map((e: any) => e.values.reduce((a: number, b: number) => a + b, 0)));
                            return (
                              <div key={entry.label} className="group/row">
                                <div className="mb-2 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                                    <p className="text-sm font-bold text-white">{entry.label}</p>
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{total} total</p>
                                </div>
                                <div className="relative h-8 w-full">
                                  <motion.div 
                                    initial={{ width: 0, opacity: 0 }}
                                    whileInView={{ width: `${(total / (maxRowTotal || 1)) * 100}%`, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="flex h-full overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/30"
                                  >
                                    {entry.values.map((val: number, valIdx: number) => {
                                      const pct = (val / total) * 100;
                                      const colors = ["bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]", "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]", "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"];
                                      if (val === 0) return null;
                                      return (
                                        <motion.div
                                          key={valIdx}
                                          initial={{ opacity: 0, scaleX: 0 }}
                                          whileInView={{ opacity: 1, scaleX: 1 }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 0.5, delay: 0.8 + (valIdx * 0.15) }}
                                          className={`relative flex items-center justify-center transition-all duration-700 hover:brightness-125 origin-left ${colors[valIdx]}`}
                                          style={{ width: `${pct}%` }}
                                        >
                                          {val > 2 && <span className="text-[10px] font-black text-slate-950 drop-shadow-sm">{val}</span>}
                                        </motion.div>
                                      );
                                    })}
                                  </motion.div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="mt-8 flex items-center justify-center gap-6 rounded-2xl border border-slate-800/50 bg-slate-900/40 py-3">
                            {["MOUs", "Calls", "Follows"].map((l, i) => (
                              <div key={l} className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${["bg-blue-500", "bg-emerald-500", "bg-amber-500"][i]}`} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full pt-4">
                          <div className="relative h-60 w-full">
                            <svg className="h-full w-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                              {chart.series?.map((s, sIdx) => {
                                const maxS = Math.max(...chart.series!.flatMap(se => se.data));
                                const path = getSmoothPath(s.data, 400, 200, maxS);
                                return (
                                  <g key={sIdx}>
                                    <defs>
                                      <linearGradient id={`grad-smooth-${sIdx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
                                        <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                                      </linearGradient>
                                    </defs>
                                    <motion.path
                                      initial={{ pathLength: 0, opacity: 0 }}
                                      whileInView={{ pathLength: 1, opacity: 1 }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 2, ease: "easeInOut" }}
                                      d={path}
                                      fill="none"
                                      stroke={s.color}
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <motion.path
                                      initial={{ opacity: 0 }}
                                      whileInView={{ opacity: 1 }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 1, delay: 1.5 }}
                                      d={`${path} L 400 200 L 0 200 Z`}
                                      fill={`url(#grad-smooth-${sIdx})`}
                                    />
                                    {s.data.map((d, i) => (
                                      <motion.circle
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 1.8 + (i * 0.05) }}
                                        cx={(i / (s.data.length - 1)) * 400}
                                        cy={200 - (d / maxS) * 200}
                                        r="4"
                                        fill={s.color}
                                        className="group-hover:r-6 cursor-pointer"
                                      />
                                    ))}
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                          <div className="mt-8 flex justify-between px-2">
                            {chart.categories?.map(c => <span key={c} className="text-[9px] font-bold uppercase tracking-tighter text-slate-500">{c}</span>)}
                          </div>
                          <div className="mt-4 flex gap-4">
                            {chart.series?.map(s => (
                              <div key={s.name} className="flex items-center gap-2">
                                <span className="h-0.5 w-4" style={{ backgroundColor: s.color }} />
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{s.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {chartDefs
                .filter((chart) => chart.type === "stacked-bar")
                .map((chart) => {
                  return (
                    <div key={chart.title} className="rounded-3xl border border-slate-800/70 bg-slate-900/65 p-6 shadow-xl shadow-black/20">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{chart.subtitle}</p>
                      <h4 className="mt-1 text-lg font-bold text-white">{chart.title}</h4>
                      <div className="mt-6 space-y-4">
                        <div className="space-y-6">
                          {chart.entries?.map((entry: any) => {
                            const total = entry.values.reduce((a: number, b: number) => a + b, 0);
                            const maxRowTotal = Math.max(...(chart.entries || []).map((e: any) => e.values.reduce((a: number, b: number) => a + b, 0)));
                            return (
                              <div key={entry.label} className="group/row">
                                <div className="mb-2 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                                    <p className="text-sm font-bold text-white">{entry.label}</p>
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{total} total</p>
                                </div>
                                <div className="relative h-8 w-full">
                                  <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    whileInView={{ width: `${(total / (maxRowTotal || 1)) * 100}%`, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="flex h-full overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/30"
                                  >
                                    {entry.values.map((val: number, valIdx: number) => {
                                      const pct = (val / total) * 100;
                                      const colors = ["bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]", "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]", "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"];
                                      if (val === 0) return null;
                                      return (
                                        <motion.div
                                          key={valIdx}
                                          initial={{ opacity: 0, scaleX: 0 }}
                                          whileInView={{ opacity: 1, scaleX: 1 }}
                                          viewport={{ once: true }}
                                          transition={{ duration: 0.5, delay: 0.8 + valIdx * 0.15 }}
                                          className={`relative flex items-center justify-center transition-all duration-700 hover:brightness-125 origin-left ${colors[valIdx]}`}
                                          style={{ width: `${pct}%` }}
                                        >
                                          {val > 2 && <span className="text-[10px] font-black text-slate-950 drop-shadow-sm">{val}</span>}
                                        </motion.div>
                                      );
                                    })}
                                  </motion.div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="mt-8 flex items-center justify-center gap-6 rounded-2xl border border-slate-800/50 bg-slate-900/40 py-3">
                            {["MOUs", "Calls", "Follows"].map((l, i) => (
                              <div key={l} className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${["bg-blue-500", "bg-emerald-500", "bg-amber-500"][i]}`} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

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
            </div>
          </motion.section>
        </main>
      </motion.div>

      <AnimatePresence>
        {selectedMiniTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
            onClick={() => setSelectedMiniTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-4xl overflow-hidden rounded-4xl border border-slate-700/60 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              <PerformerModal team={selectedMiniTeam} onClose={() => setSelectedMiniTeam(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
