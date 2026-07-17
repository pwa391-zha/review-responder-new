"use client";

import React, { useState, useMemo } from "react";

// ==========================================
// HIGH-DENSITY WORKFORCE ALLOCATION TYPES
// ==========================================
type DayType = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

interface ShiftAllocationNode {
  dayOfWeek: DayType;
  assignedClient: string;
  shiftType: "Morning Front" | "Core Evening" | "Deep Night" | "Weekend Standby" | "Off-Day / Leave";
  scheduledHours: number;
  actualHours: number; // Added to bind with your actual live tracking data
  utilizationRate: number; 
  conflictFlag: boolean;
  conflictReason?: string;
}

interface HistoricalSnapshot {
  prevMonthTotalHours: number;
  completedNodesCount: number;
  slaComplianceRate: number; 
}

interface PredictiveForecast {
  estimatedMonthEndHours: number;
  projectedRevenueFactor: number; 
  burnoutRiskLevel: "Low Risk" | "Nominal" | "High Overload Warning";
}

interface WorkforcePersonnelRecord {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  primarySkillset: string;
  totalWeeklyHours: number;
  maxSlaCapacity: number; 
  allocationMatrix: ShiftAllocationNode[];
  history: HistoricalSnapshot;     
  forecast: PredictiveForecast;    
}

