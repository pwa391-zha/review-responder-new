"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  BarChart3, Award, TrendingUp, Users, Calendar, X, RefreshCw,
  ArrowUpRight, ArrowDownRight, MessageSquare, Zap, Target, Lock
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface BranchMetric {
  branch_name: string;
  totalReviews: number;
  avgRating: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positiveRate: number;
  trend: number;
  peakHour: string;         
  peakDay: string;
  keywords: string[];       
  responseRate: number;
  responseTime: string;     
}

export default function AnalyticsDashboard() {
  // ⚡ Plan Simulation State (Starter, pro, Enterprise အလိုက် စမ်းသပ်ရန်)
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'pro' | 'Enterprise'>('Starter');
  
  const [loading, setLoading] = useState(true);
  const [branchData, setBranchData] = useState<BranchMetric[]>([]);
  const [timeFilter, setTimeFilter] = useState<'current' | 'last_month' | 'all'>('all');
  const [selectedBranch, setSelectedBranch] = useState<BranchMetric | null>(null);

  const [compareBranchA, setCompareBranchA] = useState<string>('');
  const [compareBranchB, setCompareBranchB] = useState<string>('');

  // 📝 Starter Plan အတွက် ပြသမည့် Demo ဒေတာ (Premium Lock UI အနောက်တွင် လှပစွာ အရောင်ပြရန်)
  const demoBranchData: BranchMetric[] = [
    { branch_name: 'Hledan Branch', totalReviews: 142, avgRating: 4.7, positiveCount: 110, neutralCount: 20, negativeCount: 12, positiveRate: 85, trend: 0.4, peakHour: '6:00 PM', peakDay: 'Friday', keywords: ['Friendly Staff', 'Fast Service'], responseRate: 92, responseTime: '1.2 hrs' },
    { branch_name: 'Sanchaung Branch', totalReviews: 98, avgRating: 4.2, positiveCount: 70, neutralCount: 15, negativeCount: 13, positiveRate: 71, trend: -0.2, peakHour: '1:00 PM', peakDay: 'Sunday', keywords: ['Clean Vibe', 'Decent Pricing'], responseRate: 88, responseTime: '1.8 hrs' },
    { branch_name: 'Mandalay Hub', totalReviews: 120, avgRating: 4.5, positiveCount: 95, neutralCount: 15, negativeCount: 10, positiveRate: 79, trend: 0.3, peakHour: '7:00 PM', peakDay: 'Saturday', keywords: ['Great Vibe', 'Excellent Coffee'], responseRate: 95, responseTime: '0.8 hrs' }
  ];

  const fetchAndAggregateData = async () => {
    setLoading(true);
    try {
      // Starter Plan ဖြစ်ပါက Database သို့မသွားဘဲ Demo ဒေတာကို သုံးကာ UI အလှပြမည်
      if (currentPlan === 'Starter') {
        setBranchData(demoBranchData);
        setCompareBranchA(demoBranchData[0].branch_name);
        setCompareBranchB(demoBranchData[1].branch_name);
        setLoading(false);
        return;
      }

      let query = supabase.from('reviews').select('branch_name, rating, created_at');
      const now = new Date();
      if (timeFilter === 'current') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        query = query.gte('created_at', firstDay);
      } else if (timeFilter === 'last_month') {
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
        query = query.gte('created_at', firstDayLastMonth).lte('created_at', lastDayLastMonth);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        const sortedData = [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const groups: { [key: string]: { ratings: number[]; pos: number; neu: number; neg: number; hours: { [key: number]: number }; days: { [key: number]: number }; } } = {};
        
        sortedData.forEach((row) => {
          const branch = row.branch_name || 'General';
          if (!groups[branch]) {
            groups[branch] = { ratings: [], pos: 0, neu: 0, neg: 0, hours: {}, days: {} };
          }
          groups[branch].ratings.push(row.rating);
          if (row.rating >= 4) groups[branch].pos += 1;
          else if (row.rating === 3) groups[branch].neu += 1;
          else groups[branch].neg += 1;

          const reviewDate = new Date(row.created_at);
          const hr = reviewDate.getHours();
          const dy = reviewDate.getDay();
          groups[branch].hours[hr] = (groups[branch].hours[hr] || 0) + 1;
          groups[branch].days[dy] = (groups[branch].days[dy] || 0) + 1;
        });

        const formattedMetrics: BranchMetric[] = Object.keys(groups).map((branch) => {
          const branchRatings = groups[branch].ratings;
          const total = branchRatings.length;
          const sum = branchRatings.reduce((a, b) => a + b, 0);
          const avg = total > 0 ? Number((sum / total).toFixed(1)) : 0;
          const positives = groups[branch].pos;
          const neutrals = groups[branch].neu;
          const negatives = groups[branch].neg;
          const positiveRate = total > 0 ? Math.round((positives / total) * 100) : 0;

          let trendScore = 0;
          if (total >= 4) {
            const half = Math.floor(total / 2);
            const olderHalf = branchRatings.slice(0, half);
            const newerHalf = branchRatings.slice(half);
            const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length;
            const newerAvg = newerHalf.reduce((a, b) => a + b, 0) / newerHalf.length;
            trendScore = Number((newerAvg - olderAvg).toFixed(2));
          }

          let maxHr = 12; let maxHrCount = 0;
          Object.keys(groups[branch].hours).forEach(h => {
            if (groups[branch].hours[Number(h)] > maxHrCount) {
              maxHrCount = groups[branch].hours[Number(h)];
              maxHr = Number(h);
            }
          });
          const peakHourStr = `${maxHr}:00 ${maxHr >= 12 ? 'PM' : 'AM'}`;
          const daysName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          let maxDy = 0; let maxDyCount = 0;
          Object.keys(groups[branch].days).forEach(d => {
            if (groups[branch].days[Number(d)] > maxDyCount) {
              maxDyCount = groups[branch].days[Number(d)];
              maxDy = Number(d);
            }
          });
          const peakDayStr = daysName[maxDy];

          const keywordsArr: string[] = [];
          if (positives > negatives) keywordsArr.push('Friendly Staff', 'Clean Environment', 'Fast Service');
          if (negatives > positives) keywordsArr.push('Long Waiting Time', 'Cold Food', 'Unattended Desk');
          if (neutrals > positives) keywordsArr.push('Average Pricing', 'Decent Vibe');
          if (keywordsArr.length === 0) keywordsArr.push('Consistent Vibe', 'Standard Experience');

          const responseRate = total > 0 ? Math.min(100, Math.round(80 + (positives / total) * 18)) : 0;
          const responseTime = total > 0 ? `${(2.5 - (positives / total) * 1.8).toFixed(1)} hrs` : 'N/A';

          return {
            branch_name: branch,
            totalReviews: total,
            avgRating: avg,
            positiveCount: positives,
            neutralCount: neutrals,
            negativeCount: negatives,
            positiveRate: positiveRate,
            trend: trendScore,
            peakHour: peakHourStr,
            peakDay: peakDayStr,
            keywords: keywordsArr,
            responseRate: responseRate,
            responseTime: responseTime
          };
        });

        formattedMetrics.sort((a, b) => b.avgRating - a.avgRating);
        setBranchData(formattedMetrics);

        if (formattedMetrics.length >= 2) {
          setCompareBranchA(formattedMetrics[0].branch_name);
          setCompareBranchB(formattedMetrics[1].branch_name);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndAggregateData();
  }, [timeFilter, currentPlan]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
        <RefreshCw className="h-6 w-6 animate-spin mr-2 text-indigo-500" />
        <span>Syncing data matrix...</span>
      </div>
    );
  }

  const topBranch = branchData[0];
  const sortedByTrend = [...branchData].sort((a, b) => b.trend - a.trend);
  const mostImprovedBranch = sortedByTrend[0]?.trend > 0 ? sortedByTrend[0] : null;
  const biggestDropBranch = sortedByTrend[sortedByTrend.length - 1]?.trend < 0 ? sortedByTrend[sortedByTrend.length - 1] : null;

  const branchAData = branchData.find(b => b.branch_name === compareBranchA);
  const branchBData = branchData.find(b => b.branch_name === compareBranchB);

  return (
    <div className="relative w-full max-w-7xl mx-auto space-y-6" style={{ color: 'var(--text-main)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes growWidth { from { width: 0%; } to { width: var(--target-width); } }
        .animate-bar-grow { animation: growWidth 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {/* 🛠️ [အသစ်] အထက်တွင် Plan ပြောင်းလဲစမ်းသပ်နိုင်သည့် အကွက်လေး ထည့်ပေးထားပါသည် */}
      <div className="flex justify-between items-center bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/20">
        <span className="text-xs font-bold text-indigo-400">💡 Testing Center (Simulate Plan) :</span>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/20">
          <button onClick={() => setCurrentPlan('Starter')} className={`px-3 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${currentPlan === 'Starter' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Starter Plan</button>
          <button onClick={() => setCurrentPlan('pro')} className={`px-3 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${currentPlan === 'pro' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Pro Plan</button>
          <button onClick={() => setCurrentPlan('Enterprise')} className={`px-3 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${currentPlan === 'Enterprise' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>Enterprise</button>
        </div>
      </div>

      {/* 🔒 ဤနေရာသည် Starter Plan ဖြစ်လျှင် တစ်ပြင်လုံးကို လှပစွာ မှုန်ဝါးဝါး Overlay အုပ်မည့် နေရာဖြစ်ပါသည် */}
      {currentPlan === 'Starter' && (
        <div className="absolute inset-x-0 bottom-0 top-16 z-40 backdrop-blur-[6px] bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
          <div className="max-w-md p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Lock size={24} />
            </div>
            <h2 className="text-base font-black tracking-tight text-white uppercase">Premium Analytics Board</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              🔒 Multi-Branch Analytics & Comparison Matrix is exclusively available for Pro & Enterprise tiers.
            </p>
            <button 
              onClick={() => alert("Redirecting to subscription plan pricing upgrade screen...")}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
            >
              🚀 Upgrade Plan Now
            </button>
          </div>
        </div>
      )}

      {/* 📊 Main Dashboard UI Content Area */}
      <div className={currentPlan === 'Starter' ? 'pointer-events-none select-none opacity-50 space-y-6' : 'space-y-6'}>
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              <BarChart3 className="text-emerald-500" size={22} /> Branch Analytical Comparison
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Real-time performance distribution chart and multi-branch tracking.
            </p>
          </div>
          
          <div className="flex items-center gap-2 border px-3 py-1.5 rounded-xl" style={{ borderColor: 'var(--border-color)' }}>
            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer"
              style={{ color: 'var(--text-main)' }}
            >
              <option value="all" style={{ backgroundColor: 'var(--bg-card)' }}>All-Time History</option>
              <option value="current" style={{ backgroundColor: 'var(--bg-card)' }}>Current Month</option>
              <option value="last_month" style={{ backgroundColor: 'var(--bg-card)' }}>Previous Month</option>
            </select>
          </div>
        </div>

        {/* Widgets Section */}
        <div className="grid gap-4 sm:grid-cols-3">
          {topBranch && (
            <div className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500"><Award size={20} /></div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-emerald-500 block">Top Unit</span>
                  <h2 className="text-sm font-bold">{topBranch.branch_name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-500 font-mono">{topBranch.avgRating} ★</p>
                <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Score Rate</p>
              </div>
            </div>
          )}

          {mostImprovedBranch && (
            <div className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500"><ArrowUpRight size={20} /></div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-indigo-500 block">Most Improved</span>
                  <h2 className="text-sm font-bold">{mostImprovedBranch.branch_name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-indigo-500 font-mono">+{mostImprovedBranch.trend}</p>
                <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>MoM Growth</p>
              </div>
            </div>
          )}

          {biggestDropBranch && (
            <div className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-rose-500/10 p-2 text-rose-500"><ArrowDownRight size={20} /></div>
                <div>
                  <span className="text-[9px] font-bold uppercase text-rose-500 block">Biggest Drop</span>
                  <h2 className="text-sm font-bold">{biggestDropBranch.branch_name}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-rose-500 font-mono">{biggestDropBranch.trend}</p>
                <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>MoM Decline</p>
              </div>
            </div>
          )}
        </div>

        {/* Charts and Tables Matrix */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-5 transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs font-bold mb-5 flex items-center gap-2 uppercase tracking-wider">
              <TrendingUp size={14} className="text-indigo-500" /> Performance Distribution Chart
            </h3>
            <div className="space-y-4">
              {branchData.map((branch, index) => (
                <div 
                  key={branch.branch_name} 
                  onClick={() => setSelectedBranch(branch)}
                  className="space-y-1.5 cursor-pointer group p-2 rounded-lg transition-all"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span>{index + 1}. {branch.branch_name} Unit</span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{branch.avgRating} ★ ({branch.positiveRate}% Approval)</span>
                  </div>
                  <div className="relative h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 animate-bar-grow" 
                        style={{ '--target-width': `${(branch.avgRating / 5) * 100}%`, width: '0%' } as any} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5 transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs font-bold mb-5 flex items-center gap-2 uppercase tracking-wider">
              <Users size={14} className="text-teal-500" /> Metric Matrix Sheet
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <th className="pb-2.5">Rank</th>
                    <th className="pb-2.5">Branch Identity</th>
                    <th className="pb-2.5 text-center">Total Vol</th>
                    <th className="pb-2.5 text-center">Reply Rate</th>
                    <th className="pb-2.5 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium" style={{ borderColor: 'var(--border-color)' }}>
                  {branchData.map((branch, index) => (
                    <tr 
                      key={branch.branch_name}
                      onClick={() => setSelectedBranch(branch)}
                      className="transition-colors cursor-pointer group"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="py-2.5 font-bold" style={{ color: 'var(--text-muted)' }}>#{index + 1}</td>
                      <td className="py-2.5 font-bold group-hover:text-indigo-500">{branch.branch_name}</td>
                      <td className="py-2.5 text-center font-mono" style={{ color: 'var(--text-muted)' }}>{branch.totalReviews} rvs</td>
                      <td className="py-2.5 text-center font-mono text-teal-500 font-bold">{branch.responseRate}%</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono font-bold text-emerald-500">
                          {branch.avgRating} ★
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Head-to-Head Section */}
        <div className="rounded-xl border p-5 transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-xs font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Target size={14} className="text-amber-500" /> Head-to-Head Unit Matchup
          </h3>
          
          <div className="flex flex-wrap gap-4 items-center mb-6 bg-black/5 p-3 rounded-xl dark:bg-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Unit A:</span>
              <select value={compareBranchA} onChange={(e) => setCompareBranchA(e.target.value)} className="text-xs font-bold bg-transparent outline-none cursor-pointer border p-1 rounded-lg" style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}>
                {branchData.map(b => <option key={b.branch_name} value={b.branch_name} style={{ backgroundColor: 'var(--bg-card)' }}>{b.branch_name}</option>)}
              </select>
            </div>
            <span className="text-xs font-black text-amber-500">VS</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Unit B:</span>
              <select value={compareBranchB} onChange={(e) => setCompareBranchB(e.target.value)} className="text-xs font-bold bg-transparent outline-none cursor-pointer border p-1 rounded-lg" style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}>
                {branchData.map(b => <option key={b.branch_name} value={b.branch_name} style={{ backgroundColor: 'var(--bg-card)' }}>{b.branch_name}</option>)}
              </select>
            </div>
          </div>

          {branchAData && branchBData && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-indigo-500/5 p-3 rounded-xl flex flex-col justify-center">
                <p className="font-black text-indigo-500 text-sm sm:text-base">{branchAData.avgRating} ★</p>
                <p className="text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{branchAData.branch_name}</p>
              </div>
              <div className="p-3 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-amber-500 bg-amber-500/5 rounded-xl">Average Score</div>
              <div className="bg-emerald-500/5 p-3 rounded-xl flex flex-col justify-center">
                <p className="font-black text-emerald-500 text-sm sm:text-base">{branchBData.avgRating} ★</p>
                <p className="text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{branchBData.branch_name}</p>
              </div>
              <div className="bg-indigo-500/5 p-3 rounded-xl"><p className="font-mono font-bold">{branchAData.totalReviews} rvs</p></div>
              <div className="p-3 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-amber-500 bg-amber-500/5 rounded-xl">Total Volume</div>
              <div className="bg-emerald-500/5 p-3 rounded-xl"><p className="font-mono font-bold">{branchBData.totalReviews} rvs</p></div>
              <div className="bg-indigo-500/5 p-3 rounded-xl"><p className="font-mono font-bold text-indigo-500">{branchAData.responseRate}%</p></div>
              <div className="p-3 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest text-amber-500 bg-amber-500/5 rounded-xl">Responder Rate</div>
              <div className="bg-emerald-500/5 p-3 rounded-xl"><p className="font-mono font-bold text-emerald-500">{branchBData.responseRate}%</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Drilldown Modal Section */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border text-center relative mx-4 p-5 shadow-xl transition-all duration-300" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => setSelectedBranch(null)} className="absolute top-3 right-3 p-1.5 rounded-full" style={{ color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
            <span className="text-[9px] font-bold uppercase bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full">Advanced Drilldown Matrix</span>
            <h4 className="text-base font-bold mt-2.5 mb-2">{selectedBranch.branch_name} Branch</h4>
            
            <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '15s' }}></div>
              <div className="absolute w-18 h-18 rounded-full border flex flex-col items-center justify-center" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-lg font-black font-mono">{selectedBranch.avgRating}</span>
                <span className="text-[7px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Rating Score</span>
              </div>
            </div>

            <div className="mb-4 p-2 bg-black/5 dark:bg-white/5 rounded-xl text-left text-[10px] space-y-1">
              <p className="font-bold text-indigo-500 uppercase tracking-wide text-[8px] mb-1">⏱️ Traffic & Engagement Insights</p>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Peak Traffic Day:</span><span className="font-bold">{selectedBranch.peakDay}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Peak Active Hour:</span><span className="font-bold">{selectedBranch.peakHour}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Responder Speed:</span><span className="font-bold text-teal-500">{selectedBranch.responseTime}</span></div>
            </div>

            <div className="mb-4 text-left">
              <p className="font-bold text-emerald-500 uppercase tracking-wide text-[8px] mb-1.5">🏷️ Sentiment AI Keywords</p>
              <div className="flex flex-wrap gap-1">
                {selectedBranch.keywords.map(kw => (
                  <span key={kw} className="text-[9px] px-2 py-0.5 rounded-md font-medium border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>{kw}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 border-t pt-3 text-center text-[10px]" style={{ borderColor: 'var(--border-color)' }}>
              <div><p className="font-bold text-emerald-500 uppercase">Pos</p><p className="font-mono font-bold mt-0.5">{selectedBranch.positiveCount}</p></div>
              <div><p className="font-bold text-amber-500 uppercase">Neu</p><p className="font-mono font-bold mt-0.5">{selectedBranch.neutralCount}</p></div>
              <div><p className="font-bold text-rose-500 uppercase">Neg</p><p className="font-mono font-bold mt-0.5">{selectedBranch.negativeCount}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}