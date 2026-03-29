/* eslint-disable react-hooks/purity */
"use client";

import { useState, useEffect, useRef } from "react";
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';
import { RecapCanvas } from '@/components/RecapCanvas';
import Konva from 'konva';
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MascotAvatar from "@/components/MascotAvatar";
import PawPrints from "@/components/PawPrints";
import { supabase } from "@/lib/supabase";
import Cropper, { Area, Point } from "react-easy-crop";

interface WrappedStats {
  topTeam: { name: string; points: number };
  globalMvp: Performer | null;
  teamAce: Performer | null;
  currentTeamName: string;
}

interface Performer {
  email: string; // 👈 Added unique identifier
  name: string;
  role: string;
  score: number;
  avatar: string;
  metrics: {
    mous: number;
    coldCalls: number;
    followups: number;
    sent_emails?: number;
    confirmed_mous?: number;
    igt_meetings?: number;
    igt_proposals?: number;
    leads?: number;
    igt_contracts?: number;
    igt_training?: number;
    realized?: number;
    igt_team_meeting?: number;
    igt_team_bonus?: number;
  };
}

interface MiniTeamData {
  slug?: string; // 👈 Added for display
  name: string;
  rank: number;
  points: number;
  growth: number;
  icon: string;
  performers: Performer[];
  allPerformers?: Performer[];
}

interface TeamData {
  name: string;
  displayName: string;
  miniTeams: MiniTeamData[];
  totalPoints: number;
  totalGrowth: number;
  completedActions: number;
  weeklyGrowth: number;
  asOfDate?: string;
  syncInfo?: {
    lastSyncTime: string;
    nextSyncTime: string;
    intervalMinutes: number;
  };
}

interface DashboardApiResponse {
  ok: boolean;
  data?: TeamData;
}

const LIVE_REFRESH_MS = 60_000;

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

function SyncCountdown({ nextSyncTime, teamColor }: { nextSyncTime?: string; teamColor: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("--:--");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!nextSyncTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(nextSyncTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Syncing...");
        return;
      }

      const mins = Math.floor(diff / 1000 / 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextSyncTime]);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sync/run`, {
        method: 'POST',
        headers: {
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      if (resp.ok) {
        alert("⚡ Sync Triggered! Dashboard will update in 1-2 minutes.");
      } else {
        alert("❌ Sync failed to start.");
      }
    } catch (e) {
      alert("❌ Connection error. Is your tunnel running?");
    } finally {
      setTimeout(() => setIsSyncing(false), 5000); // Debounce
    }
  };

  if (!nextSyncTime) return null;

  return (
    <div className="hidden lg:flex items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleManualSync}
        disabled={isSyncing}
        className={`relative overflow-hidden group px-4 py-2 rounded-xl border border-white/10 glass-premium text-[10px] font-black uppercase tracking-widest transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'}`}
        style={{ color: teamColor }}
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isSyncing ? 'Synchronizing...' : 'Sync Now'}
      </motion.button>
    </div>
  );
}

