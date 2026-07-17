"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Building2,
  BrainCircuit,
  X,
  CheckCircle2,
  AlertTriangle,
  Activity
} from "lucide-react";

// Types Definitions
interface Branch {
  name: string;
  rating: string;
  reviews: string;
  sentiment: string;
  trend: string;
  manager: string;
  topIssue: string;
  aiRecommendation: string;
}

// Enterprise Chart Data Source
const telemetryChartData = [
  { time: "Mon", sentiment: 82, reviews: 240 },
  { time: "Tue", sentiment: 78, reviews: 310 },
  { time: "Wed", sentiment: 85, reviews: 450 },
  { time: "Thu", sentiment: 92, reviews: 590 },
  { time: "Fri", sentiment: 88, reviews: 480 },
  { time: "Sat", sentiment: 94, reviews: 620 },
  { time: "Sun", sentiment: 95, reviews: 710 },
];

// Rich Branch Master Data
const branchPerformance: Branch[] = [
  { 
    name: "Downtown Headquarters", 
    rating: "4.8", 
    reviews: "1,240", 
    sentiment: "Positive", 
    trend: "up",
    manager: "Sarah Jenkins",
    topIssue: "Peak hours wait time slightly increased (+2m)",
    aiRecommendation: "Deploy automated check-in kiosk sequence to offload front desk counter by 24%."
  },
  { 
    name: "Westside Retail Hub", 
    rating: "4.2", 
    reviews: "840", 
    sentiment: "Neutral", 
    trend: "down",
    manager: "Marcus Vance",
    topIssue: "Negative delivery feedback regarding packaging leakage on Friday",
    aiRecommendation: "Flag regional packaging vendor automatically and execute standard operational fallback protocol."
  },
  { 
    name: "Metro Express Branch", 
    rating: "4.6", 
    reviews: "910", 
    sentiment: "Positive", 
    trend: "up",
    manager: "Elena Rostova",
    topIssue: "High volume of 5-star mentions for excellent staff service metrics",
    aiRecommendation: "Synthesize team bonus incentive models to duplicate performance structures across active clusters."
  },
  { 
    name: "North Pier Logistics", 
    rating: "3.9", 
    reviews: "420", 
    sentiment: "Critical Risk", 
    trend: "down",
    manager: "David Kim",
    topIssue: "Critical staff shortage causing 1-star reviews on Google Maps platform",
    aiRecommendation: "Instantly trigger localized micro-ads for immediate hiring pipeline and override manual response buffers."
  },
];