export default function InteractiveWorkforceAllocationEngine() {
  const [workforceDb, setWorkforceDb] = useState<WorkforcePersonnelRecord[]>([
    {
      id: "EMP-X881",
      name: "Alexander Wright",
      role: "Principal Financial Auditor",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      primarySkillset: "SOX Compliance, Risk Underwriting, Multi-Asset Auditing",
      totalWeeklyHours: 42,
      maxSlaCapacity: 40, 
      allocationMatrix: [
        { dayOfWeek: "Monday", assignedClient: "Goldman Sachs Core", shiftType: "Morning Front", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Tuesday", assignedClient: "Goldman Sachs Core", shiftType: "Morning Front", scheduledHours: 8, actualHours: 7.5, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Wednesday", assignedClient: "BlackRock Liquidity", shiftType: "Core Evening", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Thursday", assignedClient: "BlackRock Liquidity", shiftType: "Core Evening", scheduledHours: 8, actualHours: 0, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Friday", assignedClient: "Vanguard Global Tech", shiftType: "Deep Night", scheduledHours: 6, actualHours: 6, utilizationRate: 75, conflictFlag: false },
        { dayOfWeek: "Saturday", assignedClient: "Citadel High-Freq Asset", shiftType: "Weekend Standby", scheduledHours: 4, actualHours: 4, utilizationRate: 50, conflictFlag: true, conflictReason: "SLA Infringement: Weekend shift overlaps rest windows." },
        { dayOfWeek: "Sunday", assignedClient: "None / Off-Day", shiftType: "Off-Day / Leave", scheduledHours: 0, actualHours: 0, utilizationRate: 0, conflictFlag: false }
      ],
      history: { prevMonthTotalHours: 168, completedNodesCount: 22, slaComplianceRate: 97.5 },
      forecast: { estimatedMonthEndHours: 176, projectedRevenueFactor: 24500, burnoutRiskLevel: "High Overload Warning" }
    },
    {
      id: "EMP-X882",
      name: "Sarah Jenkins",
      role: "Senior Risk Strategy Lead",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      primarySkillset: "Liquidity Stress Front, Asset Liability Management",
      totalWeeklyHours: 32,
      maxSlaCapacity: 40,
      allocationMatrix: [
        { dayOfWeek: "Monday", assignedClient: "BlackRock Liquidity", shiftType: "Core Evening", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Tuesday", assignedClient: "BlackRock Liquidity", shiftType: "Core Evening", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Wednesday", assignedClient: "Citadel High-Freq Asset", shiftType: "Morning Front", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Thursday", assignedClient: "Citadel High-Freq Asset", shiftType: "Morning Front", scheduledHours: 8, actualHours: 0, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Friday", assignedClient: "None", shiftType: "Morning Front", scheduledHours: 0, actualHours: 0, utilizationRate: 0, conflictFlag: false },
        { dayOfWeek: "Saturday", assignedClient: "None", shiftType: "Morning Front", scheduledHours: 0, actualHours: 0, utilizationRate: 0, conflictFlag: false },
        { dayOfWeek: "Sunday", assignedClient: "None", shiftType: "Morning Front", scheduledHours: 0, actualHours: 0, utilizationRate: 0, conflictFlag: false }
      ],
      history: { prevMonthTotalHours: 140, completedNodesCount: 18, slaComplianceRate: 100 },
      forecast: { estimatedMonthEndHours: 128, projectedRevenueFactor: 19200, burnoutRiskLevel: "Low Risk" }
    },
    {
      id: "EMP-X883",
      name: "Marcus Vance",
      role: "Global Compliance Officer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      primarySkillset: "Data Sovereignty Encryption, Cross-Border Jurisdictions",
      totalWeeklyHours: 44,
      maxSlaCapacity: 40,
      allocationMatrix: [
        { dayOfWeek: "Monday", assignedClient: "Vanguard Global Tech", shiftType: "Morning Front", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Tuesday", assignedClient: "Vanguard Global Tech", shiftType: "Morning Front", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Wednesday", assignedClient: "Morgan Stanley Inst", shiftType: "Deep Night", scheduledHours: 8, actualHours: 8, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Thursday", assignedClient: "Morgan Stanley Inst", shiftType: "Deep Night", scheduledHours: 8, actualHours: 4, utilizationRate: 100, conflictFlag: false },
        { dayOfWeek: "Friday", assignedClient: "Morgan Stanley Inst", shiftType: "Weekend Standby", scheduledHours: 12, actualHours: 12, utilizationRate: 150, conflictFlag: true, conflictReason: "Single-shift length exceeds legal 10-hour single capacity block threshold." },
        { dayOfWeek: "Saturday", assignedClient: "None", shiftType: "Morning Front", scheduledHours: 0, actualHours: 0, utilizationRate: 0, conflictFlag: false },
        { dayOfWeek: "Sunday", assignedClient: "None", shiftType: "Morning Front", scheduledHours: 0, actualHours: 0, utilizationRate: 0, conflictFlag: false }
      ],
      history: { prevMonthTotalHours: 172, completedNodesCount: 25, slaComplianceRate: 92.4 },
      forecast: { estimatedMonthEndHours: 184, projectedRevenueFactor: 29800, burnoutRiskLevel: "High Overload Warning" }
    }
  ]);

  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>("EMP-X881");
  const [selectedDay, setSelectedDay] = useState<DayType>("Monday");
  const [searchQuery, setSearchQuery] = useState("");

  const [editClient, setEditClient] = useState("Goldman Sachs Core");
  const [editShiftType, setEditShiftType] = useState<ShiftAllocationNode["shiftType"]>("Morning Front");
  const [editHours, setEditHours] = useState<number>(8);

  const activeTarget = useMemo(() => {
    return workforceDb.find(p => p.id === selectedPersonnelId) || workforceDb[0];
  }, [workforceDb, selectedPersonnelId]);

  const activeDayNode = useMemo(() => {
    return activeTarget.allocationMatrix.find(n => n.dayOfWeek === selectedDay) || activeTarget.allocationMatrix[0];
  }, [activeTarget, selectedDay]);

  React.useEffect(() => {
    if (activeDayNode) {
      setEditClient(activeDayNode.assignedClient);
      setEditShiftType(activeDayNode.shiftType);
      setEditHours(activeDayNode.scheduledHours);
    }
  }, [selectedPersonnelId, selectedDay, activeDayNode]);

  const handleUpdateShiftNode = (e: React.FormEvent) => {
    e.preventDefault();
    updateSpecificNode(editClient, editShiftType, editHours);
  };

  // Quick Action to apply an Off-Day / Leave state directly to the matrix
  const handleSetOffDay = () => {
    updateSpecificNode("None / Off-Day", "Off-Day / Leave", 0);
  };

  const updateSpecificNode = (client: string, shift: ShiftAllocationNode["shiftType"], hours: number) => {
    setWorkforceDb(prevDb => {
      return prevDb.map(person => {
        if (person.id !== selectedPersonnelId) return person;

        const updatedMatrix = person.allocationMatrix.map(node => {
          if (node.dayOfWeek !== selectedDay) return node;

          const utilization = Math.round((hours / 8) * 100);
          const isConflict = hours > 10;
          const fallbackReason = isConflict ? "Single-shift length exceeds maximum legal 10-hour capacity block limit threshold." : "";

          return {
            ...node,
            assignedClient: client,
            shiftType: shift,
            scheduledHours: hours,
            utilizationRate: utilization,
            conflictFlag: isConflict,
            conflictReason: fallbackReason
          };
        });

        const totalHours = updatedMatrix.reduce((acc, curr) => acc + curr.scheduledHours, 0);
        const projectedMonthHours = totalHours * 4;
        const projectedRev = projectedMonthHours * 140; 
        const updatedRisk = projectedMonthHours > 160 ? "High Overload Warning" : projectedMonthHours > 140 ? "Nominal" : "Low Risk";

        return {
          ...person,
          totalWeeklyHours: totalHours,
          allocationMatrix: updatedMatrix,
          forecast: {
            estimatedMonthEndHours: projectedMonthHours,
            projectedRevenueFactor: projectedRev,
            burnoutRiskLevel: updatedRisk
          }
        };
      });
    });
  };

  const filteredWorkforceList = useMemo(() => {
    return workforceDb.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workforceDb, searchQuery]);

  const hasGlobalCapacityViolation = activeTarget.totalWeeklyHours > activeTarget.maxSlaCapacity;
  const daysArray: DayType[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 antialiased font-sans tracking-tight [perspective:1200px]">
      
      {/* GLOBAL ENTERPRISE HEADER STRIP */}
      <header className="bg-slate-900 text-white p-5 shadow-xl border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-lg font-black tracking-wider uppercase text-slate-100">Workforce Allocation Engine v2</h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Dynamic full-screen schedule engine. Choose active resource nodes and select rotation days to update client matrices live.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search active profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-slate-800/80 focus:bg-slate-950 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700/60 focus:border-emerald-500 outline-hidden text-white placeholder:text-slate-500 transition-all"
          />
        </div>
      </header>

      {/* CORE CONTROL GRID MATRIX */}
      <div className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN PANEL */}
        <div className="xl:col-span-1 space-y-4">
          
          {/* PERSONNEL ACTIVE NODES BOX */}
          <nav className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Personnel Active Nodes</span>
            </div>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-0.5 scrollbar-thin">
              {filteredWorkforceList.map((person) => {
                const isSelected = person.id === selectedPersonnelId;
                const hasAlert = person.totalWeeklyHours > person.maxSlaCapacity || person.allocationMatrix.some(n => n.conflictFlag);
                return (
                  <button
                    key={person.id}
                    onClick={() => setSelectedPersonnelId(person.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 group relative ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-700 text-white shadow-[0_10px_25px_rgba(16,185,129,0.2)] [transform:translateZ(10px)]"
                        : "bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/60 text-slate-700 hover:[transform:translateY(-1px)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={person.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-300/40" />
                      <div className="min-w-0">
                        <span className={`block font-black text-[11px] truncate whitespace-nowrap overflow-hidden ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {person.name}
                        </span>
                        <span className={`block text-[10px] font-semibold truncate whitespace-nowrap overflow-hidden ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                          {person.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end justify-center">
                      <span className={`block font-mono text-[10px] font-black leading-none ${isSelected ? "text-amber-300" : "text-slate-800"}`}>
                        {person.totalWeeklyHours}h
                      </span>
                      {hasAlert && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20 animate-pulse mt-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* HISTORICAL & PREDICTIVE ANALYTICS LEDGER */}
          <section className="bg-slate-900 text-white border border-slate-950 rounded-2xl p-4 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
            
            <div className="space-y-2.5">
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Previous Month Ledger</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 font-bold font-mono px-1.5 py-0.5 rounded-sm">Historical</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-500 block">Total Work Delivered</span>
                  <span className="font-mono font-black text-white text-xs">{activeTarget.history.prevMonthTotalHours} Hrs</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/60 p-2 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-500 block">SLA Compliance</span>
                  <span className={`font-mono font-black text-xs ${activeTarget.history.slaComplianceRate >= 95 ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeTarget.history.slaComplianceRate}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic pl-1">
                ✓ Successfully closed out {activeTarget.history.completedNodesCount} contractual workload tasks during last accounting rotation.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Current Month Forecast</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 font-black px-1.5 py-0.5 rounded-sm animate-pulse">Predictive</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">Est. Month-End Load:</span>
                  <span className="font-mono font-black text-white">{activeTarget.forecast.estimatedMonthEndHours} Hrs</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">Projected Rev Yield:</span>
                  <span className="font-mono font-black text-emerald-400">${activeTarget.forecast.projectedRevenueFactor.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">Overload Threshold:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[9px] tracking-wide uppercase ${
                    activeTarget.forecast.burnoutRiskLevel === "High Overload Warning" 
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    {activeTarget.forecast.burnoutRiskLevel}
                  </span>
                </div>
              </div>
            </div>

          </section>

        </div>

        {/* RIGHT COLUMN LAYOUT */}
        <main className="xl:col-span-3 bg-white border border-slate-200/90 rounded-2xl shadow-md overflow-hidden min-h-[720px] flex flex-col justify-between [transform-style:preserve-3d] [transform:rotateX(0.2deg)] transition-all duration-300">
          
          {/* HEADER METRIC BANNER */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
            <div className="flex items-center gap-4 z-10">
              <img src={activeTarget.avatarUrl} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-lg shrink-0" />
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white">{activeTarget.name}</h2>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    Target Node Synchronized
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400">{activeTarget.role}</p>
                <p className="text-[10px] font-mono text-slate-500 font-bold max-w-xl line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  Skill Block: {activeTarget.primarySkillset}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl font-mono text-right min-w-[140px] z-10">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Cycle Total Load</span>
              <span className={`text-sm font-black ${hasGlobalCapacityViolation ? "text-rose-400" : "text-emerald-400"}`}>
                {activeTarget.totalWeeklyHours} / {activeTarget.maxSlaCapacity} hrs
              </span>
            </div>
          </div>

          {/* DYNAMIC INTERACTIVE ROTATION DAY SELECTOR STRIP */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Select Target Day Matrix to View/Edit:</span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {daysArray.map((day) => {
                const isDaySelected = day === selectedDay;
                const nodeData = activeTarget.allocationMatrix.find(n => n.dayOfWeek === day);
                const isOffDay = nodeData?.shiftType === "Off-Day / Leave";
                const hasHours = nodeData && nodeData.scheduledHours > 0;
                const hasConflict = nodeData && nodeData.conflictFlag;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isDaySelected
                        ? "bg-slate-900 border-slate-950 text-white shadow-md scale-102 font-black"
                        : isOffDay
                        ? "bg-amber-50 border-amber-200 text-amber-800 font-bold"
                        : hasConflict
                        ? "bg-rose-50/80 hover:bg-rose-100/80 border-rose-200 text-rose-800 font-bold"
                        : hasHours
                        ? "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-emerald-900 font-bold"
                        : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600 font-medium"
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-tight">{day.slice(0, 3)}</span>
                    <span className="block text-[9px] font-mono font-bold opacity-60">
                      {isOffDay ? "OFF" : `${nodeData?.scheduledHours || 0}h`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MID FLEX HUB: FORM INPUT CONTROL & DISPLAY GRAPH ELEMENT */}
          <div className="p-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* LIVE DATA MATRICES EDITING FORM CONTROLLER */}
            <div className="lg:col-span-1 bg-slate-50/60 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between gap-4 shadow-3xs hover:shadow-xs transition-all">
              <form onSubmit={handleUpdateShiftNode} className="space-y-3">
                <div className="border-b pb-1.5 border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    Modify {selectedDay} Node
                  </span>
                </div>

                {/* Client Dropdown Select */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Assigned Client Account</label>
                  <select 
                    value={editClient}
                    onChange={(e) => setEditClient(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Goldman Sachs Core">Goldman Sachs Core</option>
                    <option value="BlackRock Liquidity">BlackRock Liquidity</option>
                    <option value="Vanguard Global Tech">Vanguard Global Tech</option>
                    <option value="Citadel High-Freq Asset">Citadel High-Freq Asset</option>
                    <option value="Morgan Stanley Inst">Morgan Stanley Inst</option>
                    <option value="None / Off-Day">None / Off-Day</option>
                  </select>
                </div>

                {/* Shift Configuration Dropdown */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Shift Matrix Profile</label>
                  <select 
                    value={editShiftType}
                    onChange={(e) => setEditShiftType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Morning Front">Morning Front</option>
                    <option value="Core Evening">Core Evening</option>
                    <option value="Deep Night">Deep Night</option>
                    <option value="Weekend Standby">Weekend Standby</option>
                    <option value="Off-Day / Leave">Off-Day / Leave</option>
                  </select>
                </div>

                {/* Hours Allocation Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Scheduled Operational Blocks (Hours)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      min="0"
                      max="24"
                      value={editHours}
                      onChange={(e) => setEditHours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono font-black text-slate-800 outline-hidden focus:border-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-400 shrink-0">hrs/day</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium">Entering values &gt; 10 hrs triggers an automated rest block conflict alert flag.</p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  Apply Allocation Changes
                </button>
              </form>

              {/* OFF-DAY CONFIGURATION TRIGGER */}
              <div className="border-t pt-3 border-slate-200">
                <button 
                  type="button" 
                  onClick={handleSetOffDay}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  🌴 Set as Off-Day / Leave
                </button>
              </div>
            </div>

            {/* FULL DISPLAY READOUT OF THE ENTIRE ACTIVE PROFILE WEEK */}
            <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
              
              {/* CURRENT SELECTED ROTATIONAL DAY HIGHLIGHT OVERVIEW */}
              <div className={`p-4 rounded-xl border transition-all duration-300 ${
                activeDayNode.conflictFlag 
                  ? "bg-rose-50/70 border-rose-200/80 shadow-3xs" 
                  : "bg-indigo-50/30 border-indigo-100/60 shadow-3xs"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Active Workspace Snapshot</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight border ${
                    activeDayNode.conflictFlag ? "bg-rose-100 text-rose-700 border-rose-200 animate-pulse" : "bg-indigo-100 text-indigo-700 border-indigo-200"
                  }`}>
                    {selectedDay} Configuration
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-[11px]">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">Target Account</span>
                    <span className="font-bold text-slate-900 text-xs">{activeDayNode.assignedClient}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">Shift Allocation</span>
                    <span className="font-bold text-slate-900 text-xs">{activeDayNode.shiftType}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 block">Planned Plan Time</span>
                    <span className="font-mono font-black text-slate-900 text-xs">{activeDayNode.scheduledHours} Hours</span>
                  </div>
                  {/* Real worked metrics display layer */}
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 block">Actual Tracked Time</span>
                    <span className="font-mono font-black text-indigo-700 text-xs">
                      {activeDayNode.shiftType === "Off-Day / Leave" ? "0.0 h (Off-Day)" : `${activeDayNode.actualHours} Hours`}
                    </span>
                  </div>
                </div>

                {activeDayNode.conflictFlag && (
                  <div className="mt-3 bg-white p-2.5 rounded-lg border border-rose-200 text-[10px] text-rose-700 font-bold leading-normal">
                    ⚠ {activeDayNode.conflictReason}
                  </div>
                )}
              </div>

              {/* LIVE GENERAL WARNING AND INTEGRITY FEEDBACK LAYER */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2 flex-1 flex flex-col justify-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Weekly Boundary Integrity Monitor</span>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600">Total Structural Accumulation</span>
                    <span className={hasGlobalCapacityViolation ? "text-rose-600 font-black" : "text-slate-800 font-black"}>
                      {activeTarget.totalWeeklyHours} hrs / {activeTarget.maxSlaCapacity} hrs Limit
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border">
                    <div 
                      className={`h-full transition-all duration-500 ${hasGlobalCapacityViolation ? "bg-rose-500" : "bg-emerald-500"}`} 
                      style={{ width: `${Math.min((activeTarget.totalWeeklyHours / activeTarget.maxSlaCapacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {hasGlobalCapacityViolation ? (
                  <p className="text-[10px] font-bold text-rose-600 bg-rose-50/50 border border-rose-100 p-2 rounded-lg leading-relaxed mt-1">
                    CRITICAL: Total combined weekly hours break structural master contract limits. Operational matrix adjustments are required to commit states securely.
                  </p>
                ) : (
                  <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg leading-relaxed mt-1">
                    ✓ Clean Matrix Vector: Profile operations remain strictly compliant within regional and corporate regulatory parameters.
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* LOWER CONTROL STRIP FOOTER BAR */}
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-slate-950">
            <div className="flex items-center gap-6 px-2">
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Active Matrix Hash</span>
                <span className="text-xs font-black font-mono text-emerald-400">{activeTarget.id}-SYS-2026</span>
              </div>
              <div className="border-l border-slate-800 pl-6">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block">Automation State Engine</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wide block mt-0.5">Ready to execute variable modifications</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => alert(`Centralized state save executed successfully. Consolidated weekly load is: ${activeTarget.totalWeeklyHours} hours.`)}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer active:scale-98"
              >
                Commit Variable Matrix
              </button>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}