function CompetitiveLoader({ onFinish, dataReady, teamColor }: { onFinish: () => void; dataReady: boolean; teamColor: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Stage 1: Initial high-energy intro (Fixed timing)
    const sequence = [
      { delay: 800, next: 1 },  // READY
      { delay: 800, next: 2 },  // EXCHANGE
      { delay: 800, next: 3 },  // MARATHON
    ];

    let timer: NodeJS.Timeout;
    const runSequence = (idx: number) => {
      if (idx >= sequence.length) return;
      timer = setTimeout(() => {
        setPhase(sequence[idx].next);
        runSequence(idx + 1);
      }, sequence[idx].delay);
    };

    runSequence(0);
    return () => clearTimeout(timer);
  }, []);

  // Stage 2: Wait for data in Phase 3
  useEffect(() => {
    if (phase === 3 && dataReady) {
      // Transition to GO!
      const timer = setTimeout(() => {
        setPhase(4);
        setTimeout(onFinish, 1200); // 1.2s of GO! energy before fade
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [phase, dataReady, onFinish]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent overflow-hidden">
      {/* Speed Lines Background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%" }}
            animate={{ x: "250%" }}
            transition={{ 
              duration: 0.4, 
              repeat: Infinity, 
              delay: i * 0.08, 
              ease: "linear" 
            }}
            className="absolute h-[2px] w-[500px] bg-linear-to-r from-transparent via-[var(--team-accent)]/20 to-transparent"
            style={{ 
              top: `${(i * 4)}%`, 
              opacity: 0.1 + (i % 10) * 0.08,
              '--team-accent': teamColor
            } as any}
          />
        ))}
      </div>

      {/* Mascot Section Removed */}

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div
            key="ready"
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            className="relative"
          >
             <h1 className="text-6xl sm:text-9xl font-black text-white/30 italic tracking-tighter">
              READY?
            </h1>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div
            key="exchange"
            initial={{ x: "-100vw", skewX: -20, opacity: 0 }}
            animate={{ x: 0, skewX: 0, opacity: 1 }}
            exit={{ x: "100vw", skewX: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="relative"
          >
             <h1 className="text-7xl sm:text-[12rem] font-black italic tracking-tight transition-all duration-700" style={{ color: teamColor, filter: `drop-shadow(0 0 50px ${teamColor}66)` }}>
              EXCHANGE
            </h1>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="marathon"
            initial={{ x: "100vw", skewX: 20, opacity: 0 }}
            animate={{ x: 0, skewX: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0, filter: "blur(20px)" }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="relative"
          >
             <h1 className="text-7xl sm:text-[12rem] font-black text-white/60 italic tracking-tight drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              MARATHON
            </h1>
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div
            key="syncing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            className="flex flex-col items-center"
          >
             <div className="relative mb-12">
               {/* Logo at center */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <img src="/logo.png" alt="Xcend Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,205,0,0.3)]" />
               </div>
               {/* Buffering Ring */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="h-32 w-32 sm:h-48 sm:w-48 rounded-full border-t-4 border-r-4 border-[#73FFFF] border-b-4 border-l-4 border-white/5 opacity-50"
                 style={{ borderTopColor: '#73FFFF', borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
               />
             </div>
             <p className="text-sm sm:text-lg font-black uppercase tracking-[0.5em] animate-pulse" style={{ color: teamColor }}>
               Syncing Performance Data
             </p>
             <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
               Connecting to Marathon Database...
             </p>
          </motion.div>
        )}

        {phase === 4 && (
          <motion.div
            key="go"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], rotate: 0, opacity: 1 }}
            transition={{ 
              scale: { duration: 0.4, ease: "easeOut" },
              rotate: { type: "spring", damping: 10 },
              opacity: { duration: 0.2 }
            }}
            className="relative"
          >
             <h1 className="text-[10rem] sm:text-[20rem] font-black text-white italic tracking-tighter drop-shadow-[0_0_80px_rgba(255,255,255,0.8)]">
              GO!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const teamDataMap: Record<string, TeamData> = {
  igv_b2b: {
    name: "IGV",
    displayName: "Incoming Global Volunteer - B2B",
    miniTeams: [
      {
        slug: "b2b",
        name: "B2B",
        rank: 1,
        points: 1320,
        growth: 180,
        icon: "BT",
        performers: [
          { email: "ariana@example.com", name: "Ariana Cole", role: "Deal Closer", score: 540, avatar: "AC", metrics: { mous: 24, coldCalls: 45, followups: 12 } },
          { email: "brian@example.com", name: "Brian Kim", role: "Pipeline Builder", score: 470, avatar: "BK", metrics: { mous: 18, coldCalls: 38, followups: 15 } },
          { email: "nina@example.com", name: "Nina Park", role: "Partner Lead", score: 410, avatar: "NP", metrics: { mous: 22, coldCalls: 30, followups: 10 } },
          { email: "sion@example.com", name: "Sion Wu", role: "Market Analyst", score: 380, avatar: "SW", metrics: { mous: 15, coldCalls: 35, followups: 18 } },
          { email: "tara@example.com", name: "Tara Singh", role: "Lead Gen", score: 320, avatar: "TS", metrics: { mous: 12, coldCalls: 40, followups: 22 } },
          { email: "lucas@example.com", name: "Lucas Gray", role: "Contract Mgr", score: 290, avatar: "LG", metrics: { mous: 10, coldCalls: 25, followups: 15 } },
          { email: "maya@example.com", name: "Maya J", role: "Sales Support", score: 250, avatar: "MJ", metrics: { mous: 8, coldCalls: 20, followups: 12 } },
        ],
      },
    ],
    totalPoints: 1320,
    totalGrowth: 180,
    completedActions: 45,
    weeklyGrowth: 180,
  },
  igv_ir: {
    name: "IGV",
    displayName: "Incoming Global Volunteer - IR Matching",
    miniTeams: [
      {
        slug: "ir_matching",
        name: "IR Matching",
        rank: 1,
        points: 1130,
        growth: 140,
        icon: "BH",
        performers: [
          { email: "marco.l@example.com", name: "Marco Lee", role: "Outreach Lead", score: 500, avatar: "ML", metrics: { mous: 20, coldCalls: 42, followups: 14 } },
          { email: "sasha.r@example.com", name: "Sasha Ray", role: "Prospect Analyst", score: 390, avatar: "SR", metrics: { mous: 15, coldCalls: 35, followups: 18 } },
          { email: "dion.c@example.com", name: "Dion Cruz", role: "Follow-up Owner", score: 350, avatar: "DC", metrics: { mous: 12, coldCalls: 28, followups: 20 } },
          { email: "elena.v@example.com", name: "Elena V", role: "Growth Rep", score: 310, avatar: "EV", metrics: { mous: 10, coldCalls: 30, followups: 15 } },
          { email: "kai.c@example.com", name: "Kai Chen", role: "Market Lead", score: 280, avatar: "KC", metrics: { mous: 9, coldCalls: 25, followups: 12 } },
          { email: "mira.s@example.com", name: "Mira Sol", role: "Sales Ops", score: 240, avatar: "MS", metrics: { mous: 7, coldCalls: 20, followups: 10 } },
          { email: "leo.d@example.com", name: "Leo Das", role: "Outreach", score: 210, avatar: "LD", metrics: { mous: 6, coldCalls: 18, followups: 8 } },
        ],
      },
    ],
    totalPoints: 1130,
    totalGrowth: 140,
    completedActions: 41,
    weeklyGrowth: 140,
  },
  igt_b2b: {
    name: "IGT",
    displayName: "Incoming Global Talent - Operations",
    miniTeams: [
      {
        slug: "ir_nexus",
        name: "IR Nexus",
        rank: 1,
        points: 1280,
        growth: 165,
        icon: "IN",
        performers: [
          { email: "layla.n@example.com", name: "Layla Noor", role: "Exchange Liaison", score: 520, avatar: "LN", metrics: { mous: 21, coldCalls: 48, followups: 11 } },
          { email: "theo.g@example.com", name: "Theo Grant", role: "Country Lead", score: 430, avatar: "TG", metrics: { mous: 17, coldCalls: 40, followups: 16 } },
          { email: "mina.s@example.com", name: "Mina Sol", role: "Partnership Support", score: 330, avatar: "MS", metrics: { mous: 14, coldCalls: 32, followups: 19 } },
          { email: "sion.w@example.com", name: "Sion Wu", role: "Market Analyst", score: 310, avatar: "SW", metrics: { mous: 13, coldCalls: 30, followups: 15 } },
          { email: "tara.s@example.com", name: "Tara Singh", role: "Lead Gen", score: 290, avatar: "TS", metrics: { mous: 11, coldCalls: 28, followups: 18 } },
          { email: "lucas.g@example.com", name: "Lucas Gray", role: "Contract Mgr", score: 260, avatar: "LG", metrics: { mous: 9, coldCalls: 22, followups: 14 } },
          { email: "maya.j@example.com", name: "Maya J", role: "Sales Support", score: 230, avatar: "MJ", metrics: { mous: 7, coldCalls: 18, followups: 11 } },
        ],
      },
    ],
    totalPoints: 1280,
    totalGrowth: 165,
    completedActions: 46,
    weeklyGrowth: 165,
  },
  igt_ir: {
    name: "IGT",
    displayName: "Incoming Global Talent - IR Matching",
    miniTeams: [
      {
        slug: "ir_connectors",
        name: "IR Connectors",
        rank: 1,
        points: 1210,
        growth: 155,
        icon: "IC",
        performers: [
          { email: "ethan.v@example.com", name: "Ethan Vale", role: "Network Builder", score: 480, avatar: "EV", metrics: { mous: 19, coldCalls: 44, followups: 13 } },
          { email: "ivy.c@example.com", name: "Ivy Chen", role: "Account Partner", score: 410, avatar: "IC", metrics: { mous: 16, coldCalls: 36, followups: 17 } },
          { email: "sara.m@example.com", name: "Sara Moon", role: "Process Lead", score: 320, avatar: "SM", metrics: { mous: 13, coldCalls: 30, followups: 21 } },
          { email: "noel.h@example.com", name: "Noel Hart", role: "Ops Specialist", score: 290, avatar: "NH", metrics: { mous: 11, coldCalls: 26, followups: 16 } },
          { email: "kira.d@example.com", name: "Kira Dean", role: "Matcher", score: 260, avatar: "KD", metrics: { mous: 9, coldCalls: 22, followups: 14 } },
          { email: "rico.b@example.com", name: "Rico Barnes", role: "Workflow Lead", score: 230, avatar: "RB", metrics: { mous: 7, coldCalls: 18, followups: 12 } },
          { email: "tina.m@example.com", name: "Tina Moss", role: "Follow-up Owner", score: 200, avatar: "TM", metrics: { mous: 6, coldCalls: 15, followups: 10 } },
        ],
      },
    ],
    totalPoints: 1210,
    totalGrowth: 155,
    completedActions: 46,
    weeklyGrowth: 155,
  },
  ogt_ops: {
    name: "OGT",
    displayName: "Outgoing Global Talent - Operations",
    miniTeams: [
      {
        slug: "matching_pros",
        name: "Matching Pros",
        rank: 1,
        points: 1350,
        growth: 195,
        icon: "MP",
        performers: [
          { email: "jade.b@example.com", name: "Jade Brooks", role: "Conversion Lead", score: 560, avatar: "JB", metrics: { mous: 26, coldCalls: 50, followups: 9 } },
          { email: "noel.h2@example.com", name: "Noel Hart", role: "Ops Specialist", score: 450, avatar: "NH", metrics: { mous: 20, coldCalls: 42, followups: 14 } },
          { email: "kira.d2@example.com", name: "Kira Dean", role: "Matcher", score: 340, avatar: "KD", metrics: { mous: 15, coldCalls: 34, followups: 18 } },
          { email: "rico.b2@example.com", name: "Rico Barnes", role: "Workflow Lead", score: 310, avatar: "RB", metrics: { mous: 14, coldCalls: 30, followups: 15 } },
          { email: "tina.m2@example.com", name: "Tina Moss", role: "Follow-up Owner", score: 280, avatar: "TM", metrics: { mous: 12, coldCalls: 26, followups: 12 } },
          { email: "ava.q@example.com", name: "Ava Quinn", role: "Data Tracker", score: 250, avatar: "AQ", metrics: { mous: 10, coldCalls: 22, followups: 10 } },
          { email: "leo.d2@example.com", name: "Leo Das", role: "Outreach", score: 220, avatar: "LD", metrics: { mous: 8, coldCalls: 18, followups: 8 } },
        ],
      },
    ],
    totalPoints: 1350,
    totalGrowth: 195,
    completedActions: 42,
    weeklyGrowth: 195,
  },
  ogt_matching: {
    name: "OGT",
    displayName: "Outgoing Global Talent - IR Matching",
    miniTeams: [
      {
        slug: "matching_core",
        name: "Matching Core",
        rank: 1,
        points: 1100,
        growth: 130,
        icon: "MC",
        performers: [
          { email: "rico.b3@example.com", name: "Rico Barnes", role: "Workflow Lead", score: 430, avatar: "RB", metrics: { mous: 18, coldCalls: 38, followups: 15 } },
          { email: "tina.m3@example.com", name: "Tina Moss", role: "Follow-up Owner", score: 370, avatar: "TM", metrics: { mous: 16, coldCalls: 35, followups: 17 } },
          { email: "ava.q2@example.com", name: "Ava Quinn", role: "Data Tracker", score: 300, avatar: "AQ", metrics: { mous: 12, coldCalls: 28, followups: 20 } },
          { email: "kai.c2@example.com", name: "Kai Chen", role: "Market Lead", score: 270, avatar: "KC", metrics: { mous: 10, coldCalls: 25, followups: 15 } },
          { email: "mira.s2@example.com", name: "Mira Sol", role: "Sales Ops", score: 240, avatar: "MS", metrics: { mous: 8, coldCalls: 20, followups: 12 } },
          { email: "luna.j@example.com", name: "Luna J", role: "Coord Lead", score: 210, avatar: "LJ", metrics: { mous: 6, coldCalls: 18, followups: 10 } },
          { email: "zane.o@example.com", name: "Zane O", role: "Support", score: 180, avatar: "ZO", metrics: { mous: 5, coldCalls: 15, followups: 8 } },
        ],
      },
    ],
    totalPoints: 1100,
    totalGrowth: 130,
    completedActions: 36,
    weeklyGrowth: 130,
  },
  marcom: {
    name: "MST",
    displayName: "Marketing & Strategy - Growth & Outreach",
    miniTeams: [
      {
        slug: "marcom_stars",
        name: "T01",
        rank: 1,
        points: 1290,
        growth: 170,
        icon: "MS",
        performers: [
          { email: "pia.l@example.com", name: "Pia Logan", role: "Campaign Lead", score: 510, avatar: "PL", metrics: { mous: 22, coldCalls: 46, followups: 12 } },
          { email: "cody.w@example.com", name: "Cody Wynn", role: "Content Strategist", score: 430, avatar: "CW", metrics: { mous: 18, coldCalls: 39, followups: 15 } },
          { email: "lena.f@example.com", name: "Lena Ford", role: "Brand Owner", score: 350, avatar: "LF", metrics: { mous: 14, coldCalls: 31, followups: 20 } },
          { email: "sion.w2@example.com", name: "Sion Wu", role: "Market Analyst", score: 320, avatar: "SW", metrics: { mous: 12, coldCalls: 28, followups: 16 } },
          { email: "tara.s2@example.com", name: "Tara Singh", role: "Lead Gen", score: 290, avatar: "TS", metrics: { mous: 10, coldCalls: 25, followups: 14 } },
          { email: "lucas.g2@example.com", name: "Lucas Gray", role: "Contract Mgr", score: 260, avatar: "LG", metrics: { mous: 8, coldCalls: 20, followups: 12 } },
          { email: "maya.j2@example.com", name: "Maya J", role: "Sales Support", score: 230, avatar: "MJ", metrics: { mous: 6, coldCalls: 18, followups: 10 } },
        ],
      },
      {
        slug: "marcom_wave",
        name: "T02",
        rank: 2,
        points: 1160,
        growth: 145,
        icon: "MW",
        performers: [
          { email: "mason.h@example.com", name: "Mason Hale", role: "Media Planner", score: 460, avatar: "MH", metrics: { mous: 19, coldCalls: 43, followups: 14 } },
          { email: "ella.r@example.com", name: "Ella Reed", role: "Audience Lead", score: 390, avatar: "ER", metrics: { mous: 16, coldCalls: 36, followups: 17 } },
          { email: "zane.o2@example.com", name: "Zane Ortiz", role: "Social Manager", score: 310, avatar: "ZO", metrics: { mous: 12, coldCalls: 29, followups: 22 } },
          { email: "elena.v2@example.com", name: "Elena V", role: "Growth Rep", score: 280, avatar: "EV", metrics: { mous: 10, coldCalls: 25, followups: 15 } },
          { email: "kai.c3@example.com", name: "Kai Chen", role: "Market Lead", score: 250, avatar: "KC", metrics: { mous: 8, coldCalls: 22, followups: 12 } },
          { email: "mira.s3@example.com", name: "Mira Sol", role: "Sales Ops", score: 220, avatar: "MS", metrics: { mous: 6, coldCalls: 18, followups: 10 } },
          { email: "leo.d3@example.com", name: "Leo Das", role: "Outreach", score: 190, avatar: "LD", metrics: { mous: 5, coldCalls: 15, followups: 8 } },
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
  igv_b2b: "var(--igv-color)",
  igv_ir: "var(--igv-color)",
  igt_b2b: "var(--igt-color)",
  igt_ir: "var(--igt-color)",
  ogt_ops: "var(--ogt-color)",
  ogt_matching: "var(--ogt-color)",
  marcom: "var(--mst-color)",
  irm1_t01: "var(--igv-color)",
  irm2_t02: "var(--igv-color)",
  members: "var(--mst-color)",
  tls: "var(--mst-color)",
  ogt: "var(--ogt-color)",
};

const quickInsights = [
  { label: "Most Improved Team", value: "B2B Hunters" },
  { label: "Top Swapper", value: "Alex Johnson" },
  { label: "Fastest Growth Category", value: "Outreach" },
];

const vibrantBarColors = [
  "bg-[#FF5722]", // Deep Orange
  "bg-[#4CAF50]", // Green
  "var(--team-accent)", // Dynamic Team Color
  "bg-[#FFC107]", // Amber
];

const stackedChartSegmentColors = [
  "bg-[#E91E63] shadow-[0_0_20px_rgba(233,30,99,0.45)]", // Pink
  "bg-[#9C27B0] shadow-[0_0_20px_rgba(156,39,176,0.45)]", // Purple
  "var(--team-accent-bg) shadow-[0_0_20px_rgba(0,188,212,0.45)]", // Dynamic Team Color
];

const stackedLegendDots = ["bg-[#E91E63]", "bg-[#9C27B0]", "var(--team-accent-bg)"];
const mstTeamNames: Record<string, string> = {
  "T01": "Team Senadi",
  "T02": "Team Yasodara",
  "T03": "Team Hasandi",
  "T04": "Team Shanaya",
  "T05": "Team Thiva",
  "T06": "Team Raj",
  "T07": "Team Dimalka",
  "t01": "Team Senadi",
  "t02": "Team Yasodara",
  "t03": "Team Hasandi",
  "t04": "Team Shanaya",
  "t05": "Team Thiva",
  "t06": "Team Raj",
  "t07": "Team Dimalka",
  "irm1_t01": "IRM1 T01",
  "irm2_t01": "IRM2 T01",
  "irm1_t02": "IRM1 T02",
  "irm2_t02": "IRM2 T02"
};

const isTLRole = (role: string): boolean => {
  const normalized = role.trim().toLowerCase();
  return normalized === "tl" || normalized === "team leader" || normalized === "team lead" || normalized === "teamlead";
};

const formatTeamName = (name: string, isMST: boolean) => {
  if (!isMST) return name;
  // Rename irm1_t01 -> T01, etc.
  const match = name.match(/t(\d+)/i);
  if (match) return `T${match[1]}`;
  return name;
};

function MiniTeamCard({
  team,
  isLeader,
  teamColor,
  isMST = false,
  isOGT = false,
  isIGTB2B = false
}: {
  team: MiniTeamData;
  isLeader: boolean;
  teamColor: string;
  isMST?: boolean;
  isOGT?: boolean;
  isIGTB2B?: boolean;
}) {
  return (
    <div
      className={`group/card relative w-full rounded-2xl border p-6 sm:p-8 text-left transition-all duration-500 overflow-hidden ${
        isLeader
          ? "border-[#FFD700]/50 shadow-[0_0_40px_rgba(255,215,0,0.25)] ring-2 ring-[#FFD700]/40"
          : "border-white/5 bg-white/[0.02] hover:border-white/20"
      } glass-premium hover:scale-[1.02]`}
      style={isLeader ? { 
        background: `linear-gradient(to bottom right, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05), transparent)` 
      } : {}}
    >
      {isLeader && <GlimmerOverlay />}

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h3 
              className={`text-xl sm:text-2xl font-black tracking-tight text-[#F7F7F8]`}
              style={isLeader ? { color: '#ffcd00', textShadow: '0 0 15px rgba(255, 205, 0, 0.3)' } : {}}
            >
              {formatTeamName(team.name, isMST)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2 w-2 rounded-full ${isLeader ? "bg-[var(--level-up)]" : "bg-white/20"}`} />
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">RANK #{team.rank}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Total Performance</p>
            <p className="text-2xl sm:text-3xl font-black text-[#F7F7F8] tabular-nums">{team.points.toLocaleString()}</p>
          </div>
          {/* <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Weekly Growth</p>
            <p className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color: isLeader ? '#ffcd00' : teamColor }}>
              +{team.growth}
            </p>
          </div> */}
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
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-2000 w-56 pointer-events-none opacity-0 group-hover/card:opacity-100 group-hover/metrics:opacity-100 transition-all duration-300 transform scale-95 group-hover/card:scale-100 group-hover/metrics:scale-100">
            <div 
              className="rounded-2xl border border-white/10 p-4 shadow-2xl backdrop-blur-md"
              style={{ backgroundColor: `color-mix(in srgb, ${teamColor}, black 90%)` }}
            >
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3 text-center border-b border-white/5 pb-2">
                {isMST ? `${formatTeamName(team.name, isMST)} Members + TLs` : isIGTB2B ? "IGT B2B Squad Activity" : isOGT ? "OGT Squad Activity" : "Squad Activity"}
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {isMST ? (
                  [...(team.allPerformers || team.performers)].sort((a,b) => b.score - a.score).map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-bold gap-2">
                      <span className="text-white/30 truncate flex-1">{p.name}</span>
                      <span style={{ color: teamColor }}>{p.score}</span>
                    </div>
                  ))
                ) : isOGT ? (
                  <>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">SU</span>
                      <span className="text-[#E91E63]">{team.performers.reduce((s, p) => s + p.metrics.mous, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">APL</span>
                      <span className="text-[#9C27B0]">{team.performers.reduce((s, p) => s + p.metrics.coldCalls, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">APD</span>
                      <span className="text-[#00BCD4]">{team.performers.reduce((s, p) => s + p.metrics.followups, 0)}</span>
                    </div>
                  </>
                ) : isIGTB2B ? (
                  <>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">Meetings</span>
                      <span className="text-[#E91E63]">{team.performers.reduce((s, p) => s + p.metrics.mous, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">Cold Calls</span>
                      <span className="text-[#9C27B0]">{team.performers.reduce((s, p) => s + p.metrics.coldCalls, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">Follow Ups</span>
                      <span className="text-[#00BCD4]">{team.performers.reduce((s, p) => s + p.metrics.followups, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/5 pt-2 mt-1">
                      <span className="text-white/30">Team Meeting</span>
                      <span className="text-[#FF9800]">{team.performers[0]?.metrics.igt_team_meeting || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-white/30">Team Bonus</span>
                      <span className="text-[#4CAF50]">{team.performers[0]?.metrics.igt_team_bonus || 0}</span>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformerModal({
  team,
  onClose,
  teamColor,
  isMST = false,
  isB2B = false
}: {
  team: MiniTeamData;
  onClose: () => void;
  teamColor: string;
  isMST?: boolean;
  isB2B?: boolean;
}) {
  const [first, second, third] = team.performers;
  const podiumOrder = [second, first, third].filter(Boolean);
  const podiumHeights = ["h-32", "h-44", "h-28"];

  return (
    <div className="relative max-h-[90vh] overflow-hidden flex flex-col">
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-[#192230]/95 backdrop-blur-xl px-2 py-4 sm:py-5">
        <div className="flex items-center gap-4 sm:gap-6">
          <div 
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/10"
            style={{ background: `linear-gradient(to bottom right, color-mix(in srgb, ${teamColor}, transparent 80%), transparent)` }}
          >
            📊
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-1" style={{ color: `color-mix(in srgb, ${teamColor}, white 40%)` }}>Squad Analytical Intel</p>
            <h3 className="text-2xl sm:text-4xl font-black text-[#F7F7F8] tracking-tighter">{formatTeamName(team.name, isMST)} <span className="text-white/10">Performance Card</span></h3>
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
            <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-8 sm:mb-12 text-center" style={{ color: `color-mix(in srgb, ${teamColor}, white 20%)` }}>Elite Performer Arena</p>
            <div className="flex items-end justify-center gap-3 sm:gap-10">
              {podiumOrder.map((performer, index) => {
                const isFirst = performer === first;
                const pRankNum = isFirst ? '1' : index === 0 ? '2' : '3';
                const pHeight = isFirst ? 'h-40 sm:h-52' : index === 0 ? 'h-32 sm:h-36' : 'h-28 sm:h-32';
                return (
                  <div key={performer.email} className="flex flex-1 flex-col items-center group/podium max-w-[120px] sm:max-w-[160px]">
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
                  <div key={performer.email} className="group/row flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4 sm:p-5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 overflow-hidden relative shadow-lg shadow-black/10">
                    {(isB2B ? (performer.role && isTLRole(performer.role) && rankNum === 1) : (rankNum <= 3)) && <GlimmerOverlay />}
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
                        {/* <p className="text-[8px] font-black text-[var(--level-up)] uppercase">+{(performer.score * 0.1).toFixed(0)} Growth</p> */}
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

// Utility function to crop image
const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/png");
};

function WrappedExperience({ 
  onClose,
  stats,
  teamColor,
  teamParam,
}: { 
  onClose: () => void; 
  stats: WrappedStats; 
  teamColor: string;
  teamParam: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [customPhotos, setCustomPhotos] = useState<Record<number, string>>({});
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<Area | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreparingSeries, setIsPreparingSeries] = useState(false);
  
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const hasUploadedCurrent = !!customPhotos[activeIndex];
  const allPerformersUploaded = true;

  const cards = [
    {
      id: "weekly-snapshot",
      title: "Weekly Snapshot",
      content: (
        <div className="flex flex-col h-full text-center px-8 sm:px-12 relative w-full py-20 justify-center gap-12">
          <img src="/logo.png" alt="XCEND" className="absolute top-12 h-8 object-contain brightness-0 invert opacity-80 left-1/2 -translate-x-1/2" />
          <div className="flex flex-col items-center">
            <div className="transform scale-[1.15] relative">
               <div className="absolute -inset-10 bg-[#FFD700]/10 blur-3xl rounded-full" />
               <MascotAvatar type="flag" size={320} glowColor={teamColor} />
            </div>
          </div>
          <div className="space-y-3 z-10">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.6em] text-[#FFD700]/90 italic">WEEK 01 SNAPSHOT</p>
            <h2 className="text-2xl sm:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight max-w-[95%] mx-auto">
              {stats.currentTeamName} RECAP
            </h2>
          </div>
        </div>
      )
    },
    {
      id: "best-team",
      title: "Best Team",
      content: (
        <div className="flex flex-col h-full text-center px-8 sm:px-12 relative overflow-hidden bg-black/20 py-20 justify-center">
          <img src="/logo.png" alt="XCEND" className="absolute top-12 h-8 object-contain brightness-0 invert opacity-80 left-1/2 -translate-x-1/2" />
          <div className="text-[10rem] sm:text-[14rem] font-black text-white/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none tracking-widest uppercase italic pointer-events-none">
            {stats.topTeam.name.split(' ')[0]}
          </div>
          <div className="relative z-10 space-y-10">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-white/90 italic">BEST PERFORMING TEAM</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter leading-tight uppercase max-w-[95%] mx-auto">
              {stats.topTeam.name}
            </h2>
            <div className="inline-flex items-center justify-center rounded-3xl glass border border-white/20 px-10 py-4 shadow-2xl">
              <p className="text-3xl sm:text-5xl font-black text-[#FFD700] italic mr-4">{stats.topTeam.points}</p>
              <p className="text-sm sm:text-base font-black uppercase tracking-[0.3em] text-white/60 italic">PTS</p>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-90 scale-100 origin-bottom-right">
            <MascotAvatar type="laptop" size={300} glowColor={teamColor} />
          </div>
        </div>
      )
    },
    {
      id: "best-performer-member",
      title: "Best Performer",
      content: (
        <div className="flex flex-col items-center h-full text-center px-8 sm:px-12 py-16 justify-center relative w-full">
          <div className="flex flex-col items-center w-full space-y-10">
            {/* Logo & Headline Group */}
            <div className="space-y-6 flex flex-col items-center">
              <img src="/logo.png" alt="XCEND" className="h-8 object-contain brightness-0 invert opacity-80" />
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.6em] text-[#FFD700]/90 whitespace-nowrap">BEST PERFORMER</p>
            </div>
            
            {/* Profile Frame */}
            <div className="relative">
              <div className="w-44 h-44 sm:w-60 sm:h-60 rounded-full border-[6px] border-[#FFD700]/15 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] mx-auto bg-white/20 flex items-center justify-center relative">
                {customPhotos[2] ? (
                  <img src={customPhotos[2]} className="w-full h-full object-cover" alt="Custom" />
                ) : (
                  <div className="text-8xl opacity-80">{stats.globalMvp?.avatar || "👤"}</div>
                )}
              </div>
              <div className="absolute -inset-10 bg-[#FFD700]/10 blur-3xl -z-10 rounded-full" />
            </div>

            <div className="space-y-6 w-full flex flex-col items-center">
              <div className="space-y-2">
                <p className="text-[10px] sm:text-sm font-black text-[#FFD700] uppercase tracking-[0.5em] opacity-80 border-b border-[#FFD700]/20 pb-2 inline-block">
                  {stats.currentTeamName}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight max-w-[95%]">
                  {stats.globalMvp?.name || "Member Name"}
                </h2>
              </div>
              <div className="pt-6 w-full border-t border-white/10">
                <p className="text-[10px] sm:text-xs font-black text-white/30 uppercase tracking-[0.6em]">MEMBER</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "best-performer-tl",
      title: "Best TL",
      content: (
        <div className="flex flex-col items-center h-full text-center px-8 sm:px-12 py-16 justify-center relative w-full">
          <div className="flex flex-col items-center w-full space-y-10">
            {/* Logo & Headline Group */}
            <div className="space-y-6 flex flex-col items-center">
              <img src="/logo.png" alt="XCEND" className="h-8 object-contain brightness-0 invert opacity-80" />
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.6em] text-[#FFD700]/90 whitespace-nowrap">BEST PERFORMER</p>
            </div>
            
            {/* Profile Frame */}
            <div className="relative">
              <div className="w-44 h-44 sm:w-60 sm:h-60 rounded-full border-[6px] border-[#FFD700]/15 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] mx-auto bg-white/20 flex items-center justify-center relative">
                {customPhotos[3] ? (
                  <img src={customPhotos[3]} className="w-full h-full object-cover" alt="Custom" />
                ) : (
                  <div className="text-8xl opacity-80">{stats.teamAce?.avatar || "⭐"}</div>
                )}
              </div>
              <div className="absolute -inset-10 bg-[#FFD700]/10 blur-3xl -z-10 rounded-full" />
            </div>

            <div className="space-y-6 w-full flex flex-col items-center">
              <div className="space-y-2">
                <p className="text-[10px] sm:text-sm font-black text-[#FFD700] uppercase tracking-[0.5em] opacity-80 border-b border-[#FFD700]/20 pb-2 inline-block">
                  {stats.currentTeamName}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight max-w-[95%]">
                  {stats.teamAce?.name || "Team Leader"}
                </h2>
              </div>
              <div className="pt-6 w-full border-t border-white/10">
                <p className="text-[10px] sm:text-xs font-black text-white/30 uppercase tracking-[0.6em]">TEAM LEADER</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomPhotos(prev => ({ ...prev, [activeIndex]: reader.result as string }));
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const performShare = async () => {
    if (!stageRef.current || isSharing) return;
    setIsSharing(true);
    try {
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = stageRef.current.toDataURL({ 
        pixelRatio: 3,
        mimeType: 'image/png'
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `flyer-${cards[activeIndex].id}.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({ files: [file], title: 'Marathon Flyer', text: 'My performance recap!' });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `flyer-${cards[activeIndex].id}.png`;
        link.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  const performShareAll = async () => {
    if (isSharing || isPreparingSeries) return;
    setIsPreparingSeries(true);
    const files: File[] = [];
    try {
      const originalIndex = activeIndex;
      for (let i = 0; i < cards.length; i++) {
        setActiveIndex(i);
        await new Promise(r => setTimeout(r, 600));
        if (!stageRef.current) continue;
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 3 });
        const blob = await (await fetch(dataUrl)).blob();
        if (blob) {
          files.push(new File([blob], `flyer-${i+1}.png`, { type: 'image/png' }));
        }
      }

      if (files.length > 0) {
        if (navigator.share && navigator.canShare && navigator.canShare({ files })) {
          await navigator.share({ 
            files, 
            title: 'Marathon Recap Series', 
            text: 'Check out the marathon performance recap!' 
          });
        } else {
          files.forEach(file => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(link.href);
          });
        }
      }
      setActiveIndex(originalIndex);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPreparingSeries(false);
    }
  };

  const isPerformerCard = cards[activeIndex].id.includes("performer");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-6xl bg-black/80 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 overflow-y-auto md:overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-full max-h-[96vh] md:h-[90vh] md:max-h-[850px]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-all hover:rotate-90 md:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button 
          onClick={onClose}
          className="absolute -top-12 -right-12 z-50 p-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white/40 hover:text-white transition-all hover:rotate-90 hidden md:flex hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Top/Left Column: Preview List */}
        <div className="w-full md:w-[300px] border-b md:border-b-0 md:border-r border-white/5 bg-black/40 flex flex-col h-[140px] md:h-full">
          <div className="hidden md:block p-8 border-b border-white/5">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Recap Series</h3>
          </div>
          <div className="flex-1 overflow-x-auto md:overflow-y-auto p-4 md:p-6 flex md:flex-col gap-4 md:space-y-6 custom-scrollbar items-center">
            {cards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => { setActiveIndex(i); setIsCropping(false); }}
                className={`relative flex-shrink-0 w-[60px] md:w-full aspect-[9/16] rounded-lg md:rounded-[2rem] overflow-hidden transition-all group ${activeIndex === i ? 'ring-2 ring-[#FFD700] ring-offset-2 md:ring-offset-4 ring-offset-[#121926] scale-95 md:scale-95' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="w-full h-full relative" style={{ backgroundImage: 'url(/flyer-bg.png)', backgroundSize: 'cover' }}>
                  <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none opacity-80">
                     {card.content}
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-2 left-2 md:top-6 md:left-6 bg-black/60 backdrop-blur-md px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-full border border-white/10 flex items-center gap-1 md:gap-2">
                    <span className="text-[7px] md:text-[10px] font-black text-[#FFD700] italic">#{i + 1}</span>
                    <span className="hidden md:block text-[8px] font-black text-white/90 uppercase tracking-widest">{card.title}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Editor & Preview */}
        <div className="flex-1 flex flex-col bg-black/40">
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <div className="w-auto h-full max-h-[68vh] md:max-h-[75vh] aspect-[9/16] relative transition-all shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
              <RecapCanvas 
                ref={stageRef}
                cardId={cards[activeIndex].id}
                stats={stats}
                customPhoto={customPhotos[activeIndex]}
                teamColor={teamColor}
              />
            </div>

            {/* Editing Controls Overlay */}
            {isPerformerCard && (
              <div className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col gap-2 md:gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest transition-all hover:scale-105 shadow-xl"
                >
                  {hasUploadedCurrent ? 'Change Photo' : 'Upload Photo'}
                </button>
                {hasUploadedCurrent && (
                  <p className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[8px] uppercase font-black tracking-widest rounded-lg text-center backdrop-blur-md">
                    Drag to Position
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar: Action */}
          <div className="p-4 md:p-8 border-t border-white/5 bg-black/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs italic">
                {cards[activeIndex].title}
              </h4>
              <p className="text-white/30 text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-1">
                {isPerformerCard && !hasUploadedCurrent ? 'Upload a photo to activate' : 'Ready to share'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
               <button onClick={onClose} className="flex-1 md:flex-none px-4 py-3 md:px-6 md:py-4 text-white/40 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">Close</button>
               
               <div className="flex gap-2 flex-[2] md:flex-none">
                 <button 
                   onClick={performShare}
                   disabled={isSharing || (isPerformerCard && !hasUploadedCurrent)}
                   className={`flex-1 md:flex-none px-4 py-3 md:px-8 md:py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-20`}
                 >
                   {isSharing ? '...' : 'Share Selected'}
                 </button>
                 
                 <button 
                   onClick={performShareAll}
                   disabled={isSharing || !allPerformersUploaded}
                   className={`flex-1 md:flex-none px-6 py-3 md:px-10 md:py-5 bg-linear-to-r from-[#FFD700] to-[#FFA000] text-black font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] rounded-xl md:rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale`}
                 >
                   {isSharing ? '...' : (
                      <span className="md:hidden">ALL</span>
                   )}
                   <span className="hidden md:inline">SHARE ALL SERIES</span>
                 </button>
               </div>
            </div>
          </div>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </motion.div>
    </div>
  );
}


function ConstructionOverlay({ teamColor }: { teamColor: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent overflow-hidden">
      {/* Speed Lines Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-100%" }}
            animate={{ x: "250%" }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.1, 
              ease: "linear" 
            }}
            className="absolute h-[1px] w-[400px] bg-linear-to-r from-transparent via-[var(--team-accent)]/20 to-transparent"
            style={{ 
              top: `${(i * 7)}%`, 
              opacity: 0.1 + (i % 5) * 0.1,
              '--team-accent': teamColor
            } as any}
          />
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/logo.png" alt="Xcend Logo" className="w-16 h-16 object-contain opacity-50" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-t-2 border-r-2 border-white/20 border-b-2 border-l-2 border-transparent"
            style={{ borderTopColor: teamColor }}
          />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white italic tracking-tighter mb-2 uppercase text-center">
          STILL IN <span style={{ color: teamColor }}>CONSTRUCTION</span>
        </h2>
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] animate-pulse text-center" style={{ color: teamColor }}>
          Buffering Performance Engine
        </p>
        <Link 
          href="/"
          className="mt-12 group flex items-center gap-2 px-8 py-3 rounded-full glass border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
        >
          <span className="opacity-40 group-hover:-translate-x-1 transition-transform">←</span>
          Exit to Home
        </Link>
      </div>
    </div>
  );
}

function UnlinkedState({ functionName, teamColor }: { functionName: string; teamColor: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-transparent overflow-hidden p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-12"
      >
        <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-full glass-premium flex items-center justify-center shadow-2xl border border-white/10">
           <motion.div 
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="text-7xl sm:text-9xl"
           >
             📡
           </motion.div>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-4 rounded-full border-2 border-dashed"
          style={{ borderColor: `${teamColor}44` }}
        />
      </motion.div>
      <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter mb-4 uppercase">
        {functionName} <span style={{ color: teamColor }}>Pending</span>
      </h2>
      <p className="max-w-md text-sm sm:text-base font-medium text-white/50 leading-relaxed">
        This performance dashboard has not been linked to a live Google Sheet source yet. 
        Please contact the administrator to initialize the sync.
      </p>
      <Link 
        href="/"
        className="mt-12 px-8 py-4 rounded-full text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 transition-all"
        style={{ background: `linear-gradient(to right, ${teamColor}, #192230)` }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function TeamDashboard() {
  const params = useParams();
  const teamParam = (params?.team as string)?.toLowerCase() || "b2b";
  const teamColor = teamColorMap[teamParam] || "var(--igv-color)";
  const [remoteTeamData, setRemoteTeamData] = useState<TeamData | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastLiveFetchAt, setLastLiveFetchAt] = useState<Date | null>(null);
  const [hoveredBar, setHoveredBar] = useState<{ chart: number; bar: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWrapped, setShowWrapped] = useState(false);
  const [activeB2BRow, setActiveB2BRow] = useState<string | null>(null);
  const selectedPeriod: "marathon" = "marathon";
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      setRemoteTeamData(null);
      setDataError("Missing NEXT_PUBLIC_API_BASE_URL");
      return () => controller.abort();
    }

    const loadTeamData = async () => {
      try {
        setDataError(null);
        const response = await fetch(`${baseUrl}/api/dashboard/${teamParam}?period=${selectedPeriod}`, {
          signal: controller.signal,
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(`Backend request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as DashboardApiResponse;
        if (payload.ok && payload.data) {
          setRemoteTeamData(payload.data);
          setLastLiveFetchAt(new Date());
          return;
        }

        throw new Error("Backend returned an invalid dashboard payload");
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Failed to load backend dashboard";
        setDataError(message);
        setRemoteTeamData(null);
      }
    };

    void loadTeamData();

    // Setup Supabase REALTIME listener
    const channel = supabase
      .channel(`dashboard_${teamParam}_${selectedPeriod}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT/UPDATE/DELETE
          schema: 'public',
          table: 'dashboard_cache',
          filter: `id=eq.${teamParam}_${selectedPeriod}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          if (payload.new && (payload.new as any).payload) {
            setRemoteTeamData((payload.new as any).payload as TeamData);
            setLastLiveFetchAt(new Date());
            setDataError(null);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to realtime updates for ${teamParam}_${selectedPeriod}`);
        }
      });

    // Setup Periodic Polling as a fallback to Realtime
    const refreshInterval = LIVE_REFRESH_MS;
    const refreshTimer = window.setInterval(() => {
      console.log("⏰ 10-minute scheduled refresh triggered...");
      void loadTeamData();
    }, refreshInterval);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(refreshTimer);
      controller.abort();
    };
  }, [teamParam, selectedPeriod]);

  const fallbackTeamData =
    teamParam === "igv_b2b"
      ? { name: "IGV", displayName: "Incoming Global Volunteer - B2B", totalPoints: 0, totalGrowth: 0, completedActions: 0, weeklyGrowth: 0, miniTeams: [] }
      : (teamDataMap[teamParam] || teamDataMap.igv_b2b || { name: "Team", displayName: "Team Dashboard", totalPoints: 0, totalGrowth: 0, completedActions: 0, weeklyGrowth: 0, miniTeams: [] });

  const teamData = remoteTeamData || fallbackTeamData;

  const leaderTeam = teamData.miniTeams?.[0] || { name: "No Data", performers: [], points: 0 };
  const secondTeam = teamData.miniTeams?.[1] || { name: "No Data", performers: [], points: 0 };

  const leaderboardRows = (teamData.miniTeams || [])
    .flatMap((mt) => (mt.performers || []).map((p) => ({ 
      ...p, 
      team: mt.name
    })))
    .filter((p, index, self) => 
      index === self.findIndex((t) => t.email === p.email)
    )
    .sort((a, b) => b.score - a.score)
    .map((p, i) => {
      return { ...p, rank: i + 1 };
    });

  const isB2B = teamParam === 'igv_b2b';
  const isIGTB2B = teamParam === 'igt_b2b';
  const isOGT = teamParam === 'ogt';
  const isIGV = teamParam === 'igv_b2b' || teamParam === 'igv_ir';
  const isMST = teamParam === 'marcom' || teamParam === 'members' || teamParam === 'tls' || teamParam.startsWith('irm');
  const useMSTPalette = true;
  const accentColor = teamColor;


  const isSeparatedTeam = isB2B || isOGT || isIGTB2B;
  const b2bTLRows = isSeparatedTeam
    ? leaderboardRows
        .filter((row) => isTLRole(row.role || ""))
        .map((row, index) => ({ ...row, rank: index + 1 }))
    : [];

  const b2bMemberRows = isSeparatedTeam
    ? leaderboardRows
        .filter((row) => !isTLRole(row.role || ""))
        .map((row, index) => ({ ...row, rank: index + 1 }))
    : [];

  const podiumRows = isSeparatedTeam ? b2bMemberRows : leaderboardRows;
  const podiumVisualOrder = [podiumRows[1], podiumRows[0], podiumRows[2]].filter(Boolean);

  const filterRows = (rows: any[]) => 
    rows.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredB2BTLRows = filterRows(b2bTLRows);
  const filteredB2BMemberRows = filterRows(b2bMemberRows);
  const filteredLeaderboardRows = filterRows(leaderboardRows);

  const b2bActivityTotals = leaderboardRows.reduce(
    (acc, row) => {
      acc.mous += row.metrics?.mous || 0;
      acc.coldCalls += row.metrics?.coldCalls || 0;
      acc.followups += row.metrics?.followups || 0;
      return acc;
    },
    { mous: 0, coldCalls: 0, followups: 0 }
  );

  const ogtActivityTotals = leaderboardRows.reduce(
    (acc, row) => {
      acc.su += row.metrics?.mous || 0;
      acc.apl += row.metrics?.coldCalls || 0;
      acc.apd += row.metrics?.followups || 0;
      return acc;
    },
    { su: 0, apl: 0, apd: 0 }
  );

  // Stats for Wrapped
  const bestMember = leaderboardRows.find(p => !isTLRole(p.role || "")) || null;
  const bestTL = leaderboardRows.find(p => isTLRole(p.role || "")) || null;
  const topTeam = teamData.miniTeams?.[0] || { name: "The Squad", points: 0 };

  const wrappedStats = {
    topTeam: { name: topTeam.name, points: topTeam.points },
    globalMvp: bestMember,
    teamAce: bestTL,
    currentTeamName: teamData.name
  };

  const marathonEndMs = (teamParam === 'igt_b2b') 
    ? new Date("2026-04-30T23:59:59").getTime() 
    : new Date("2026-04-18T23:59:59").getTime();
  const diffMs = Math.max(0, marathonEndMs - nowMs);
  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;
  const daysRemaining = Math.max(0, Math.ceil(diffMs / dayMs));
  const daysPart = Math.floor(diffMs / dayMs);
  const hoursPart = Math.floor((diffMs % dayMs) / hourMs);
  const minutesPart = Math.floor((diffMs % hourMs) / minuteMs);
  const secondsPart = Math.floor((diffMs % minuteMs) / 1000);
  const countdownLabel = diffMs > 0
    ? `Ends in ${daysPart}d ${hoursPart.toString().padStart(2, "0")}:${minutesPart.toString().padStart(2, "0")}:${secondsPart.toString().padStart(2, "0")}`
    : "Ended";

  const chartDefs = [
    /* {
      title: "Growth Trend",
      subtitle: "Weekly Accumulation",
      type: "line",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      series: [
        { name: leaderTeam.name || "Team 1", data: [40, 55, 48, 62, 70, 58, 80], color: (teamParam === 'igv_b2b' || teamParam === 'igv_ir') ? '#5c6b77' : "#FF1744" }, 
        { name: secondTeam.name || "Team 2", data: [20, 35, 45, 30, 50, 60, 68], color: teamColor }, // Dynamic Team Color
      ],
    }, */
    {
      title: isMST ? "Total Member Points" : isIGTB2B ? "IGT B2B Activity Totals" : isOGT ? "OGT Activity Totals" : isB2B ? "B2B Activity Totals" : "Member Activity Breakdown",
      subtitle: isMST ? "Points Accumulation" : isIGTB2B ? "Cumulative Meetings | Cold Calls | Follow Ups" : isOGT ? "Cumulative SU | APL | APD" : isB2B ? "Cumulative MOUs | Cold Calls | Followups" : "MOU | CALLS | FOLLOWS",
      type: "stacked-bar",
      entries: isMST
        ? leaderboardRows
            .filter((p) => p.score > 0)
            .slice(0, 1000)
            .map((p) => ({
              email: p.email,
              label: p.name,
              values: [p.score]
            }))
        : isIGTB2B
          ? leaderboardRows
              .filter((p) => (p.metrics?.mous || 0) + (p.metrics?.coldCalls || 0) + (p.metrics?.followups || 0) > 0)
              .slice(0, 50)
              .map((p) => ({
                email: p.email,
                label: p.name,
                values: [
                  p.metrics?.mous || 0, // Meetings
                  p.metrics?.coldCalls || 0,
                  p.metrics?.followups || 0
                ]
              }))
        : isOGT
          ? leaderboardRows
              .filter((p) => (p.metrics?.mous || 0) + (p.metrics?.coldCalls || 0) + (p.metrics?.followups || 0) > 0)
              .slice(0, 50)
              .map((p) => ({
                email: p.email,
                label: p.name,
                values: [
                  p.metrics?.mous || 0, // SU
                  p.metrics?.coldCalls || 0, // APL
                  p.metrics?.followups || 0  // APD
                ]
              }))
        : isB2B
          ? [
              {
                email: "b2b-mous",
                label: "MOUs",
                values: [b2bActivityTotals.mous, 0, 0]
              },
              {
                email: "b2b-cold-calls",
                label: "Cold Calls",
                values: [0, b2bActivityTotals.coldCalls, 0]
              },
              {
                email: "b2b-followups",
                label: "Followups",
                values: [0, 0, b2bActivityTotals.followups]
              }
            ]
            : isIGTB2B
              ? [
                  {
                    email: "igt-meetings",
                    label: "Meetings",
                    values: [ogtActivityTotals.su, 0, 0]
                  },
                  {
                    email: "igt-cold",
                    label: "Cold Calls",
                    values: [0, ogtActivityTotals.apl, 0]
                  },
                  {
                    email: "igt-follow",
                    label: "Follow Ups",
                    values: [0, 0, ogtActivityTotals.apd]
                  }
                ]
            : isOGT
              ? [
                  {
                    email: "ogt-su",
                    label: "SU",
                    values: [ogtActivityTotals.su, 0, 0]
                  },
                  {
                    email: "ogt-apl",
                    label: "APL",
                    values: [0, ogtActivityTotals.apl, 0]
                  },
                  {
                    email: "ogt-apd",
                    label: "APD",
                    values: [0, 0, ogtActivityTotals.apd]
                  }
                ]
            : (leaderTeam.performers || []).slice(0, 10).map((p) => ({
              email: p.email,
              label: p.name,
              values: [p.metrics?.mous || 0, p.metrics?.coldCalls || 0, p.metrics?.followups || 0]
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

  const getFunctionName = (param: string) => {
    if (param.startsWith('igv')) return 'IGV';
    if (param.startsWith('igt')) return 'IGT';
    if (param.startsWith('ogt')) return 'OGT';
    if (param === 'marcom' || param === 'members' || param === 'tls' || param.startsWith('irm')) return 'MST';
    return teamData.name || 'TEAM';
  };

  const dashboardFunctionName = getFunctionName(teamParam);
  const isFinished = teamParam === 'members' || teamParam === 'tls' || teamParam === 'igv_b2b' || teamParam === 'ogt' || teamParam === 'igt_b2b';
  const showUnlinked = !teamData && !remoteTeamData;

  return (
    <div 
      className="min-h-screen bg-transparent relative"
      style={{ 
        backgroundImage: useMSTPalette
          ? `linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(15, 15, 15, 0.8), rgba(0, 0, 0, 0.9))`
          : `linear-gradient(to bottom right, rgba(25, 34, 48, 0.7), color-mix(in srgb, ${teamColor}, black 90%), rgba(25, 34, 48, 0.7))` 
      }}
    >
      {(isIGV || isMST) && <PawPrints />}
      <style>{glimmerAnimation}</style>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <CompetitiveLoader key="loader" dataReady={!!remoteTeamData} teamColor={teamColor} onFinish={() => setIsLoading(false)} />
        ) : !isFinished ? (
          <ConstructionOverlay key="construction" teamColor={teamColor} />
        ) : showUnlinked ? (
          <UnlinkedState key="unlinked" functionName={teamParam} teamColor={teamColor} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
        <nav className={`sticky top-0 z-40 border-b border-white/5 ${useMSTPalette ? 'bg-black/80' : 'bg-[#192230]/80'} backdrop-blur-md`}>
          <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between gap-2 px-3 py-3 sm:gap-0 sm:px-8 sm:py-6">
            <div className="flex items-center gap-2 sm:gap-6">
              <img src="/logo.png" alt="Xcend" className="h-10 w-10 sm:h-22 sm:w-22 object-contain drop-shadow-[0_0_10px_rgba(255,205,0,0.2)]" />
              <div>
                <h1 className="text-base sm:text-2xl font-black tracking-tight text-[#F7F7F8] capitalize">
                  {teamParam === 'igv_b2b' ? 'B2B' : teamParam.replace(/_/g, ' ')} <span className="opacity-40">Dashboard</span>
                </h1>
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-0.5 sm:mt-1">
                  Summer 26.27
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
               {/* Removed Live Badge as per request */}
               {dataError ? (
                <span className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-amber-200 sm:px-3 sm:text-[10px]">
                  Fallback mode
                </span>
              ) : null}
              <button
                onClick={() => setShowWrapped(true)}
                className="md:hidden group flex items-center gap-1.5 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-tight rounded-full text-white transition-all hover:scale-105 active:scale-95 shadow-lg sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-widest"
                style={{ background: `linear-gradient(to right, #FF1744, ${teamColor})` }}
              >
                <span className="group-hover:rotate-12 transition-transform text-[10px] sm:text-base">🏆</span>
                <span>Recap</span>
              </button>
              <Link
                href="/"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-tight rounded-full glass border border-white/10 hover:bg-white/5 transition-all sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-widest"
              >
                <span className="opacity-40 group-hover:-translate-x-1 transition-transform">←</span>
                <span className="hidden xs:inline">Exit Dashboard</span>
                <span className="xs:hidden">Exit</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto w-[94%] sm:w-[92%] space-y-8 sm:space-y-12 py-8 sm:py-16 lg:w-[80%]">
          <header className={`relative pt-12 pb-16 sm:py-20 text-center rounded-[2.5rem] sm:rounded-[4rem] ${useMSTPalette ? 'bg-black/60 border-white/10' : 'glass-premium border-white/5'} px-6 sm:px-12 flex flex-col items-center justify-center shadow-2xl`}>
            {/* Background Gradient */}
            <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden pointer-events-none">
              <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)` }} />
              <div className="absolute inset-0 opacity-[0.05]" style={{ background: `radial-gradient(circle at 20% 20%, #ffcd00, transparent 40%)` }} />
            </div>
            
            <div className="relative z-10 text-center flex-1 w-full max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[#F7F7F8] mb-8 sm:mb-12 leading-tight uppercase">
                THE <span style={{ color: accentColor }}>{dashboardFunctionName}</span> MARATHON
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-20">
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white">{teamData.totalPoints.toLocaleString()}</span>
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mt-2">Total Team XP</span>
                </div>
                {/* <div className="flex flex-col items-center text-center">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--level-up)]">+{teamData.weeklyGrowth}%</span>
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mt-2">Weekly Surge</span>
                </div> */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--xp-gold)]">{daysRemaining}</span>
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mt-2">Days Left</span>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffcd00]/85 mt-1">{countdownLabel}</span>
                </div>
              </div>
            </div>

            {/* Mascot positioned on the right, overflowing bottom */}
            <motion.div 
              initial={{ x: 50, y: 0, opacity: 0 }}
              animate={{ x: 0, y: [0, -12, 0], opacity: 1 }}
              transition={{ 
                x: { duration: 1, delay: 0.3, ease: "easeOut" },
                opacity: { duration: 1, delay: 0.3 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.3 } 
              }}
              className="absolute z-20 w-28 sm:w-48 lg:w-[520px] right-2 md:right-8 lg:-right-34 -bottom-4 sm:-bottom-8 lg:-bottom-44 pointer-events-none hidden sm:block"
            >
              <img 
                src="/mascot/laptop.png" 
                alt="Team Mascot" 
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-radial from-[var(--xp-gold)] to-transparent blur-3xl -z-10"
              />
            </motion.div>
          </header>

          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className={`relative rounded-[3rem] border border-white/5 ${useMSTPalette ? 'bg-black/40' : 'bg-white/[0.02] glass-premium'} p-8 sm:p-12 shadow-2xl shadow-black/50 overflow-hidden`}
          >
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)` }}
            />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 80%, #ffcd00, transparent 50%)` }} />
            
            <div className="relative z-10 mb-10 sm:mb-16 flex flex-col items-center">
              <h3 className="text-2xl sm:text-3xl font-black text-[#F7F7F8] tracking-widest uppercase">The Podium</h3>
              {(isB2B || isIGTB2B) && (
                <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white/55 text-center">
                  Podium ranking considers only member performance.
                </p>
              )}
            </div>

            <div className="relative z-10 mx-auto flex h-[300px] sm:h-96 max-w-4xl items-end justify-center gap-2 sm:gap-12">
              {podiumVisualOrder.map((performer, index) => {
                const isChampion = index === 1;
                const podHeight = index === 0 ? '140 sm:180' : index === 1 ? '200 sm:260' : '100 sm:140';
                return (
                  <div key={performer.email} className={`group flex flex-col items-center ${isChampion ? "w-[40%] sm:w-[38%]" : "w-[28%] sm:w-[31%]"}`}>
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
                        className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-xl border border-white/30 flex items-center justify-center text-xl font-black shadow-2xl"
                        style={{ backgroundColor: `color-mix(in srgb, ${teamColor}, black ${useMSTPalette ? '85%' : teamParam === 'igv_b2b' ? '60%' : '70%'})`, color: isChampion ? '#FFD700' : index === 0 ? '#E0E0E0' : '#CD7F32' }}
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
            <div 
              className={`relative rounded-[2.5rem] sm:rounded-[4.5rem] border border-white/5 ${useMSTPalette ? 'bg-black/95' : 'glass-premium'} shadow-xl shadow-black/30 overflow-visible px-2 sm:px-6 py-6 sm:py-10`}
            >
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)` }}
              />
              
              {/* Search Bar - Positioned at top of table section */}
              <div className="relative z-10 mb-8 mx-auto max-w-xl px-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-white/30 text-lg group-focus-within:text-[#ffcd00] transition-colors">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#ffcd00]/40 focus:border-[#ffcd00]/40 transition-all backdrop-blur-xl"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="relative z-10 space-y-3 sm:hidden">
                {(isSeparatedTeam
                  ? [
                      { title: "TLs", rows: filteredB2BTLRows },
                      { title: "Members", rows: filteredB2BMemberRows }
                    ]
                  : [{ title: "All", rows: filteredLeaderboardRows }]
                ).map((section) => (
                  <div key={`mobile-section-${section.title}`} className="space-y-3">
                    {isSeparatedTeam && (
                      <h5 className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-white/70">{section.title}</h5>
                    )}
                    {section.rows.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/60">
                        No records yet
                      </div>
                    ) : (
                      section.rows.map((row) => (
                          <div
                            key={`mobile-${section.title}-${row.email}`}
                            onClick={() => {
                              if (isSeparatedTeam) {
                                setActiveB2BRow(activeB2BRow === row.email ? null : row.email);
                              }
                            }}
                            className={`rounded-2xl border border-white/10 px-4 py-3 transition-all duration-300 ${isSeparatedTeam ? 'cursor-pointer' : ''} relative overflow-hidden`}
                            style={{ backgroundColor: activeB2BRow === row.email ? `color-mix(in srgb, ${accentColor}, transparent 80%)` : `color-mix(in srgb, ${accentColor}, transparent 92%)` }}
                          >
                            {(isB2B ? (row.rank <= 3) : (row.rank <= 3)) && <GlimmerOverlay />}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#F7F7F8]">{row.name}</p>
                              <p className="truncate text-[10px] uppercase tracking-wide text-white/45">{row.role}</p>
                            </div>
                            <span
                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold"
                              style={{
                                borderColor: row.rank <= 3 ? `${rankColors[row.rank as keyof typeof rankColors]}66` : `color-mix(in srgb, ${accentColor}, black 70%)`,
                                backgroundColor: row.rank <= 1 ? `${rankColors[1]}33` : row.rank === 2 ? `${rankColors[2]}33` : row.rank === 3 ? `${rankColors[3]}33` : `color-mix(in srgb, ${accentColor}, black 80%)`,
                                color: row.rank <= 3 ? rankColors[row.rank as keyof typeof rankColors] : `color-mix(in srgb, ${accentColor}, white 60%)`
                              }}
                            >
                              {row.rank}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="truncate pr-2 font-semibold text-[#F7F7F8]/75">{formatTeamName(row.team, isMST)}</span>
                            <span className="font-black tabular-nums text-[#F7F7F8]">{row.score.toLocaleString()}</span>
                          </div>
                          {isSeparatedTeam && activeB2BRow === row.email && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-[10px] font-semibold text-white/70"
                            >
                              {isB2B ? (
                                <>
                                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                    <div className="flex justify-between"><span>MOUs:</span> <span className="text-white">{row.metrics?.mous || 0}</span></div>
                                    <div className="flex justify-between"><span>Cold Calls:</span> <span className="text-white">{row.metrics?.coldCalls || 0}</span></div>
                                    <div className="flex justify-between"><span>Follow Ups:</span> <span className="text-white">{row.metrics?.followups || 0}</span></div>
                                  </div>
                                </>
                              ) : isIGTB2B ? (
                                <>
                                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                    <div className="flex justify-between"><span>Cold Calls:</span> <span className="text-white">{row.metrics?.coldCalls || 0}</span></div>
                                    <div className="flex justify-between"><span>Follow Ups:</span> <span className="text-white">{row.metrics?.followups || 0}</span></div>
                                    <div className="flex justify-between"><span>Proposals:</span> <span className="text-white">{row.metrics?.igt_proposals || 0}</span></div>
                                    <div className="flex justify-between"><span>Scheduled:</span> <span className="text-white">{row.metrics?.igt_meetings || 0}</span></div>
                                    <div className="flex justify-between"><span>Leads Gen:</span> <span className="text-white">{row.metrics?.leads || 0}</span></div>
                                    <div className="flex justify-between"><span>Contracts:</span> <span className="text-white">{row.metrics?.igt_contracts || 0}</span></div>
                                    <div className="flex justify-between"><span>Training:</span> <span className="text-white">{row.metrics?.igt_training || 0}</span></div>
                                  </div>
                                </>
                              ) : isOGT ? (
                                <>
                                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                    <div className="flex justify-between"><span>SU:</span> <span className="text-white">{row.metrics?.mous || 0}</span></div>
                                    <div className="flex justify-between"><span>APD:</span> <span className="text-white">{row.metrics?.followups || 0}</span></div>
                                    <div className="flex justify-between"><span>APL:</span> <span className="text-white">{row.metrics?.coldCalls || 0}</span></div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>MOUs: <span className="text-white block mt-0.5 text-xs">{row.metrics?.mous || 0}</span></div>
                                  <div>Followups: <span className="text-white block mt-0.5 text-xs">{row.metrics?.followups || 0}</span></div>
                                  <div>Calls: <span className="text-white block mt-0.5 text-xs">{row.metrics?.coldCalls || 0}</span></div>
                                </>
                              )}
                            </motion.div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>

              <div className="relative z-10 hidden overflow-visible custom-scrollbar sm:block">
                <div className="min-w-[750px] space-y-6">
                  {(isSeparatedTeam
                    ? [
                        { title: "TLs", rows: filteredB2BTLRows },
                        { title: "Members", rows: filteredB2BMemberRows }
                      ]
                    : [{ title: "All", rows: filteredLeaderboardRows }]
                  ).map((section) => (
                    <div key={`desktop-section-${section.title}`} className="space-y-4">
                      {isSeparatedTeam && (
                        <h5 className="px-1 text-sm font-black uppercase tracking-[0.2em] text-white/75">{section.title}</h5>
                      )}

                      {isSeparatedTeam ? (
                        <div 
                          className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#F7F7F8]/65 rounded-2xl shadow-lg"
                          style={{ backgroundColor: `rgba(255, 205, 0, 0.08)` }}
                        >
                          <div className="col-span-4 lowercase first-letter:uppercase">Member Name</div>
                          <div className="col-span-4 lowercase first-letter:uppercase text-center">Team Name</div>
                          <div className="col-span-3 text-right lowercase first-letter:uppercase">Total Points</div>
                          <div className="col-span-1 text-right lowercase first-letter:uppercase">Rank</div>
                        </div>
                      ) : (
                        <div 
                          className="grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#F7F7F8]/65 rounded-2xl shadow-lg"
                          style={{ backgroundColor: 'rgba(255, 205, 0, 0.08)' }}
                        >
                          <div className="col-span-4">Performer</div>
                          <div className="col-span-3">Team</div>
                          <div className="col-span-4 text-right">Points</div>
                          <div className="col-span-1 text-right">Rank</div>
                        </div>
                      )}

                      <div className="divide-y" style={{ borderTopColor: `color-mix(in srgb, ${accentColor}, transparent 80%)` }}>
                        {section.rows.length === 0 ? (
                          <div className="px-4 sm:px-6 py-4 text-sm font-semibold text-white/60">No records yet</div>
                        ) : (
                          section.rows.map((row) => (
                            <div 
                              key={`${section.title}-${row.email}`}
                              onClick={() => {
                                if (isB2B || isOGT || isIGTB2B) {
                                  setActiveB2BRow(activeB2BRow === row.email ? null : row.email);
                                }
                              }}
                              className="group/row relative z-0 grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center transition-colors hover:bg-[var(--hover-bg)] cursor-pointer hover:z-50"
                              style={{ '--hover-bg': `color-mix(in srgb, ${accentColor}, transparent 95%)` } as any}
                            >
                              {(isB2B || isOGT || isIGTB2B ? (row.rank <= 3) : (row.rank <= 3)) && <GlimmerOverlay />}

                              {isB2B || isOGT || isIGTB2B ? (
                                <>
                                  <div className="col-span-4 relative z-10">
                                    <p className="font-semibold text-sm sm:text-base text-[#F7F7F8] truncate">{row.name}</p>
                                    <p className="text-[10px] sm:text-xs text-white/45 truncate" style={{ color: `color-mix(in srgb, ${accentColor}, white 60%)` }}>{row.role}</p>
                                  </div>
                                  <div className="col-span-4 relative z-10 text-sm font-medium text-[#F7F7F8]/80 truncate text-center">
                                    {row.team}
                                  </div>
                                  <div className="col-span-3 relative z-10 text-right text-xs sm:text-base font-black tabular-nums text-[#F7F7F8]">{row.score.toLocaleString()}</div>
                                  
                                  {/* Hover/Tap Card for Metrics - Centered on Row with Ultra-Smooth Transition */}
                                  <div 
                                    className={`absolute left-1/2 -top-56 z-[200] w-64 -translate-x-1/2 rounded-3xl border border-white/20 bg-black/95 p-5 shadow-[0_32px_64px_rgba(0,0,0,0.9)] backdrop-blur-3xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] 
                                      ${activeB2BRow === row.email 
                                        ? 'opacity-100 scale-100 pointer-events-auto visible' 
                                        : 'opacity-0 scale-95 pointer-events-none invisible group-hover/row:opacity-100 group-hover/row:scale-100 group-hover/row:pointer-events-auto group-hover/row:visible'}`}
                                  >
                                    <div className="flex w-full flex-col gap-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{isIGTB2B ? "IGT B2B Performance" : isOGT ? "OGT Performance" : "Squad Stats"}</span>
                                          <span className="text-[9px] font-black uppercase tracking-widest text-[#ffcd00]/80">{row.name.split(' ')[0]}</span>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner">
                                          <span className="text-sm font-black text-[#ffcd00]">#{row.rank}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                                      
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px]">
                                        {isOGT ? (
                                          <>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">SU</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.mous || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">APD</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.followups || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">APL</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.coldCalls || 0}</span>
                                            </div>
                                          </>
                                        ) : isB2B ? (
                                          <>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">MOUs</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.mous || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Cold Calls</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.coldCalls || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Follow Ups</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.followups || 0}</span>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Cold Calls</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.coldCalls || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Follow Ups</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.followups || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Proposals</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.igt_proposals || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Scheduled</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.igt_meetings || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Leads Gen</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.leads || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Contracts</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.igt_contracts || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5 min-w-0">
                                              <span className="text-white/30 uppercase tracking-tighter truncate mr-2">Training</span>
                                              <span className="font-black text-white shrink-0">{row.metrics?.igt_training || 0}</span>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {/* Arrow pointing down */}
                                    <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/20 bg-black/95" />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="col-span-4 relative z-10">
                                    <p className="font-semibold text-sm sm:text-base text-[#F7F7F8] truncate">{row.name}</p>
                                    <p className="text-[10px] sm:text-xs text-white/45 truncate" style={{ color: `color-mix(in srgb, ${accentColor}, white 60%)` }}>{row.role}</p>
                                  </div>
                                  <div className="col-span-3 relative z-10 text-sm font-medium text-[#F7F7F8]/80 truncate">
                                    {formatTeamName(row.team, isMST)}
                                  </div>
                                  <div className="col-span-4 relative z-10 text-right text-xs sm:text-sm font-bold tabular-nums text-[#F7F7F8]">
                                    {row.score.toLocaleString()}
                                  </div>
                                </>
                              )}

                              <div className="col-span-1 relative z-10 flex justify-end">
                                <span 
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all"
                                  style={{ 
                                    borderColor: row.rank <= 3 ? `${rankColors[row.rank as keyof typeof rankColors]}66` : `color-mix(in srgb, ${accentColor}, black 70%)`,
                                    backgroundColor: row.rank <= 1 ? `${rankColors[1]}33` : row.rank === 2 ? `${rankColors[2]}33` : row.rank === 3 ? `${rankColors[3]}33` : `color-mix(in srgb, ${accentColor}, black 80%)`,
                                    color: row.rank <= 3 ? rankColors[row.rank as keyof typeof rankColors] : `color-mix(in srgb, ${accentColor}, white 60%)`
                                  }}
                                >
                                  {row.rank}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
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
            <div 
              className={`relative rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/5 ${useMSTPalette ? 'bg-black/90' : 'glass-premium'} p-6 sm:p-10 shadow-2xl overflow-hidden`}
            >
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                  <h4 className="text-xl sm:text-2xl font-black text-[#F7F7F8] tracking-widest uppercase italic">Squad Performance Matchups</h4>
                  <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Total Active Squads: {teamData.miniTeams?.length || 0}</p>
                </div>
                <div className={`grid grid-cols-1 gap-4 sm:gap-6 ${isIGTB2B ? 'md:grid-cols-3' : isB2B ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {teamData.miniTeams?.map((team, index) => (
                    <MiniTeamCard 
                      key={team.slug || team.name}
                      team={team} 
                      isLeader={index === 0} 
                      teamColor={accentColor}
                      isOGT={isOGT}
                      isMST={isMST}
                      isIGTB2B={isIGTB2B}
                    />
                  ))}
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
            <div className="grid grid-cols-1 gap-8 items-start">
              <div className="w-full">
                {chartDefs.filter(c => c.type === "stacked-bar").map((chart) => (
                  <div 
                    key={chart.title} 
                    className={`relative rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 ${useMSTPalette ? 'bg-black/90' : 'glass-premium shadow-xl shadow-black/20'} p-6 sm:p-8 h-full overflow-hidden`}
                  >
                    <div 
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 100% 0%, ${teamColor}, transparent 80%)` }}
                    />
                    <div className="relative z-10">
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: `color-mix(in srgb, ${teamColor}, white 40%)` }}>{chart.subtitle}</p>
                      <h4 className="mt-1 text-base sm:text-lg font-bold text-[#F7F7F8]">{chart.title}</h4>
                      <div className="mt-8 space-y-8">
                        {chart.entries?.map((entry: { label: string; values: number[]; email: string }) => {
                          const total = entry.values.reduce((a: number, b: number) => a + b, 0);
                          const maxRowTotal = Math.max(...(chart.entries || []).map((e: { values: number[] }) => e.values.reduce((a: number, b: number) => a + b, 0)));
                          return (
                            <div key={entry.email || entry.label} className="group/row">
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: teamColor }} />
                                  <p className="max-w-[140px] truncate text-xs sm:max-w-none sm:text-sm font-bold text-[#F7F7F8]">{entry.label}</p>
                                </div>
                                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide sm:tracking-widest" style={{ color: `color-mix(in srgb, ${teamColor}, white 40%)` }}>{total} total</p>
                              </div>
                              <div className="relative h-10 w-full">
                                <motion.div
                                  initial={{ width: 0, opacity: 0 }}
                                  whileInView={{ width: `${(total / (maxRowTotal || 1)) * 100}%`, opacity: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="flex h-full overflow-hidden rounded-xl"
                                  style={{ backgroundColor: `color-mix(in srgb, ${teamColor}, transparent 80%)`, border: `1px solid color-mix(in srgb, ${teamColor}, transparent 70%)` }}
                                >
                                  {entry.values.map((val: number, valIdx: number) => {
                                    const pct = (val / total) * 100;
                                    const colors = useMSTPalette ? [stackedChartSegmentColors[2], ...stackedChartSegmentColors] : stackedChartSegmentColors;
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
                                        {val > 2 && <span className="text-[10px] font-black text-[#192230] drop-shadow-sm">{val}</span>}
                                      </motion.div>
                                    );
                                  })}
                                </motion.div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div 
                        className={`mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-2xl border py-4 ${useMSTPalette ? 'bg-black/80' : 'glass-premium'}`}
                        style={{ borderColor: `color-mix(in srgb, ${teamColor}, transparent 80%)` }}
                      >
                        {isMST ? (
                          <div className="flex items-center gap-3">
                            <span className={`h-3 w-3 rounded-full ${stackedLegendDots[2]}`} />
                            <span className="text-[10px] font-bold text-[#F7F7F8]/65 uppercase tracking-widest">Total Points</span>
                          </div>
                        ) : (
                          ["MOUs", "Calls", "Follows"].map((l, i) => (
                             <div key={l} className="flex items-center gap-3">
                                <span className={`h-3 w-3 rounded-full ${stackedLegendDots[i]}`} />
                                <span className="text-[10px] font-bold text-[#F7F7F8]/65 uppercase tracking-widest">
                                  {isOGT 
                                    ? (i === 0 ? "SU" : i === 1 ? "APL" : "APD")
                                    : l
                                  }
                                </span>
                              </div>
                            ))
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          
        </main>
      </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showWrapped && (
          <WrappedExperience 
            onClose={() => setShowWrapped(false)} 
            stats={wrappedStats}
            teamColor={teamColor}
            teamParam={teamParam}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
