"use client";

import React, { useState, useMemo } from "react";

// ==========================================
// HIGH-DENSITY ENTERPRISE CORE TYPES
// ==========================================
interface TimecardRow {
  dateCode: string;
  clientAccount: string;
  regularHours: number;
  overtimeHours: number;
  shiftPremiumRate: number; 
  activityStatus: "Validated" | "Flagged" | "Archived";
}

interface ComprehensivePersonnelRecord {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  baseSalary: number;
  hourlyOvertimeRate: number;
  totalOvertimeHours: number;
  performanceScore: number;
  tierLevel: "Senior Exec" | "L3 Core" | "L2 Specialist" | "L1 Associate";
  department: string;
  bonusFormulaReason: string;
  timecards: TimecardRow[];
}

export default function DeepDetailEnterpriseEngine() {
  // Global Personnel Database with extensive micro-data layers
  const [personnelDb, setPersonnelDb] = useState<ComprehensivePersonnelRecord[]>([
    {
      id: "EMP-X881",
      name: "Alexander Wright",
      role: "Principal Financial Auditor",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      baseSalary: 6200,
      hourlyOvertimeRate: 75,
      totalOvertimeHours: 14,
      performanceScore: 4.95,
      tierLevel: "Senior Exec",
      department: "Risk Management & Assurance",
      bonusFormulaReason: "Exceeded Q2 Regulatory Compliance Metric (SLA > 99.8%) -> Triggered Core Modifier [18% Base Multiplier]",
      timecards: [
        { dateCode: "2026-07-01", clientAccount: "Goldman Sachs Core", regularHours: 8, overtimeHours: 4, shiftPremiumRate: 1.2, activityStatus: "Validated" },
        { dateCode: "2026-07-02", clientAccount: "Goldman Sachs Core", regularHours: 8, overtimeHours: 2, shiftPremiumRate: 1.2, activityStatus: "Validated" },
        { dateCode: "2026-07-03", clientAccount: "BlackRock Liquidity", regularHours: 8, overtimeHours: 0, shiftPremiumRate: 1.0, activityStatus: "Validated" },
        { dateCode: "2026-07-04", clientAccount: "BlackRock Liquidity", regularHours: 8, overtimeHours: 4, shiftPremiumRate: 1.5, activityStatus: "Validated" },
        { dateCode: "2026-07-05", clientAccount: "Vanguard Global Tech", regularHours: 6, overtimeHours: 4, shiftPremiumRate: 1.5, activityStatus: "Validated" },
      ]
    },
    {
      id: "EMP-X882",
      name: "Sarah Jenkins",
      role: "Senior Risk Strategy Lead",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      baseSalary: 5400,
      hourlyOvertimeRate: 65,
      totalOvertimeHours: 8,
      performanceScore: 4.82,
      tierLevel: "L3 Core",
      department: "Corporate Liquidity Stress Front",
      bonusFormulaReason: "Achieved Tier-1 Client Retention Threshold -> Triggered Regular Target Modifier [8% Base Multiplier]",
      timecards: [
        { dateCode: "2026-07-01", clientAccount: "BlackRock Liquidity", regularHours: 8, overtimeHours: 2, shiftPremiumRate: 1.1, activityStatus: "Validated" },
        { dateCode: "2026-07-02", clientAccount: "BlackRock Liquidity", regularHours: 8, overtimeHours: 2, shiftPremiumRate: 1.1, activityStatus: "Validated" },
        { dateCode: "2026-07-03", clientAccount: "Citadel High-Freq Asset", regularHours: 8, overtimeHours: 4, shiftPremiumRate: 1.4, activityStatus: "Validated" },
      ]
    },
    {
      id: "EMP-X883",
      name: "Marcus Vance",
      role: "Global Compliance Officer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      baseSalary: 4800,
      hourlyOvertimeRate: 55,
      totalOvertimeHours: 16,
      performanceScore: 4.41,
      tierLevel: "L2 Specialist",
      department: "Data Sovereignty Architecture",
      bonusFormulaReason: "Standard operations metrics met. Tier-2 rating threshold active [0% Base Multiplier]",
      timecards: [
        { dateCode: "2026-07-01", clientAccount: "Vanguard Global Tech", regularHours: 8, overtimeHours: 4, shiftPremiumRate: 1.0, activityStatus: "Validated" },
        { dateCode: "2026-07-02", clientAccount: "Vanguard Global Tech", regularHours: 8, overtimeHours: 4, shiftPremiumRate: 1.0, activityStatus: "Validated" },
        { dateCode: "2026-07-05", clientAccount: "Morgan Stanley Inst", regularHours: 8, overtimeHours: 8, shiftPremiumRate: 1.6, activityStatus: "Flagged" },
      ]
    },
    {
      id: "EMP-X884",
      name: "Elena Rostova",
      role: "Operations Infrastructure Director",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      baseSalary: 7900,
      hourlyOvertimeRate: 95,
      totalOvertimeHours: 4,
      performanceScore: 4.91,
      tierLevel: "Senior Exec",
      department: "Cross-Border System Integrity",
      bonusFormulaReason: "Architecture Overhaul executed without downtime -> Triggered High-Cap Modifier [18% Base Multiplier]",
      timecards: [
        { dateCode: "2026-07-02", clientAccount: "Morgan Stanley Inst", regularHours: 8, overtimeHours: 4, shiftPremiumRate: 1.3, activityStatus: "Validated" },
      ]
    }
  ]);

  // Selected state controls
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>("EMP-X881");
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");

  // Mathematical functions for variable engine logic
  const calcOvertimePayout = (hours: number, rate: number) => hours * rate;
  const calcBonusPayout = (score: number, base: number) => {
    if (score >= 4.9) return Math.round(base * 0.18);
    if (score >= 4.5) return Math.round(base * 0.08);
    return 0;
  };

  // Memoized filtered array list with Tier filter logic
  const filteredPersonnelList = useMemo(() => {
    return personnelDb.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === "ALL" || p.tierLevel === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [personnelDb, searchQuery, tierFilter]);

  // Extract currently active full-screen element data model
  const activeEngineTarget = useMemo(() => {
    return personnelDb.find(p => p.id === selectedPersonnelId) || personnelDb[0];
  }, [personnelDb, selectedPersonnelId]);

  // Aggregate totals for the active target
  const targetTotals = useMemo(() => {
    const base = activeEngineTarget.baseSalary;
    const ot = calcOvertimePayout(activeEngineTarget.totalOvertimeHours, activeEngineTarget.hourlyOvertimeRate);
    const bonus = calcBonusPayout(activeEngineTarget.performanceScore, base);
    return { gross: base + ot + bonus, overtime: ot, bonus };
  }, [activeEngineTarget]);

  // Global Pool Accumulation for Enterprise Dashboard Panels
  const globalPoolMetrics = useMemo(() => {
    let totalGrossOutflow = 0;
    let totalOTHours = 0;
    let totalFlaggedNodes = 0;

    personnelDb.forEach(person => {
      const base = person.baseSalary;
      const ot = calcOvertimePayout(person.totalOvertimeHours, person.hourlyOvertimeRate);
      const bonus = calcBonusPayout(person.performanceScore, base);
      totalGrossOutflow += (base + ot + bonus);
      totalOTHours += person.totalOvertimeHours;
      
      if (person.timecards.some(t => t.activityStatus === "Flagged")) {
        totalFlaggedNodes += 1;
      }
    });

    return { totalGrossOutflow, totalOTHours, totalFlaggedNodes };
  }, [personnelDb]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 antialiased font-sans tracking-tight [perspective:1200px]">
      
      {/* HEADER NODAL STRIP */}
      <header className="bg-slate-900 text-white p-5 shadow-xl border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-20">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse ring-4 ring-indigo-500/30" />
            <h1 className="text-lg font-black tracking-wider uppercase text-slate-100">Ledger Metrics Engine</h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">High-density architectural breakdown console for variable financial payouts and multi-account auditing.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search personnel profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-slate-800/80 focus:bg-slate-950 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700/60 focus:border-indigo-500 outline-hidden text-white placeholder:text-slate-500 transition-all duration-300 shadow-inner"
          />
        </div>
      </header>

      {/* MAIN CONTAINER LAYOUT */}
      <div className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COMPACT MANAGEMENT PANEL CLUSTER */}
        <div className="xl:col-span-1 space-y-4 flex flex-col">
          
          {/* COMPONENT 1: PERSONNEL REGISTRY BUTTON LIST */}
          <nav className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md space-y-3 transition-all duration-300 hover:shadow-lg">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Personnel Registry Nodes</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {filteredPersonnelList.length} Visible
              </span>
            </div>

            <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-0.5 scrollbar-thin transition-all duration-500">
              {filteredPersonnelList.map((person) => {
                const isSelected = person.id === selectedPersonnelId;
                const balanceHasFlag = person.timecards.some(t => t.activityStatus === "Flagged");
                return (
                  <button
                    key={person.id}
                    onClick={() => setSelectedPersonnelId(person.id)}
                    className={`w-full text-left p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-3 group relative transition-all duration-300 ease-out transform active:scale-98 ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-700 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] translate-x-1"
                        : "bg-slate-50/60 hover:bg-slate-100 border-slate-200/60 hover:border-slate-300 text-slate-700 hover:translate-x-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={person.avatarUrl} 
                        alt="" 
                        className={`w-7 h-7 rounded-lg object-cover shrink-0 border transition-all duration-300 ${
                          isSelected ? "border-indigo-400 ring-2 ring-indigo-300/30 scale-105" : "border-slate-300"
                        }`} 
                      />
                      <div className="min-w-0">
                        <span className={`block font-black text-[11px] truncate transition-colors duration-200 ${isSelected ? "text-white" : "text-slate-900 group-hover:text-indigo-600"}`}>
                          {person.name}
                        </span>
                        <span className={`block text-[10px] font-semibold truncate ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                          {person.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-center">
                      <span className={`block font-mono text-[10px] font-black transition-colors ${isSelected ? "text-amber-300" : "text-slate-800"}`}>
                        ★ {person.performanceScore.toFixed(2)}
                      </span>
                      {balanceHasFlag && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-500/30 animate-pulse mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
              {filteredPersonnelList.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic font-medium animate-fade-in">No registry parameters matched.</div>
              )}
            </div>
          </nav>

          {/* COMPONENT 2: BRAND NEW PREVIOUSLY VACANT SPACE - ADVANCED MATRIX FILTER PANEL */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md space-y-3 transition-all duration-300 hover:shadow-lg">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Advanced Matrix Filters</span>
            </div>
            
            {/* Tier filter buttons layout */}
            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-wide text-slate-500 uppercase block">Tier Classification</label>
              <div className="grid grid-cols-2 gap-1.5">
                {["ALL", "Senior Exec", "L3 Core", "L2 Specialist"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`py-1.5 px-2 text-[9px] font-black uppercase rounded-lg border transition-all duration-200 cursor-pointer text-center truncate ${
                      tierFilter === tier 
                        ? "bg-slate-900 text-white border-slate-950 shadow-xs scale-[1.02]" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {tier === "ALL" ? "⚙ Show All" : tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Engine Actions Panel */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[9px] font-black tracking-wide text-slate-500 uppercase block">Batch Commands</span>
              <button 
                onClick={() => alert("Simulated batch dispatch: All current filtered validated entries pushed to ledger system.")}
                className="w-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-[10px] font-black uppercase tracking-wider py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 group active:scale-98 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:animate-ping" />
                Batch Run Validated Nodes
              </button>
            </div>
          </div>

          {/* COMPONENT 3: GLOBAL POOL METRICS & EXCEPTION LIVE LOGS */}
          <section className="bg-slate-900 text-white border border-slate-950 rounded-2xl p-4 shadow-md space-y-4 transition-all duration-300 hover:shadow-xl">
            
            {/* Global Aggregates Segment */}
            <div className="space-y-2">
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Global Pool Ledger</span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-300 font-bold font-mono px-1.5 py-0.5 rounded border border-indigo-500/20">Sync Active</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-xl hover:border-indigo-500/40 transition-colors duration-300 group">
                  <span className="text-[9px] font-bold text-slate-500 block group-hover:text-indigo-400 transition-colors">Total Outflow</span>
                  <span className="font-mono font-black text-white text-[11px] group-hover:text-amber-300 transition-colors">${globalPoolMetrics.totalGrossOutflow.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-xl hover:border-indigo-500/40 transition-colors duration-300 group">
                  <span className="text-[9px] font-bold text-slate-500 block group-hover:text-indigo-400 transition-colors">Total OT Volume</span>
                  <span className="font-mono font-black text-indigo-400 text-[11px] group-hover:scale-105 transition-transform inline-block">{globalPoolMetrics.totalOTHours} Hrs</span>
                </div>
              </div>
            </div>

            {/* Dynamic Real-Time Flagged Alerts Monitor Log */}
            <div className="space-y-2 pt-1">
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Exception Alert Stream</span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tight transition-all duration-300 ${
                  globalPoolMetrics.totalFlaggedNodes > 0 ? "bg-rose-950 text-rose-400 border border-rose-900/40 animate-pulse" : "bg-emerald-950 text-emerald-400"
                }`}>
                  {globalPoolMetrics.totalFlaggedNodes} Flagged
                </span>
              </div>

              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-0.5 text-[10px] scrollbar-thin">
                {personnelDb.flatMap(p => 
                  p.timecards.filter(t => t.activityStatus === "Flagged").map((t, i) => (
                    <div 
                      key={`${p.id}-${i}`} 
                      onClick={() => setSelectedPersonnelId(p.id)}
                      className="bg-slate-950/50 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 p-2 rounded-xl text-rose-300 font-semibold cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col gap-0.5 group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-200 group-hover:text-white transition-colors truncate max-w-[110px]">{p.name}</span>
                        <span className="font-mono text-[9px] bg-rose-950 text-rose-400 px-1 rounded border border-rose-900/30">{t.dateCode}</span>
                      </div>
                      <span className="text-slate-500 group-hover:text-slate-400 transition-colors font-mono text-[9px] truncate">Account: {t.clientAccount}</span>
                    </div>
                  ))
                )}
                {globalPoolMetrics.totalFlaggedNodes === 0 && (
                  <div className="text-slate-500 text-center py-4 font-medium italic">
                    ✓ All transaction matrices clear of structural exceptions.
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>

        {/* RIGHT COLUMN LAYOUT: INTERACTIVE MAXIMUM DISPLAY MAINBOARD */}
        <main className="xl:col-span-3 bg-white border border-slate-200/90 rounded-2xl shadow-md overflow-hidden min-h-[770px] flex flex-col justify-between transition-all duration-500 hover:shadow-xl relative">
          
          {/* TOP PROFILE BANNER CONTAINER ROW */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 animate-pulse" />
            
            <div className="flex items-center gap-4 z-10 animate-fade-in">
              <img 
                src={activeEngineTarget.avatarUrl} 
                alt="" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl shrink-0 transition-transform duration-500 hover:rotate-3" 
              />
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">{activeEngineTarget.name}</h2>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md animate-bounce-slow">
                    {activeEngineTarget.tierLevel}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-300">{activeEngineTarget.role}</p>
                <p className="text-[10px] font-mono text-slate-500 font-bold tracking-wider uppercase mt-1">Org Module: {activeEngineTarget.department}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/80 p-3.5 rounded-xl text-right font-mono min-w-[160px] z-10 shadow-inner group">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Nodal Signature ID</span>
              <span className="text-xs text-indigo-400 font-black group-hover:text-indigo-300 transition-colors">{activeEngineTarget.id}</span>
              <div className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> SECURE CONSOLE
              </div>
            </div>
          </div>

          {/* MID LAYER CONTAINER: MATRICES CARD VALUES */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 border-b border-slate-100 bg-slate-50/50">
            
            {/* Base Allocation Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 group">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 group-hover:text-indigo-500 transition-colors">Contract Base Asset</span>
              <div className="text-2xl font-black text-slate-900 font-mono transition-transform duration-300 group-hover:scale-[1.01]">${activeEngineTarget.baseSalary.toLocaleString()}</div>
              <div className="border-t border-slate-100 mt-3 pt-2 text-[10px] text-slate-400 font-semibold flex justify-between">
                <span>Cycle Scale</span>
                <span className="text-slate-600 font-bold">Monthly Fixed Ledger</span>
              </div>
            </div>

            {/* Variable Overtime Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 group">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 group-hover:text-indigo-500 transition-colors">Accumulated Overtime Asset</span>
              <div className="text-2xl font-black text-slate-900 font-mono transition-transform duration-300 group-hover:scale-[1.01]">${targetTotals.overtime.toLocaleString()}</div>
              <div className="border-t border-slate-100 mt-3 pt-2 text-[10px] text-slate-400 font-semibold flex justify-between items-baseline">
                <span>Calculation Basis</span>
                <span className="text-indigo-600 font-mono font-black">{activeEngineTarget.totalOvertimeHours} hrs × ${activeEngineTarget.hourlyOvertimeRate}/hr</span>
              </div>
            </div>

            {/* Performance Modifier Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-100 group">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 group-hover:text-indigo-500 transition-colors">Performance Incentive Node</span>
              <div className="text-2xl font-black text-slate-900 font-mono transition-transform duration-300 group-hover:scale-[1.01]">${targetTotals.bonus.toLocaleString()}</div>
              <div className="border-t border-slate-100 mt-3 pt-2 text-[10px] text-slate-400 font-semibold flex justify-between items-baseline">
                <span>Metric Weight</span>
                <span className="text-amber-600 font-mono font-black">Score Matrix: {activeEngineTarget.performanceScore} / 5.00</span>
              </div>
            </div>

          </div>

          {/* TABLE MATRIX COMPONENT */}
          <div className="p-6 flex-1 transition-all duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Audit Trail: Timecard Activity Sheet</h3>
                <p className="text-[11px] text-slate-400 font-medium">Granular per-day transaction values verified by client corporate account managers.</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border px-2.5 py-1 rounded-md transition-all">
                Active Count: {activeEngineTarget.timecards.length} Cycles
              </span>
            </div>

            {/* HIGH-DENSITY TIMECARDS DATA TABLE DISPLAY SHEET */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-black text-slate-500 uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-4">Calendar Index</th>
                    <th className="py-3 px-4">Client Target Account</th>
                    <th className="py-3 px-4 text-center">Regular Hours Block</th>
                    <th className="py-3 px-4 text-center">Overtime Hours Block</th>
                    <th className="py-3 px-4 text-center">Premium Scale</th>
                    <th className="py-3 px-4 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium transition-all duration-300">
                  {activeEngineTarget.timecards.map((tc, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30 transition-colors duration-200 group">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{tc.dateCode}</td>
                      <td className="py-2.5 px-4 font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors">{tc.clientAccount}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600">{tc.regularHours} hrs</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600">
                        {tc.overtimeHours > 0 ? (
                          <span className="text-indigo-600 font-black">{tc.overtimeHours} hrs</span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500">× {tc.shiftPremiumRate.toFixed(1)}</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-md border shadow-2xs ${
                          tc.activityStatus === "Validated"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                        }`}>
                          {tc.activityStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SYSTEM FORMULA EXPLANATION CARD */}
            <div className="mt-4 bg-indigo-50/40 border border-indigo-100/70 p-4 rounded-xl transition-all duration-300 hover:bg-indigo-50/70">
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 block mb-1">System Logic Formula Trace</span>
              <p className="text-[11px] text-indigo-950 font-semibold leading-relaxed">
                {activeEngineTarget.bonusFormulaReason}
              </p>
            </div>
          </div>

          {/* LOWER OUTFLOW CONTROLLER & ENVELOPE SEAL STRIP */}
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-950 relative z-10">
            <div className="flex items-center gap-6 px-2">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Total Account Outflow</span>
                <span className="text-xl font-black font-mono text-amber-400 transition-all transform duration-300 hover:scale-105 inline-block">${targetTotals.gross.toLocaleString()}</span>
              </div>
              <div className="border-l border-slate-800 pl-6">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Security Sign Status</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block mt-0.5">✓ Ready for Cryptographic Signing</span>
              </div>
            </div>

            <button 
              onClick={() => alert(`Cryptographic ledger seal applied for Node: ${activeEngineTarget.id}`)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-md cursor-pointer transition-all duration-300 transform active:scale-95 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Seal Transaction Envelope
            </button>
          </div>

        </main>

      </div>
    </div>
  );
}