export default function AnalyticsAndAITab() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. High-Fidelity Interactive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Brand Sentiment Index", val: "92.4", sub: "Weighted enterprise safety zone", change: "+2.4%", up: true },
          { title: "AI Auto-Interventions", val: "87.5%", sub: "Reviews managed without human lag", change: "+12.1%", up: true },
          { title: "Active Risk Alerts", val: "03", sub: "Requires instant tenant attention", change: "-1.2%", up: false, danger: true },
          { title: "Predictive Churn Safeguard", val: "99.1%", sub: "Lifetime protection confidence", change: "Stable", up: null }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="group bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{kpi.title}</p>
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className={`text-3xl font-extrabold tracking-tight ${kpi.danger ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                {kpi.val}
              </span>
              {kpi.change && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                  kpi.up === true ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" :
                  kpi.up === false ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" :
                  "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}>
                  {kpi.up === true && <ArrowUpRight className="w-3 h-3" />}
                  {kpi.up === false && <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 2. Charts & Real-time Log Stream Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Advanced Area Chart Engine */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sentiment Velocity Metrics</h3>
                <p className="text-[11px] text-slate-400">Real-time aggregate data processing pipeline</p>
              </div>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-3 py-1.5 rounded-lg transition-all border border-indigo-100/50 dark:border-indigo-900/30">
              <Download className="w-3.5 h-3.5" /> Export Data
            </button>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryChartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/70" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="sentiment" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#chartGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Autonomous AI Engine Core Terminal */}
        <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500"></div>
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase">AI Cognitive Engine</span>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">Live Logs</span>
            </div>

            <div className="space-y-3.5">
              <div className="text-[11px] p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-xl space-y-1 hover:border-slate-700/80 transition-all">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Auto-Mitigated Strategy
                </p>
                <p className="text-slate-400 leading-relaxed">Generated critical voucher response loop for negative feedback on North Pier branch instantly.</p>
              </div>

              <div className="text-[11px] p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-xl space-y-1 hover:border-slate-700/80 transition-all">
                <p className="font-bold text-indigo-400 flex items-center gap-1.5">● Pattern Anomaly Verified</p>
                <p className="text-slate-400 leading-relaxed">Downtown branch verified +45 positive review spikes safely inside compliance matrix limits.</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group">
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> 
            Configure Rule Triggers
          </button>
        </div>

      </div>

      {/* 3. Highly Animated Location Diagnostics Interactive Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Location Matrix Diagnostics</h3>
              <p className="text-[11px] text-slate-400">Click any row below to deploy deep autonomous telemetry diagnostics</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md flex items-center gap-1">
            <Activity className="w-3 h-3 text-indigo-500" /> Actionable Index
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3.5 pl-2 font-semibold">Branch Location</th>
                <th className="pb-3.5 font-semibold">Rating Index</th>
                <th className="pb-3.5 font-semibold">Captured Volume</th>
                <th className="pb-3.5 font-semibold">Health Vector</th>
                <th className="pb-3.5 text-right pr-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300 font-medium">
              {branchPerformance.map((branch, i) => (
                <tr 
                  key={i} 
                  onClick={() => setSelectedBranch(branch)}
                  className="group cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-all duration-200 rounded-xl"
                >
                  <td className="py-4 pl-2 font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                    <span>{branch.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-500 dark:text-indigo-400 font-normal transition-all translate-x-[-4px] group-hover:translate-x-0">
                      (Diagnose) →
                    </span>
                  </td>
                  <td className="py-4 font-mono font-semibold">{branch.rating} / 5.0</td>
                  <td className="py-4 text-slate-500 dark:text-slate-400">{branch.reviews} reviews</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide ${
                      branch.sentiment === "Positive" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" :
                      branch.sentiment === "Neutral" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400" :
                      "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                    }`}>
                      {branch.sentiment}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2">
                    {branch.trend === "up" ? (
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-400/5 px-2 py-1 rounded-md">▲ Improving</span>
                    ) : (
                      <span className="text-rose-500 dark:text-rose-400 font-bold bg-rose-500/5 dark:bg-rose-400/5 px-2 py-1 rounded-md">▼ Action Req.</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Interactive Slide-up Dashboard Overlay Panel (The Drawer) */}
      {selectedBranch && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-300"
          >
            {/* Header section inside panel */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{selectedBranch.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Branch Manager: {selectedBranch.manager}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBranch(null)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content matrix inside panel */}
            <div className="p-6 space-y-5 text-xs font-medium">
              
              {/* Quick stats indicators row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Current Health</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">{selectedBranch.rating} Rating Index</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Performance Trend</span>
                  <span className={`text-sm font-extrabold mt-1 block ${selectedBranch.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {selectedBranch.trend === 'up' ? '▲ Stable Ascent' : '▼ Risk Correction'}
                  </span>
                </div>
              </div>

              {/* Main vector issues detected */}
              <div className="space-y-1.5">
                <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" /> Detected Operational Friction
                </span>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-slate-700 dark:text-slate-300 rounded-xl leading-relaxed">
                  {selectedBranch.topIssue}
                </div>
              </div>

              {/* Cognitive core response action plan */}
              <div className="space-y-1.5 pt-1">
                <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-spin duration-1000" /> AI Autonomous Countermeasure
                </span>
                <div className="p-4 bg-indigo-600/5 border border-indigo-500/20 text-slate-800 dark:text-slate-200 rounded-xl leading-relaxed font-semibold">
                  {selectedBranch.aiRecommendation}
                </div>
              </div>

            </div>

            {/* Bottom action close deck */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex gap-2">
              <button 
                onClick={() => setSelectedBranch(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
              >
                Accept Optimization Strategy
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}