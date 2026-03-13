"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TeamData {
  name: string;
  displayName: string;
  miniTeams: {
    name: string;
    rank: number;
    points: number;
    growth: number;
    icon: string;
  }[];
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
      { name: "B2B Titans", rank: 1, points: 1320, growth: 180, icon: "🚀" },
      { name: "B2B Hunters", rank: 2, points: 1130, growth: 140, icon: "🎯" },
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
      { name: "IR Nexus", rank: 1, points: 1280, growth: 165, icon: "🌐" },
      { name: "IR Connectors", rank: 2, points: 1210, growth: 155, icon: "🔗" },
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
      { name: "Matching Pros", rank: 1, points: 1350, growth: 195, icon: "⚡" },
      { name: "Matching Core", rank: 2, points: 1100, growth: 130, icon: "💎" },
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
      { name: "Marcom Stars", rank: 1, points: 1290, growth: 170, icon: "⭐" },
      { name: "Marcom Wave", rank: 2, points: 1160, growth: 145, icon: "🌊" },
    ],
    totalPoints: 2450,
    totalGrowth: 315,
    completedActions: 94,
    weeklyGrowth: 330,
  },
};

const sidebarItems = [
  { label: "Overview", icon: "📊", active: true },
  { label: "Leaderboard", icon: "🏆" },
  { label: "Performance", icon: "📈" },
  { label: "Timeline", icon: "⏱️" },
  { label: "Recap", icon: "📝" },
  { label: "Flyer Generator", icon: "🎨" },
];

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

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: string;
}

function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <div className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-transparent p-6 backdrop-blur-md transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          {trend && <p className="mt-2 text-xs text-emerald-400/80 font-medium">{trend}</p>}
        </div>
        {icon && <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>}
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{
        background: `radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.1), transparent 50%)`,
      }} />
    </div>
  );
}

function MiniTeamCard({
  team,
  isLeader,
}: {
  team: { name: string; rank: number; points: number; growth: number; icon: string };
  isLeader: boolean;
}) {
  return (
    <div className={`group relative rounded-2xl border-2 p-8 transition-all duration-300 ${
      isLeader
        ? "border-yellow-400/50 shadow-xl shadow-yellow-500/20 bg-gradient-to-br from-yellow-500/15 via-orange-500/5 to-transparent"
        : "border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-transparent hover:border-purple-400/30"
    }`}>
      {/* Medal badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm ${
          isLeader
            ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-slate-900"
            : "bg-gradient-to-br from-slate-700 to-slate-600 text-slate-200"
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
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                  : "bg-gradient-to-r from-purple-400 to-blue-400"
              }`}
              style={{ width: `${(team.points / 1350) * 100}%` }}
            />
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const leaderTeam = teamData.miniTeams[0];
  const secondTeam = teamData.miniTeams[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-slate-800/50 bg-slate-950/80 backdrop-blur-md transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo / Branding */}
        <div className="flex items-center gap-3 border-b border-slate-800/50 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
            ⚡
          </div>
          <span className="font-bold text-white">Marathon</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4 py-6">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.active
                  ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800/50 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-4 py-4">
          <p className="text-xs text-slate-500 text-center">
            Real-time data | Updated 2 min ago
          </p>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="ml-0 lg:ml-64">
        {/* Top navbar */}
        <nav className="sticky top-0 z-20 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{teamData.name} Dashboard</h1>
                <p className="text-xs text-slate-400 mt-1">{teamData.displayName}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Team badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20">
                <span className="text-sm font-medium text-purple-300">{teamData.name}</span>
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
        <main className="p-6 lg:p-8">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Points"
              value={teamData.totalPoints.toLocaleString()}
              trend={`+${teamData.totalGrowth} this cycle`}
              icon="📊"
            />
            <StatCard
              label="Current Leader"
              value={leaderTeam.name}
              trend="Rank #1 currently"
              icon="👑"
            />
            <StatCard
              label="Completed Actions"
              value={teamData.completedActions}
              trend="Updated this cycle"
              icon="✅"
            />
            <StatCard
              label="Weekly Growth"
              value={`+${teamData.weeklyGrowth}`}
              trend="↑ Strong momentum"
              icon="📈"
            />
          </div>

          {/* Podium section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Team Rankings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MiniTeamCard team={leaderTeam} isLeader={true} />
              <MiniTeamCard team={secondTeam} isLeader={false} />
            </div>
          </div>

          {/* Quick insights cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickInsights.map((insight, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-transparent p-6 backdrop-blur-md"
                >
                  <p className="text-xs text-slate-400 font-medium mb-2">{insight.label}</p>
                  <p className="text-lg font-bold text-white">{insight.value}</p>
                  <p className="text-xs text-blue-400/80 font-semibold mt-2">{insight.growth}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team comparison snapshot */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Detailed Comparison</h2>
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-transparent backdrop-blur-md p-8">
              <div className="space-y-8">
                {/* Metric row */}
                {[
                  { label: "Outreach Completion", team1: 85, team2: 72 },
                  { label: "Task Completion Rate", team1: 92, team2: 88 },
                  { label: "Weekly Growth", team1: 180, team2: 140 },
                  { label: "Impact Score", team1: 94, team2: 81 },
                ].map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-300">{metric.label}</p>
                      <div className="flex gap-4">
                        <span className="text-sm font-semibold text-yellow-400">{metric.team1}%</span>
                        <span className="text-sm font-semibold text-purple-400">{metric.team2}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-3 rounded-full bg-slate-700/30 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          style={{ width: `${metric.team1}%` }}
                        />
                      </div>
                      <div className="h-3 rounded-full bg-slate-700/30 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                          style={{ width: `${metric.team2}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two column bottom section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity feed */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-transparent backdrop-blur-md">
                <div className="divide-y divide-slate-800/50">
                  {activityFeed.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/20 transition-colors"
                    >
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.event}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance preview */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Performance Trend</h2>
              <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-transparent backdrop-blur-md p-6">
                {/* Mini chart visualization */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Weekly Points Growth</p>
                    <div className="flex items-end gap-1 h-24">
                      {[45, 52, 58, 68, 72, 65, 80].map((height, index) => (
                        <div key={index} className="flex-1 group">
                          <div
                            className="w-full rounded-t bg-gradient-to-t from-purple-500 to-blue-400 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-200 cursor-pointer"
                            style={{ height: `${(height / 80) * 100}%` }}
                            title={`Day ${index + 1}: ${height} points`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">Average:</p>
                      <p className="text-sm font-bold text-white">64.3</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">Peak:</p>
                      <p className="text-sm font-bold text-emerald-400">+80</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">Trend:</p>
                      <p className="text-sm font-bold text-blue-400">↑ Upward</p>
                    </div>
                  </div>
                </div>

                {/* Mini team legend */}
                <div className="mt-6 pt-6 border-t border-slate-800/50 space-y-2">
                  <p className="text-xs text-slate-400 font-medium mb-3">Team Legend</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-4 rounded bg-gradient-to-r from-yellow-400 to-orange-400" />
                    <span className="text-xs text-slate-300">{leaderTeam.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-4 rounded bg-gradient-to-r from-purple-400 to-blue-400" />
                    <span className="text-xs text-slate-300">{secondTeam.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
