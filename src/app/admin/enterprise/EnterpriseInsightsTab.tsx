"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  Building2, 
  Search, 
  Sliders, 
  RefreshCw, 
  Award, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  UserCheck, 
  BarChart3, 
  ChevronRight, 
  Zap, 
  Star,
  MapPin,
  Flame,
  HelpCircle,
  X,
  Maximize2,
  Info,
  Clock,
  Calendar
} from "lucide-react";

// =========================================================================
// DATA CONTRACTS DEFINITIONS (PRODUCTION-GRADE TYPE DECLARATIONS)
// =========================================================================
interface StaffPerformance {
  id: string;
  name: string;
  avatar: string;
  role: string;
  shift: "Morning" | "Evening" | "Full-Time";
  averageRating: number;
  totalReviewsLinked: number;
  csatScore: number; 
  recentInvoiceMatch: string;
  topFeedbackTrait: string;
  performanceStatus: "Excellent" | "Good" | "Needs Attention";
}

interface CompetitorIntel {
  id: string;
  businessName: string;
  location: string;
  googleMapsRating: number;
  totalReviewVolume: number;
  reviewsThisWeek: number;
  shareOfVoice: number; 
  topComplaintKeyword: string;
  aiStrategicRecommendation: string;
}

interface AttributionTraceLog {
  id: string;
  timestamp: string;
  staffName: string;
  invoiceId: string;
  ratingInjected: number;
  sentimentStatus: "Positive" | "Neutral" | "Negative";
}

