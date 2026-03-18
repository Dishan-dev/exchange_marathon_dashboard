/* eslint-disable react-hooks/purity */
"use client";

import { useState, useEffect } from "react";
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

const rankColors = {
  1: "#FFD700", // Gold
  2: "#C0C0C0", // Silver
  3: "#CD7F32", // Bronze
};

const glimmerAnimation = `
  @keyframes glimmer {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(200%) rotate(45deg); }
  }
`;

function GlimmerOverlay() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-30"
        style={{ animation: 'glimmer 3s infinite linear' }}
      />
    </div>
  );
}

function CompetitiveLoader({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 800, next: 1 },  // READY
      { delay: 800, next: 2 },  // EXCHANGE
      { delay: 800, next: 3 },  // MARATHON
      { delay: 1000, next: 4 }, // GO!
    ];

    let timer: NodeJS.Timeout;
    const runSequence = (idx: number) => {
      if (idx >= sequence.length) {
        onFinish();
        return;
      }
      timer = setTimeout(() => {
        setPhase(sequence[idx].next);
        runSequence(idx + 1);
      }, sequence[idx].delay);
    };

    runSequence(0);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051B1D] overflow-hidden">
      {/* Speed Lines Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              delay: i * 0.1, 
              ease: "linear" 
            }}
            className="absolute h-px w-64 bg-linear-to-r from-transparent via-[#73FFFF] to-transparent"
            style={{ top: `${(i * 5)}%`, opacity: Math.random() }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="ready"
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            className="relative"
          >
             <h1 className="text-6xl sm:text-9xl font-black text-white italic tracking-tighter">
              READY?
            </h1>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="exchange"
            initial={{ x: "-100vw", skewX: -20 }}
            animate={{ x: 0, skewX: 0 }}
            exit={{ x: "100vw", skewX: 20 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative"
          >
             <h1 className="text-7xl sm:text-[12rem] font-black text-[#FF1744] italic tracking-tight drop-shadow-[0_0_30px_rgba(255,23,68,0.5)]">
              EXCHANGE
            </h1>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="marathon"
            initial={{ x: "100vw", skewX: 20 }}
            animate={{ x: 0, skewX: 0 }}
            exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
            transition={{ type: "spring", damping: 12 }}
            className="relative"
          >
             <h1 className="text-7xl sm:text-[12rem] font-black text-[#00E5FF] italic tracking-tight drop-shadow-[0_0_30px_rgba(0,229,255,0.5)]">
              MARATHON
            </h1>
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div
            key="go"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [1, 1.2, 1], rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
             <h1 className="text-9xl sm:text-[15rem] font-black text-white italic tracking-tighter">
              GO!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
        icon: "BT",
        performers: [
          { name: "Ariana Cole", role: "Deal Closer", score: 540, avatar: "AC", metrics: { mous: 24, coldCalls: 45, followups: 12 } },
          { name: "Brian Kim", role: "Pipeline Builder", score: 470, avatar: "BK", metrics: { mous: 18, coldCalls: 38, followups: 15 } },
          { name: "Nina Park", role: "Partner Lead", score: 410, avatar: "NP", metrics: { mous: 22, coldCalls: 30, followups: 10 } },
          { name: "Sion Wu", role: "Market Analyst", score: 380, avatar: "SW", metrics: { mous: 15, coldCalls: 35, followups: 18 } },
          { name: "Tara Singh", role: "Lead Gen", score: 320, avatar: "TS", metrics: { mous: 12, coldCalls: 40, followups: 22 } },
          { name: "Lucas Gray", role: "Contract Mgr", score: 290, avatar: "LG", metrics: { mous: 10, coldCalls: 25, followups: 15 } },
          { name: "Maya J", role: "Sales Support", score: 250, avatar: "MJ", metrics: { mous: 8, coldCalls: 20, followups: 12 } },
        ],
      },
      {
        name: "B2B Hunters",
        rank: 2,
        points: 1130,
        growth: 140,
        icon: "BH",
        performers: [
          { name: "Marco Lee", role: "Outreach Lead", score: 500, avatar: "ML", metrics: { mous: 20, coldCalls: 42, followups: 14 } },
          { name: "Sasha Ray", role: "Prospect Analyst", score: 390, avatar: "SR", metrics: { mous: 15, coldCalls: 35, followups: 18 } },
          { name: "Dion Cruz", role: "Follow-up Owner", score: 350, avatar: "DC", metrics: { mous: 12, coldCalls: 28, followups: 20 } },
          { name: "Elena V", role: "Growth Rep", score: 310, avatar: "EV", metrics: { mous: 10, coldCalls: 30, followups: 15 } },
          { name: "Kai Chen", role: "Market Lead", score: 280, avatar: "KC", metrics: { mous: 9, coldCalls: 25, followups: 12 } },
          { name: "Mira Sol", role: "Sales Ops", score: 240, avatar: "MS", metrics: { mous: 7, coldCalls: 20, followups: 10 } },
          { name: "Leo Das", role: "Outreach", score: 210, avatar: "LD", metrics: { mous: 6, coldCalls: 18, followups: 8 } },
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
        icon: "IN",
        performers: [
          { name: "Layla Noor", role: "Exchange Liaison", score: 520, avatar: "LN", metrics: { mous: 21, coldCalls: 48, followups: 11 } },
          { name: "Theo Grant", role: "Country Lead", score: 430, avatar: "TG", metrics: { mous: 17, coldCalls: 40, followups: 16 } },
          { name: "Mina Sol", role: "Partnership Support", score: 330, avatar: "MS", metrics: { mous: 14, coldCalls: 32, followups: 19 } },
          { name: "Sion Wu", role: "Market Analyst", score: 310, avatar: "SW", metrics: { mous: 13, coldCalls: 30, followups: 15 } },
          { name: "Tara Singh", role: "Lead Gen", score: 290, avatar: "TS", metrics: { mous: 11, coldCalls: 28, followups: 18 } },
          { name: "Lucas Gray", role: "Contract Mgr", score: 260, avatar: "LG", metrics: { mous: 9, coldCalls: 22, followups: 14 } },
          { name: "Maya J", role: "Sales Support", score: 230, avatar: "MJ", metrics: { mous: 7, coldCalls: 18, followups: 11 } },
        ],
      },
      {
        name: "IR Connectors",
        rank: 2,
        points: 1210,
        growth: 155,
        icon: "IC",
        performers: [
          { name: "Ethan Vale", role: "Network Builder", score: 480, avatar: "EV", metrics: { mous: 19, coldCalls: 44, followups: 13 } },
          { name: "Ivy Chen", role: "Account Partner", score: 410, avatar: "IC", metrics: { mous: 16, coldCalls: 36, followups: 17 } },
          { name: "Sara Moon", role: "Process Lead", score: 320, avatar: "SM", metrics: { mous: 13, coldCalls: 30, followups: 21 } },
          { name: "Noel Hart", role: "Ops Specialist", score: 290, avatar: "NH", metrics: { mous: 11, coldCalls: 26, followups: 16 } },
          { name: "Kira Dean", role: "Matcher", score: 260, avatar: "KD", metrics: { mous: 9, coldCalls: 22, followups: 14 } },
          { name: "Rico Barnes", role: "Workflow Lead", score: 230, avatar: "RB", metrics: { mous: 7, coldCalls: 18, followups: 12 } },
          { name: "Tina Moss", role: "Follow-up Owner", score: 200, avatar: "TM", metrics: { mous: 6, coldCalls: 15, followups: 10 } },
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
        icon: "MP",
        performers: [
          { name: "Jade Brooks", role: "Conversion Lead", score: 560, avatar: "JB", metrics: { mous: 26, coldCalls: 50, followups: 9 } },
          { name: "Noel Hart", role: "Ops Specialist", score: 450, avatar: "NH", metrics: { mous: 20, coldCalls: 42, followups: 14 } },
          { name: "Kira Dean", role: "Matcher", score: 340, avatar: "KD", metrics: { mous: 15, coldCalls: 34, followups: 18 } },
          { name: "Rico Barnes", role: "Workflow Lead", score: 310, avatar: "RB", metrics: { mous: 14, coldCalls: 30, followups: 15 } },
          { name: "Tina Moss", role: "Follow-up Owner", score: 280, avatar: "TM", metrics: { mous: 12, coldCalls: 26, followups: 12 } },
          { name: "Ava Quinn", role: "Data Tracker", score: 250, avatar: "AQ", metrics: { mous: 10, coldCalls: 22, followups: 10 } },
          { name: "Leo Das", role: "Outreach", score: 220, avatar: "LD", metrics: { mous: 8, coldCalls: 18, followups: 8 } },
        ],
      },
      {
        name: "Matching Core",
        rank: 2,
        points: 1100,
        growth: 130,
        icon: "MC",
        performers: [
          { name: "Rico Barnes", role: "Workflow Lead", score: 430, avatar: "RB", metrics: { mous: 18, coldCalls: 38, followups: 15 } },
          { name: "Tina Moss", role: "Follow-up Owner", score: 370, avatar: "TM", metrics: { mous: 16, coldCalls: 35, followups: 17 } },
          { name: "Ava Quinn", role: "Data Tracker", score: 300, avatar: "AQ", metrics: { mous: 12, coldCalls: 28, followups: 20 } },
          { name: "Kai Chen", role: "Market Lead", score: 270, avatar: "KC", metrics: { mous: 10, coldCalls: 25, followups: 15 } },
          { name: "Mira Sol", role: "Sales Ops", score: 240, avatar: "MS", metrics: { mous: 8, coldCalls: 20, followups: 12 } },
          { name: "Luna J", role: "Coord Lead", score: 210, avatar: "LJ", metrics: { mous: 6, coldCalls: 18, followups: 10 } },
          { name: "Zane O", role: "Support", score: 180, avatar: "ZO", metrics: { mous: 5, coldCalls: 15, followups: 8 } },
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
        icon: "MS",
        performers: [
          { name: "Pia Logan", role: "Campaign Lead", score: 510, avatar: "PL", metrics: { mous: 22, coldCalls: 46, followups: 12 } },
          { name: "Cody Wynn", role: "Content Strategist", score: 430, avatar: "CW", metrics: { mous: 18, coldCalls: 39, followups: 15 } },
          { name: "Lena Ford", role: "Brand Owner", score: 350, avatar: "LF", metrics: { mous: 14, coldCalls: 31, followups: 20 } },
          { name: "Sion Wu", role: "Market Analyst", score: 320, avatar: "SW", metrics: { mous: 12, coldCalls: 28, followups: 16 } },
          { name: "Tara Singh", role: "Lead Gen", score: 290, avatar: "TS", metrics: { mous: 10, coldCalls: 25, followups: 14 } },
          { name: "Lucas Gray", role: "Contract Mgr", score: 260, avatar: "LG", metrics: { mous: 8, coldCalls: 20, followups: 12 } },
          { name: "Maya J", role: "Sales Support", score: 230, avatar: "MJ", metrics: { mous: 6, coldCalls: 18, followups: 10 } },
        ],
      },
      {
        name: "Marcom Wave",
        rank: 2,
        points: 1160,
        growth: 145,
        icon: "MW",
        performers: [
          { name: "Mason Hale", role: "Media Planner", score: 460, avatar: "MH", metrics: { mous: 19, coldCalls: 43, followups: 14 } },
          { name: "Ella Reed", role: "Audience Lead", score: 390, avatar: "ER", metrics: { mous: 16, coldCalls: 36, followups: 17 } },
          { name: "Zane Ortiz", role: "Social Manager", score: 310, avatar: "ZO", metrics: { mous: 12, coldCalls: 29, followups: 22 } },
          { name: "Elena V", role: "Growth Rep", score: 280, avatar: "EV", metrics: { mous: 10, coldCalls: 25, followups: 15 } },
          { name: "Kai Chen", role: "Market Lead", score: 250, avatar: "KC", metrics: { mous: 8, coldCalls: 22, followups: 12 } },
          { name: "Mira Sol", role: "Sales Ops", score: 220, avatar: "MS", metrics: { mous: 6, coldCalls: 18, followups: 10 } },
          { name: "Leo Das", role: "Outreach", score: 190, avatar: "LD", metrics: { mous: 5, coldCalls: 15, followups: 8 } },
        ],
      },
    ],
    totalPoints: 2450,
    totalGrowth: 315,
    completedActions: 94,
    weeklyGrowth: 330,
  },
};

const teamColorMap: Record<string, string> = {
  b2b: "var(--b2b-color)",
  ir: "var(--ir-color)",
  matching: "var(--matching-color)",
  marcom: "var(--marcom-color)",
};

const quickInsights = [
  { label: "Most Improved Team", value: "B2B Hunters", growth: "+12.4%" },
  { label: "Top Swapper", value: "Alex Johnson", growth: "+8 actions" },
  { label: "Fastest Growth Category", value: "Outreach", growth: "+28%" },
];

const vibrantBarColors = [
  "bg-[#FF5722]", // Deep Orange
  "bg-[#4CAF50]", // Green
  "bg-[#2196F3]", // Blue
  "bg-[#FFC107]", // Amber
];

const stackedChartSegmentColors = [
  "bg-[#E91E63] shadow-[0_0_20px_rgba(233,30,99,0.45)]", // Pink
  "bg-[#9C27B0] shadow-[0_0_20px_rgba(156,39,176,0.45)]", // Purple
  "bg-[#00BCD4] shadow-[0_0_20px_rgba(0,188,212,0.45)]", // Cyan
];

const stackedLegendDots = ["bg-[#E91E63]", "bg-[#9C27B0]", "bg-[#00BCD4]"];

function MiniTeamCard({
  team,
  isLeader,
  onSelect,
  teamColor,
}: {
  team: MiniTeamData;
  isLeader: boolean;
  onSelect: () => void;
  teamColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group/card relative w-full rounded-2xl border p-6 sm:p-8 text-left transition-all duration-500 overflow-hidden ${
        isLeader
          ? "border-[#FFD700]/50 bg-linear-to-br from-[#FFD700]/15 via-[#003339] to-[#FFD700]/10 shadow-[0_0_40px_rgba(255,215,0,0.25)] ring-2 ring-[#FFD700]/40"
          : "border-white/5 bg-white/[0.02] hover:border-white/20"
      } glass-premium hover:scale-[1.02]`}
    >
      {isLeader && <GlimmerOverlay />}

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h3 
              className={`text-xl sm:text-2xl font-black tracking-tight ${isLeader ? "text-[#FFD700]" : "text-[#F7F7F8]"}`}
              style={isLeader ? { textShadow: '0 0 15px rgba(115, 255, 255, 0.2)' } : {}}
            >
              {team.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2 w-2 rounded-full ${isLeader ? "bg-[var(--level-up)]" : "bg-white/20"}`} />
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">RANK #{team.rank}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Total Performance</p>
            <p className="text-2xl sm:text-3xl font-black text-[#F7F7F8] tabular-nums">{team.points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Weekly Growth</p>
            <p className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color: teamColor }}>
              +{team.growth}
            </p>
          </div>
        </div>

        <div className="relative group/metrics mt-6">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Points</p>
            <p className="text-xs font-black text-white/60">{(team.points / 13.5).toFixed(1)}%</p>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(team.points / 1350) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ 
                backgroundColor: teamColor,
                boxShadow: `0 0 15px ${teamColor}`
              }}
            />
          </div>

          {/* Hover Tooltip for Metrics */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-20 w-48 pointer-events-none opacity-0 group-hover/card:opacity-100 group-hover/metrics:opacity-100 transition-all duration-300 transform scale-95 group-hover/card:scale-100 group-hover/metrics:scale-100">
            <div className="rounded-2xl border border-white/10 bg-[#003339]/95 p-4 shadow-2xl backdrop-blur-md">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3 text-center border-b border-white/5 pb-2">Squad Activity</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-white/30">MOUS</span>
                  <span className="text-[#E91E63]">{team.performers.reduce((s, p) => s + p.metrics.mous, 0)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-white/30">CALLS</span>
                  <span className="text-[#9C27B0]">{team.performers.reduce((s, p) => s + p.metrics.coldCalls, 0)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-white/30">FOLLOWS</span>
                  <span className="text-[#00BCD4]">{team.performers.reduce((s, p) => s + p.metrics.followups, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function PerformerModal({
  team,
  onClose,
  teamColor,
}: {
  team: MiniTeamData;
  onClose: () => void;
  teamColor: string;
}) {
  const [first, second, third] = team.performers;
  const podiumOrder = [second, first, third].filter(Boolean);
  const podiumHeights = ["h-32", "h-44", "h-28"];

  return (
    <div className="relative max-h-[90vh] overflow-hidden flex flex-col">
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-[#051C1E]/95 backdrop-blur-xl px-2 py-4 sm:py-5">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-linear-to-br from-[#73FFFF]/20 to-transparent flex items-center justify-center text-xl shadow-lg border border-white/10">
            📊
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-[#73FFFF]/40 mb-1">Squad Analytical Intel</p>
            <h3 className="text-2xl sm:text-4xl font-black text-[#F7F7F8] tracking-tighter">{team.name} <span className="text-white/10">Performance Card</span></h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 px-4 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-xl active:scale-95 shrink-0"
        >
          Close Report
        </button>
      </div>

      <div className="mt-4 sm:mt-8 grid gap-6 sm:gap-10 lg:grid-cols-12 items-stretch flex-1 overflow-y-auto custom-scrollbar pr-1">
        {/* Left Section: Podium Arena */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex-1 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-4 sm:p-8 glass-premium flex flex-col justify-center min-h-[450px] sm:min-h-[600px]">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#73FFFF]/20 mb-8 sm:mb-12 text-center">Elite Performer Arena</p>
            <div className="flex items-end justify-center gap-3 sm:gap-10">
              {podiumOrder.map((performer, index) => {
                const isFirst = performer === first;
                const pRankNum = isFirst ? '1' : index === 0 ? '2' : '3';
                const pHeight = isFirst ? 'h-40 sm:h-52' : index === 0 ? 'h-32 sm:h-36' : 'h-28 sm:h-32';
                return (
                  <div key={performer.name} className="flex flex-1 flex-col items-center group/podium max-w-[120px] sm:max-w-[160px]">
                    <div className="mb-3 sm:mb-5 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl glass-premium text-sm sm:text-base font-black text-white shadow-2xl group-hover/podium:scale-110 transition-transform duration-500">
                      {performer.avatar}
                    </div>
                    <div className="mb-3 sm:mb-5 text-center w-full">
                      <p className="text-xs sm:text-sm font-black text-[#F7F7F8] tracking-tight truncate px-1">{performer.name}</p>
                      <p className="text-[8px] sm:text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5 truncate">{performer.role}</p>
                    </div>
                    <div 
                      className={`flex w-full flex-col items-center justify-center rounded-2xl ${pHeight} px-2 sm:px-4 py-6 sm:py-8 shadow-2xl transition-all duration-700 relative`}
                      style={{ 
                        background: isFirst 
                          ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                          : index === 0 
                            ? 'linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)'
                            : 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
                        boxShadow: isFirst ? '0 15px 40px rgba(255, 215, 0, 0.25)' : 'none',
                      }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none rounded-2xl" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 relative z-10">
                        #{pRankNum}
                      </span>
                      <span className="mt-2 sm:mt-4 text-2xl sm:text-4xl font-black text-white relative z-10">{performer.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Member Leaderboard */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex-1 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-4 sm:p-6 glass-premium flex flex-col overflow-hidden">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 sm:mb-6 px-2">Squad Leaderboard</h4>
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
               {team.performers.map((performer, index) => {
                const rankNum = index + 1;
                const rColor = rankNum <= 3 ? rankColors[rankNum as keyof typeof rankColors] : 'transparent';
                return (
                  <div key={performer.name} className="group/row flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4 sm:p-5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 overflow-hidden relative shadow-lg shadow-black/10">
                    {rankNum <= 3 && <GlimmerOverlay />}
                    <div 
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xs font-black transition-all shadow-2xl group-hover/row:scale-110"
                      style={{ 
                        backgroundColor: rankNum <= 3 ? `${rColor}33` : 'rgba(255,255,255,0.05)',
                        color: rankNum <= 3 ? rColor : 'rgba(255,255,255,0.4)',
                        border: rankNum <= 3 ? `2px solid ${rColor}55` : '1px solid rgba(255,255,255,0.05)',
                        boxShadow: rankNum <= 3 ? `0 0 20px ${rColor}22` : 'none'
                      }}
                    >
                      #{rankNum}
                    </div>
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl glass-premium text-lg font-black text-white shadow-lg">
                      {performer.avatar}
                    </div>
                    <div className="relative z-10 min-w-0 flex-1">
                      <p className="text-sm font-black text-[#F7F7F8] truncate">{performer.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-white/25 mt-1 group-hover/row:text-white/40 transition-colors">{performer.role}</p>
                    </div>
                    <div className="relative z-10 text-right shrink-0">
                      <p className="text-xl font-black text-white tabular-nums tracking-tighter">{performer.score}</p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-end sm:items-center mt-1">
                        <p className="text-[8px] font-black text-white/10 uppercase">XP TOTAL</p>
                        <p className="text-[8px] font-black text-[var(--level-up)] uppercase">+{(performer.score * 0.1).toFixed(0)} Growth</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
  const [isLoading, setIsLoading] = useState(true);

  const leaderTeam = teamData.miniTeams[0];
  const secondTeam = teamData.miniTeams[1];

  const leaderboardRows = teamData.miniTeams
    .flatMap((mt) => mt.performers.map((p) => ({ ...p, team: mt.name })))
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1, growth: Math.floor(Math.random() * 50) + 10 }));

  const podiumVisualOrder = [leaderboardRows[1], leaderboardRows[0], leaderboardRows[2]].filter(Boolean);

  const chartDefs = [
    {
      title: "Growth Trend",
      subtitle: "Weekly Accumulation",
      type: "line",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { name: leaderTeam.name, data: [40, 55, 48, 62, 70, 58, 80], color: "#FF1744" }, // Vibrant Red
        { name: secondTeam.name, data: [20, 35, 45, 30, 50, 60, 68], color: "#00E5FF" }, // Cyan
      ],
    },
    {
      title: "Member Activity Breakdown",
      subtitle: "MOU | CALLS | FOLLOWS",
      type: "stacked-bar",
      entries: leaderTeam.performers.slice(0, 7).map(p => ({
        label: p.name,
        values: [p.metrics.mous, p.metrics.coldCalls, p.metrics.followups]
      }))
    }
  ];

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

  const teamColor = teamColorMap[teamParam] || "var(--b2b-color)";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#051B1D] via-[#003339] to-[#051B1D]">
      <style>{glimmerAnimation}</style>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <CompetitiveLoader key="loader" onFinish={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
        <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#051C1E]/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-6">
              <div 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl glass-premium shadow-lg"
                style={{ background: `linear-gradient(135deg, ${teamColor}44, transparent)` }}
              >
                🏆
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F7F7F8] capitalize">
                  {teamParam} <span className="opacity-40">Dashboard</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-0.5 sm:mt-1">
                  Summer 26.27
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="group flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full glass border border-white/10 hover:bg-white/5 transition-all"
              >
                <span className="opacity-40 group-hover:-translate-x-1 transition-transform">←</span>
                <span className="hidden xs:inline">Exit Dashboard</span>
                <span className="xs:hidden">Exit</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto w-[94%] sm:w-[92%] space-y-8 sm:space-y-12 py-8 sm:py-16 lg:w-[80%]">
          <header className="relative py-8 sm:py-12 text-center overflow-hidden rounded-2xl sm:rounded-3xl glass-premium border-white/5 px-4">
            <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 50%, ${teamColor}, transparent 70%)` }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-7xl font-black tracking-tighter text-[#F7F7F8] mb-4 sm:mb-6 leading-tight">
                THE <span style={{ color: teamColor }}>{teamData.name}</span> MARATHON
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-white">{teamData.totalPoints.toLocaleString()}</span>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30">Total Team XP</span>
                </div>
                <div className="h-6 sm:h-8 w-px bg-white/10 hidden xs:block" />
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-[var(--level-up)]">+{teamData.weeklyGrowth}%</span>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30">Weekly Surge</span>
                </div>
                <div className="h-6 sm:h-8 w-px bg-white/10 hidden xs:block" />
                <div className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-[var(--xp-gold)]">{teamData.completedActions}</span>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30">Milestones Hit</span>
                </div>
              </div>
            </div>
          </header>

          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-[3rem] border border-white/5 bg-white/[0.02] p-8 sm:p-12 glass-premium shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle at 100% 0%, ${teamColor}, transparent 80%)` }}
            />
            
            <div className="relative z-10 mb-16 flex flex-col items-center">
              <h3 className="text-3xl font-black text-[#F7F7F8] tracking-widest uppercase">The Podium</h3>
            </div>

            <div className="relative z-10 mx-auto flex h-[350px] sm:h-96 max-w-4xl items-end justify-center gap-2 sm:gap-12">
              {podiumVisualOrder.map((performer, index) => {
                const isChampion = index === 1;
                const podHeight = index === 0 ? '140 sm:180' : index === 1 ? '200 sm:260' : '100 sm:140';
                return (
                  <div key={performer.name} className={`group flex flex-col items-center ${isChampion ? "w-[40%] sm:w-[38%]" : "w-[28%] sm:w-[31%]"}`}>
                    <div className="mb-4 sm:mb-8 text-center w-full">
                      <p className={`truncate px-1 font-black tracking-tight ${isChampion ? "text-base sm:text-xl text-white" : "text-[10px] sm:text-sm text-white/40"}`}>{performer.name}</p>
                      <div className="mt-2 sm:mt-3 inline-flex items-center gap-1 sm:gap-2 rounded-full glass border border-white/10 px-2 sm:px-4 py-1 sm:py-1.5 shadow-xl">
                        <span className="text-[10px] sm:text-sm font-black text-white">{performer.score.toLocaleString()}</span>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/30">XP</span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: index === 0 ? 180 : index === 1 ? 270 : 140 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.2 + (index * 0.1), ease: "circOut" }}
                      className="relative w-full rounded-2xl border border-white/20 flex flex-col items-center justify-start pt-12 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500"
                      style={{ 
                        background: isChampion 
                          ? `linear-gradient(to bottom, #FFD700, #DAA520)` 
                          : index === 0 
                            ? `linear-gradient(to bottom, #E0E0E0, #A0A0A0)`
                            : `linear-gradient(to bottom, #CD7F32, #8B4513)`,
                        boxShadow: isChampion ? `0 15px 40px rgba(255, 215, 0, 0.2)` : 'none'
                      }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
                      <div 
                        className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-xl border border-white/30 bg-[#003339] flex items-center justify-center text-xl font-black shadow-2xl"
                        style={{ color: isChampion ? '#FFD700' : index === 0 ? '#E0E0E0' : '#CD7F32' }}
                      >
                        {index === 0 ? "2" : index === 1 ? "1" : "3"}
                      </div>
                      <p className="text-6xl font-black text-black/10 select-none">{index === 0 ? "2" : index === 1 ? "1" : "3"}</p>
                      <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/80">
                        {index === 1 ? "Champion" : index === 0 ? "Runner Up" : "Third Place"}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="rounded-3xl border border-[#00666B]/35 bg-[#003339]/65 shadow-xl shadow-black/30 overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[750px]">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 sm:gap-4 bg-[#003339]/95 px-4 sm:px-6 py-4 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#F7F7F8]/65">
                    <div className="col-span-4">Performer</div>
                    <div className="col-span-3">Team</div>
                    <div className="col-span-2 text-right">Points</div>
                    <div className="col-span-2 text-right">Growth</div>
                    <div className="col-span-1 text-right">Rank</div>
                  </div>
                  
                  {/* Rows */}
                  <div className="divide-y divide-[#00666B]/35">
                    {leaderboardRows.map((row) => (
                      <div key={`${row.team}-${row.name}`} className="group/row relative grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center transition-colors hover:bg-[#39A8AD]/10 overflow-hidden">
                        {row.rank <= 3 && <GlimmerOverlay />}
                        
                        <div className="col-span-4 relative z-10">
                          <p className="font-semibold text-sm sm:text-base text-[#F7F7F8] truncate">{row.name}</p>
                          <p className="text-[10px] sm:text-xs text-[#73FFFF]/45 truncate">{row.role}</p>
                        </div>
                        <div className="col-span-3 relative z-10 text-sm font-medium text-[#F7F7F8]/80 truncate">
                          {row.team}
                        </div>
                        <div className="col-span-2 relative z-10 text-right text-xs sm:text-sm font-bold tabular-nums text-[#F7F7F8]">
                          {row.score.toLocaleString()}
                        </div>
                        <div className="col-span-2 relative z-10 text-right text-sm font-semibold text-[#73FFFF]/85">
                          +{row.growth}
                        </div>
                        <div className="col-span-1 relative z-10 flex justify-end">
                          <span 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all"
                            style={{ 
                              borderColor: row.rank <= 3 ? `${rankColors[row.rank as keyof typeof rankColors]}66` : 'rgba(0,102,107,0.45)',
                              backgroundColor: row.rank <= 1 ? `${rankColors[1]}33` : row.rank === 2 ? `${rankColors[2]}33` : row.rank === 3 ? `${rankColors[3]}33` : 'rgba(0,102,107,0.8)',
                              color: row.rank <= 3 ? rankColors[row.rank as keyof typeof rankColors] : 'rgba(247,247,248,0.65)'
                            }}
                          >
                            {row.rank}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-2xl sm:rounded-3xl border border-[#00666B]/35 bg-linear-to-br from-[#003339]/75 via-[#051B1D] to-[#003339]/75 p-4 sm:p-5">
              <h4 className="text-base sm:text-lg font-bold text-[#F7F7F8]">Squad Matchups</h4>
              <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <MiniTeamCard team={leaderTeam} isLeader={true} onSelect={() => setSelectedMiniTeam(leaderTeam)} teamColor={teamColor} />
                <MiniTeamCard team={secondTeam} isLeader={false} onSelect={() => setSelectedMiniTeam(secondTeam)} teamColor={teamColor} />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Member Activity Breakdown */}
              <div className="lg:col-span-7">
                {chartDefs.filter(c => c.type === "stacked-bar").map((chart) => (
                  <div key={chart.title} className="rounded-2xl sm:rounded-3xl border border-[#00666B]/35 bg-[#003339]/65 p-6 sm:p-8 shadow-xl shadow-black/20 h-full">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#73FFFF]/45">{chart.subtitle}</p>
                    <h4 className="mt-1 text-base sm:text-lg font-bold text-[#F7F7F8]">{chart.title}</h4>
                    <div className="mt-8 space-y-8">
                      {chart.entries?.map((entry: any) => {
                        const total = entry.values.reduce((a: number, b: number) => a + b, 0);
                        const maxRowTotal = Math.max(...(chart.entries || []).map((e: any) => e.values.reduce((a: number, b: number) => a + b, 0)));
                        return (
                          <div key={entry.label} className="group/row">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#00666B]" />
                                <p className="text-sm font-bold text-[#F7F7F8]">{entry.label}</p>
                              </div>
                              <p className="text-[10px] font-bold text-[#73FFFF]/45 uppercase tracking-widest">{total} total</p>
                            </div>
                            <div className="relative h-10 w-full">
                              <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                whileInView={{ width: `${(total / (maxRowTotal || 1)) * 100}%`, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="flex h-full overflow-hidden rounded-xl bg-[#00666B]/40 border border-[#00666B]/30"
                              >
                                {entry.values.map((val: number, valIdx: number) => {
                                  const pct = (val / total) * 100;
                                  const colors = stackedChartSegmentColors;
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
                                      {val > 2 && <span className="text-[10px] font-black text-[#051B1D] drop-shadow-sm">{val}</span>}
                                    </motion.div>
                                  );
                                })}
                              </motion.div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="mt-10 flex items-center justify-center gap-8 rounded-2xl border border-[#00666B]/35 bg-[#003339]/40 py-4">
                        {["MOUs", "Calls", "Follows"].map((l, i) => (
                          <div key={l} className="flex items-center gap-3">
                            <span className={`h-3 w-3 rounded-full ${stackedLegendDots[i]}`} />
                            <span className="text-[10px] font-bold text-[#F7F7F8]/65 uppercase tracking-widest">{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Growth Trend + Quick Insights */}
              <div className="lg:col-span-5 space-y-8">
                {chartDefs.filter(c => c.type === "line").map((chart) => (
                  <div key={chart.title} className="rounded-2xl sm:rounded-3xl border border-[#00666B]/35 bg-[#003339]/65 p-6 sm:p-8 shadow-xl shadow-black/20">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#73FFFF]/45">{chart.subtitle}</p>
                    <h4 className="mt-1 text-base sm:text-lg font-bold text-[#F7F7F8]">{chart.title}</h4>
                    <div className="mt-8 w-full pt-4">
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
                                  />
                                ))}
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                      <div className="mt-8 flex justify-between px-2">
                        {chart.categories?.map(c => <span key={c} className="text-[9px] font-bold uppercase tracking-tighter text-[#73FFFF]/45">{c}</span>)}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-6">
                        {chart.series?.map(s => (
                          <div key={s.name} className="flex items-center gap-3">
                            <span className="h-0.5 w-6" style={{ backgroundColor: s.color }} />
                            <span className="text-[10px] text-[#F7F7F8]/65 font-bold uppercase tracking-wider">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl sm:rounded-3xl border border-[#00666B]/35 bg-linear-to-br from-[#003339]/75 via-[#051B1D] to-[#003339]/75 p-6 sm:p-8 shadow-xl">
                  <h4 className="text-base sm:text-lg font-bold text-[#F7F7F8]">Quick Insights</h4>
                  <div className="mt-6 space-y-4">
                    {quickInsights.map((insight, index) => (
                      <div key={index} className="rounded-2xl border border-[#00666B]/35 bg-[#003339]/80 p-4 sm:p-5 hover:bg-[#003339]/100 transition-colors">
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#73FFFF]/45">{insight.label}</p>
                        <p className="mt-1 text-base sm:text-lg font-bold text-[#F7F7F8]">{insight.value}</p>
                        <p className="mt-1 text-[10px] sm:text-xs font-semibold text-[#73FFFF]">{insight.growth}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMiniTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#051B1D]/80 px-4 backdrop-blur-sm"
            onClick={() => setSelectedMiniTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-6xl overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] border border-[#00666B]/45 bg-linear-to-br from-[#003339] via-[#051B1D] to-[#003339] p-6 sm:p-10 shadow-2xl shadow-black/60 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <PerformerModal team={selectedMiniTeam} onClose={() => setSelectedMiniTeam(null)} teamColor={teamColor} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