export default function EnterpriseInsightsTab() {
  // --- Global Navigation Configuration States ---
  const [activeSubTab, setActiveSubTab] = useState<"staff" | "competitor">("staff");
  
  // --- Full View Detailed Modal View States ---
  const [isFullLeaderboardOpen, setIsFullLeaderboardOpen] = useState(false);
  const [modalTabFilter, setModalTabFilter] = useState<"all" | "Excellent" | "Good" | "Needs Attention">("all");
  
  // --- 1. STAFF MATRIX MANAGEMENT STATES & ENGINE ---
  const [staffSearch, setStaffSearch] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [isSimulatingReviewMatch, setIsSimulatingReviewMatch] = useState(false);
  const [activeToastMessage, setActiveToastMessage] = useState<string | null>(null);

  const [staffDatabase, setStaffDatabase] = useState<StaffPerformance[]>([
    { id: "STF-201", name: "Ko Mg Mg", avatar: "MM", role: "Senior Server / Lead Barista", shift: "Morning", averageRating: 4.9, totalReviewsLinked: 142, csatScore: 98, recentInvoiceMatch: "INV-88721", topFeedbackTrait: "Friendly & Super Fast Service", performanceStatus: "Excellent" },
    { id: "STF-202", name: "Ma Su Su", avatar: "SS", role: "Guest Relations Specialist", shift: "Morning", averageRating: 4.7, totalReviewsLinked: 98, csatScore: 92, recentInvoiceMatch: "INV-88745", topFeedbackTrait: "Highly Professional Communication", performanceStatus: "Excellent" },
    { id: "STF-203", name: "Ko Aung Kyaw", avatar: "AK", role: "Junior Floor Staff", shift: "Evening", averageRating: 4.5, totalReviewsLinked: 64, csatScore: 86, recentInvoiceMatch: "INV-88699", topFeedbackTrait: "Attentive to Table Details", performanceStatus: "Good" },
    { id: "STF-204", name: "Ma Honey", avatar: "HN", role: "Apprentice Order Taker", shift: "Evening", averageRating: 3.8, totalReviewsLinked: 41, csatScore: 68, recentInvoiceMatch: "INV-88510", topFeedbackTrait: "Slow Order Processing Time", performanceStatus: "Needs Attention" },
    { id: "STF-205", name: "Htet Aung", avatar: "HA", role: "Lead Mixologist", shift: "Evening", averageRating: 4.8, totalReviewsLinked: 110, csatScore: 95, recentInvoiceMatch: "INV-88421", topFeedbackTrait: "Creative Beverage Execution", performanceStatus: "Excellent" },
    { id: "STF-206", name: "Thandar Win", avatar: "TW", role: "Hostess Supervisor", shift: "Morning", averageRating: 4.6, totalReviewsLinked: 85, csatScore: 90, recentInvoiceMatch: "INV-88319", topFeedbackTrait: "Warm Initial Reception", performanceStatus: "Excellent" },
    { id: "STF-207", name: "Zayar Lin", avatar: "ZL", role: "Floor Runner", shift: "Evening", averageRating: 4.1, totalReviewsLinked: 52, csatScore: 78, recentInvoiceMatch: "INV-88210", topFeedbackTrait: "Quick Table Turnover Times", performanceStatus: "Good" }
  ]);

  const [attributionLogs, setAttributionLogs] = useState<AttributionTraceLog[]>([
    { id: "LOG-01", timestamp: "3 mins ago", staffName: "Ko Mg Mg", invoiceId: "INV-88721", ratingInjected: 5, sentimentStatus: "Positive" },
    { id: "LOG-02", timestamp: "24 mins ago", staffName: "Ma Su Su", invoiceId: "INV-88745", ratingInjected: 5, sentimentStatus: "Positive" },
    { id: "LOG-03", timestamp: "1 hour ago", staffName: "Ko Aung Kyaw", invoiceId: "INV-88699", ratingInjected: 4, sentimentStatus: "Positive" },
  ]);

  // --- 2. COMPETITOR INTEL HUB STATES & ENGINE ---
  const [isScrapingMaps, setIsScrapingMaps] = useState(false);
  const [lastScrapedTime, setLastScrapedTime] = useState("Last automatic sync 12 hours ago");
  
  const [competitorDatabase, setCompetitorDatabase] = useState<CompetitorIntel[]>([
    { id: "COMP-01", businessName: "Apex Specialty Coffee & Bistro (Main Rival)", location: "Yaw Min Gyi, Dagon", googleMapsRating: 4.6, totalReviewVolume: 842, reviewsThisWeek: 28, shareOfVoice: 38, topComplaintKeyword: "Long Wait Times & High Prices", aiStrategicRecommendation: "Their customers are complaining about waiting times. Launch a sponsored social media ad highlighting your 'Under 10 Minutes Serve' guarantee." },
    { id: "COMP-02", businessName: "The Daily Brew Cafe & Roastery", location: "Sanchaung Township", googleMapsRating: 4.3, totalReviewVolume: 512, reviewsThisWeek: 14, shareOfVoice: 22, topComplaintKeyword: "Air-con Uncomfortable & Poor Parking", aiStrategicRecommendation: "Capitalize on their facility discomfort. Target local workers emphasizing your premium coworking spaces and free parking lots." },
    { id: "COMP-03", businessName: "Urban Oasis Lounge", location: "Bahan Township", googleMapsRating: 4.1, totalReviewVolume: 310, reviewsThisWeek: 6, shareOfVoice: 12, topComplaintKeyword: "Inattentive Staff / Cold Food", aiStrategicRecommendation: "Their ratings are falling due to poor service. Continue boosting your 5-star Staff Attribution Leaderboard entries on marketing campaigns." },
  ]);

  // --- Dynamic Live Simulator Functions ---
  const handleSimulateReviewMatch = () => {
    setIsSimulatingReviewMatch(true);
    setTimeout(() => {
      const randomStaffIndex = Math.floor(Math.random() * staffDatabase.length);
      const targetStaff = staffDatabase[randomStaffIndex];
      const generatedInvoiceId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
      const logId = `LOG-${Math.floor(10 + Math.random() * 89)}`;

      setStaffDatabase(prevStaff => prevStaff.map((staff, idx) => {
        if (idx === randomStaffIndex) {
          const nextReviewsCount = staff.totalReviewsLinked + 1;
          const nextRating = Math.min(5.0, parseFloat(((staff.averageRating * staff.totalReviewsLinked + 5) / nextReviewsCount).toFixed(1)));
          return {
            ...staff,
            totalReviewsLinked: nextReviewsCount,
            averageRating: nextRating,
            recentInvoiceMatch: generatedInvoiceId,
            performanceStatus: nextRating >= 4.6 ? "Excellent" : nextRating >= 4.2 ? "Good" : "Needs Attention"
          };
        }
        return staff;
      }));

      setAttributionLogs(prevLogs => [{
        id: logId,
        timestamp: "Just now",
        staffName: targetStaff.name,
        invoiceId: generatedInvoiceId,
        ratingInjected: 5,
        sentimentStatus: "Positive"
      }, ...prevLogs]);

      setIsSimulatingReviewMatch(false);
      setActiveToastMessage(`API Success: POS Review matched with ${targetStaff.name} via ${generatedInvoiceId}!`);
      setTimeout(() => setActiveToastMessage(null), 4000);
    }, 1200);
  };

  const handleTriggerMapsScrape = () => {
    setIsScrapingMaps(true);
    setTimeout(() => {
      setCompetitorDatabase(prevComp => prevComp.map(comp => {
        const addedReviews = Math.floor(2 + Math.random() * 5);
        return {
          ...comp,
          totalReviewVolume: comp.totalReviewVolume + addedReviews,
          reviewsThisWeek: comp.reviewsThisWeek + addedReviews
        };
      }));
      setIsScrapingMaps(false);
      setLastScrapedTime(`Last automatic sync was forced just now (${new Date().toLocaleTimeString()})`);
    }, 1400);
  };

  // Memoized Search Pipelines for Dashboard Layout
  const filteredStaff = useMemo(() => {
    return staffDatabase.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(staffSearch.toLowerCase()) || staff.role.toLowerCase().includes(staffSearch.toLowerCase());
      const matchesShift = shiftFilter === "all" || staff.shift === shiftFilter;
      return matchesSearch && matchesShift;
    });
  }, [staffDatabase, staffSearch, shiftFilter]);

  // Main Dashboard Content: Sorted Top Performers only
  const dashboardTopStaff = useMemo(() => {
    return [...filteredStaff].sort((a, b) => b.averageRating - a.averageRating).slice(0, 4);
  }, [filteredStaff]);

  // Modal Panel Specific Filter
  const modalFilteredStaff = useMemo(() => {
    return filteredStaff.filter(staff => modalTabFilter === "all" || staff.performanceStatus === modalTabFilter);
  }, [filteredStaff, modalTabFilter]);

  return (
    <div className="w-full bg-slate-50 min-h-screen p-2 sm:p-6 text-slate-700 font-sans selection:bg-amber-100 transition-all duration-300">
      
      {/* GLOBAL TOAST ATTRIBUTION FEEDBACK TRIGGER BANNER */}
      {activeToastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-emerald-200 text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-6 duration-300">
          <div className="p-1 bg-emerald-500 text-white rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-bold">{activeToastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          ENTERPRISE PREMIUM TAB HEADER & STRATEGIC HUB MENU CONTROLS
          ========================================================================= */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                Enterprise Exclusive Plan
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1.5">
              Advanced Strategic Analytics Hub
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Unified cross-channel platform synchronizing core point-of-sale customer mapping with real-time perimeter competitor intelligence streams.
            </p>
          </div>

          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/40 self-start md:self-center">
            <button
              onClick={() => setActiveSubTab("staff")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "staff"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Staff Attribution Matrix
            </button>
            <button
              onClick={() => setActiveSubTab("competitor")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === "competitor"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Competitor Intelligence Hub
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUB-TAB SYSTEM VIEW 1: STAFF ATTRIBUTION MATRIX
          ========================================================================= */}
      {activeSubTab === "staff" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TOP CORE LEVEL SCOREBOARD METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tracked Employees</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{staffDatabase.length} Active Staff</h3>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">POS Links Ingested</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">592 Transactions</h3>
              </div>
              <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between relative group cursor-help">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Overall Star Avg <Info className="w-3 h-3 text-slate-400" />
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">🌟 4.56 / 5.0</h3>
              </div>
              <div className="p-2.5 bg-slate-50 text-amber-500 rounded-xl border border-slate-100">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>

              {/* RATING HOVER OVERLAY TOOLTIP CARD */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white rounded-xl p-3 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-30 space-y-1.5">
                <p className="text-xs font-black border-b border-slate-800 pb-1 text-amber-400">Weighted Performance Grade</p>
                <div className="text-[10px] space-y-1 font-medium text-slate-300">
                  <div className="flex justify-between"><span>Morning Shift Mean:</span> <span className="font-bold text-white">4.73 Stars</span></div>
                  <div className="flex justify-between"><span>Evening Shift Mean:</span> <span className="font-bold text-white">4.30 Stars</span></div>
                  <div className="flex justify-between"><span>Historical Target Level:</span> <span className="font-bold text-emerald-400">Exceeded (+0.2)</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between relative group cursor-help">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Average Team CSAT <Info className="w-3 h-3 text-slate-400" />
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">91% System Score</h3>
              </div>
              <div className="p-2.5 bg-slate-50 text-blue-600 rounded-xl border border-slate-100">
                <Award className="w-4 h-4" />
              </div>

              {/* CSAT HOVER OVERLAY TOOLTIP CARD */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-slate-900 text-white rounded-xl p-3 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-30 space-y-1">
                <p className="text-xs font-bold text-blue-400">Customer Satisfaction Parameters</p>
                <p className="text-[10px] text-slate-300 leading-normal">
                  Calculated from verified POS invoice linkage loops. 91% represents an optimal benchmark across corporate parameters.
                </p>
              </div>
            </div>
          </div>

          {/* DYNAMIC FILTER MODULE & POS WORKFLOW INGESTION SYSTEM */}
          <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff members, unique roles, shift metadata..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full bg-slate-50 text-xs pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 font-medium transition-colors placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div className="relative">
                <Sliders className="absolute left-3 top-3.5 h-3 w-3 text-slate-400 pointer-events-none" />
                <select 
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  className="bg-slate-50 text-xs pl-8 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none appearance-none font-bold text-slate-600 cursor-pointer w-full sm:w-48"
                >
                  <option value="all">All Working Shifts</option>
                  <option value="Morning">Morning Shift Only</option>
                  <option value="Evening">Evening Shift Only</option>
                </select>
                <div className="absolute right-3 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
              </div>
            </div>

            <button
              onClick={handleSimulateReviewMatch}
              disabled={isSimulatingReviewMatch}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingReviewMatch ? "animate-spin text-amber-400" : ""}`} />
              {isSimulatingReviewMatch ? "Processing Link Engine..." : "Simulate POS Review Link"}
            </button>
          </div>

          {/* TWIN GRID SCHEME: TOP LEADERBOARD SUMMARY PANEL VS LIVE INGESTION STREAM */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEADERBOARD VIEW WITH INTERACTIVE ALL/FULL BUTTON */}
            <div className="xl:col-span-2 bg-white border border-slate-200/60 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Frictionless Allocation Leaderboard</h4>
                  <button 
                    onClick={() => setIsFullLeaderboardOpen(true)}
                    className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-all group"
                  >
                    <Maximize2 className="w-3 h-3 transition-transform group-hover:scale-110" /> View Comprehensive List
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50/20">
                        <th className="p-4">Employee Persona</th>
                        <th className="p-4">Shift Bounds</th>
                        <th className="p-4">Linked Reviews</th>
                        <th className="p-4">Average Score</th>
                        <th className="p-4 text-right">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardTopStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50/40 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-100 border border-slate-200/60 rounded-xl flex items-center justify-center font-black text-xs text-slate-700">
                                {staff.avatar}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900">{staff.name}</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{staff.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {staff.shift}
                            </span>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{staff.totalReviewsLinked} links</p>
                              <p className="text-[9px] font-mono font-medium text-slate-400 mt-0.5">Last Match: {staff.recentInvoiceMatch}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 relative group/row cursor-help">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-black text-slate-900">{staff.averageRating}</span>
                              <span className="text-[10px] font-medium text-slate-400 ml-1">({staff.csatScore}% CSAT)</span>
                              
                              {/* STAFF INSIGHT TOOLTIP HOVER ACCENT */}
                              <div className="absolute bottom-full left-0 mb-1.5 w-48 bg-slate-900 text-white p-2 rounded-lg text-[10px] opacity-0 pointer-events-none group-hover/row:opacity-100 transition-opacity duration-200 shadow-lg z-20 font-sans">
                                <span className="font-bold text-amber-400 block mb-0.5">Trait Feedback Profile:</span>
                                {staff.topFeedbackTrait}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              staff.performanceStatus === "Excellent" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              staff.performanceStatus === "Good" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                              "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {staff.performanceStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                <p className="text-[11px] font-medium text-slate-400">Displaying top 4 priority allocations matched. Use comprehensive view for internal auditing.</p>
              </div>
            </div>

            {/* LIVE SYSTEM PIPELINE ATTR LOG STREAM PANEL */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-slate-800" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">Live Ingestion Stream</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                    Active Pipeline
                  </span>
                </div>

                <div className="space-y-3 max-h-[310px] overflow-y-auto pr-0.5">
                  {attributionLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1 font-mono text-[11px] hover:border-slate-300 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[150px]">
                          👤 Attributed: {log.staffName}
                        </span>
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1 rounded">
                          MATCHED
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Invoice Gateway Vector: <span className="text-slate-900 font-bold">{log.invoiceId}</span>
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                        <span>Score: {log.ratingInjected} Stars 🌟</span>
                        <span className="text-slate-500 flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> {log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-100/60 border border-slate-200/40 rounded-xl flex items-start gap-2.5 mt-4">
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  <strong>System Mapping Logic:</strong> Traces terminal transaction metadata packets instantly to identify staff attribution coordinates seamlessly without client Friction logs.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB SYSTEM VIEW 2: COMPETITOR INTELLIGENCE HUB
          ========================================================================= */}
      {activeSubTab === "competitor" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TOP CARD KPI CONTAINER OVERVIEW SET */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monitored Targets</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{competitorDatabase.length} Competitors</h3>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between relative group cursor-help">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Your Market Share <Info className="w-3 h-3 text-slate-400" />
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">28% Voice Weight</h3>
              </div>
              <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
                <TrendingUp className="w-4 h-4" />
              </div>

              {/* VOICE WEIGHT HOVER TOOLTIP INTERACTION */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white rounded-xl p-3 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-30 space-y-1.5">
                <p className="text-xs font-bold text-amber-400">Local Penetration Density</p>
                <p className="text-[10px] text-slate-300 leading-normal">
                  Represents your review acquisition velocity volume evaluated against total localized township business competitor footprints.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Market Benchmark</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">4.33 Stars Mean</h3>
              </div>
              <div className="p-2.5 bg-slate-50 text-amber-500 rounded-xl border border-slate-100">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scraper Health Rate</span>
                <h3 className="text-xl font-black text-emerald-700 mt-0.5">100% Operational</h3>
              </div>
              <div className="p-2.5 bg-slate-50 text-emerald-600 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* DYNAMIC FORCED REFRESH RADAR LINE BAR */}
          <div className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-transparent sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <p className="text-xs font-bold text-slate-500 font-mono">
                {lastScrapedTime}
              </p>
            </div>
            
            <button
              onClick={handleTriggerMapsScrape}
              disabled={isScrapingMaps}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScrapingMaps ? "animate-spin text-amber-400" : ""}`} />
              {isScrapingMaps ? "Indexing Google Maps Nodes..." : "Force Instant Competitor Scrape"}
            </button>
          </div>

          {/* HIGH FIDELITY SHARE SEGMENTATION PLOTS GRAPH BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COMPARATIVE ACQUISITION SPLIT COMPONENT */}
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs lg:col-span-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-5">Review Volume Acquisition Share</h4>
                
                <div className="space-y-5">
                  <div className="hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-900 font-black">Your Reputation App</span>
                      <span className="text-slate-500 text-[11px]">303 Reviews (Healthy)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "36%" }}></div>
                    </div>
                  </div>

                  <div className="hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">Apex Specialty Coffee</span>
                      <span className="text-slate-500 text-[11px]">842 Reviews (Dominant)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div className="hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">The Daily Brew Cafe</span>
                      <span className="text-slate-500 text-[11px]">512 Reviews (Moderate)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-300 h-full rounded-full transition-all duration-500" style={{ width: "55%" }}></div>
                    </div>
                  </div>

                  <div className="hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">Urban Oasis Lounge</span>
                      <span className="text-slate-500 text-[11px]">310 Reviews (Slowly Falling)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-200 h-full rounded-full transition-all duration-500" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Automated engine capturing local township indexing updates.
              </div>
            </div>

            {/* EXPANDED ACTIONABLE CARDS CONTAINER: TARGET LOG CONTROLS */}
            <div className="lg:col-span-2 space-y-4">
              {competitorDatabase.map((comp) => (
                <div key={comp.id} className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
                  
                  {comp.reviewsThisWeek > 20 && (
                    <div className="absolute top-0 right-0 bg-rose-50 text-rose-700 text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl border-l border-b border-rose-100 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-500" /> High Velocity Activity
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-600 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-slate-800 transition-colors">
                          {comp.businessName}
                        </h4>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{comp.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50/60 border border-slate-100 px-3 py-2 rounded-xl">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Rating</span>
                        <span className="text-slate-900 font-black flex items-center gap-0.5">
                          🌟 {comp.googleMapsRating}
                        </span>
                      </div>
                      <div className="border-l border-slate-200 h-6"></div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Total Vol</span>
                        <span className="text-slate-900 font-black">{comp.totalReviewVolume} revs</span>
                      </div>
                      <div className="border-l border-slate-200 h-6"></div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">This Week</span>
                        <span className="text-amber-600 font-black">+{comp.reviewsThisWeek} listings</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50/60 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      Captured Consumer Risk: "{comp.topComplaintKeyword}"
                    </div>

                    <div className="bg-slate-50/80 border border-slate-200/60 p-3.5 rounded-xl flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-600 leading-relaxed font-medium">
                        <strong className="text-slate-900 block font-black mb-0.5">AI Strategic Vector Insight:</strong>
                        {comp.aiStrategicRecommendation}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          HIGH FIDELITY SUB-TABBED MODAL WRAPPER (FULL LEADERBOARD VIEW)
          ========================================================================= */}
      {isFullLeaderboardOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            
            {/* Modal Header Panel */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-700" /> Comprehensive Staff Allocation Registry
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Verified auditing space capturing individual linked performance loops.</p>
              </div>
              <button 
                onClick={() => setIsFullLeaderboardOpen(false)}
                className="p-1.5 hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 rounded-lg transition-colors border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Filter Tab Rig */}
            <div className="p-3 bg-white border-b border-slate-100 flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setModalTabFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTabFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
              >
                All Personnel ({filteredStaff.length})
              </button>
              <button
                onClick={() => setModalTabFilter("Excellent")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTabFilter === "Excellent" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
              >
                Excellent Tier ({filteredStaff.filter(s => s.performanceStatus === "Excellent").length})
              </button>
              <button
                onClick={() => setModalTabFilter("Good")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTabFilter === "Good" ? "bg-blue-600 text-white" : "bg-slate-50 text-blue-700 hover:bg-slate-100"}`}
              >
                Good Tier ({filteredStaff.filter(s => s.performanceStatus === "Good").length})
              </button>
              <button
                onClick={() => setModalTabFilter("Needs Attention")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTabFilter === "Needs Attention" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-slate-100"}`}
              >
                Needs Attention ({filteredStaff.filter(s => s.performanceStatus === "Needs Attention").length})
              </button>
            </div>

            {/* Modal Internal Content Scroll Area */}
            <div className="overflow-y-auto flex-1 p-4 bg-slate-50/40">
              {modalFilteredStaff.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-100 space-y-2">
                  <Info className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">No personnel allocations found matching this segment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modalFilteredStaff.map(staff => (
                    <div key={staff.id} className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-slate-700 border border-slate-200/50">
                            {staff.avatar}
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-slate-900">{staff.name}</h5>
                            <p className="text-[10px] font-medium text-slate-400">{staff.role}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          staff.performanceStatus === "Excellent" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          staff.performanceStatus === "Good" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {staff.performanceStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 font-medium text-[10px] text-slate-400">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-300 uppercase">Shift</span>
                          <span className="text-slate-700 font-bold">{staff.shift}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-300 uppercase">Linked Logs</span>
                          <span className="text-slate-800 font-bold">{staff.totalReviewsLinked} links</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-300 uppercase">Rating Score</span>
                          <span className="text-slate-900 font-black flex items-center gap-0.5">🌟 {staff.averageRating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate max-w-[200px]">💡 {staff.topFeedbackTrait}</span>
                        <span className="bg-slate-100 text-slate-600 px-1 rounded text-[9px] shrink-0 font-sans font-bold">ID: {staff.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Action Status Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button 
                onClick={() => setIsFullLeaderboardOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-2xs transition-all"
              >
                Return To Master Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}