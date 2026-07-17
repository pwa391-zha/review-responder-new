"use client";

import React, { useState } from "react";
import { Layers, Users, Sparkles, PlugZap, BarChart3 } from "lucide-react";
import AnalyticsAndAITab from "./AnalyticsAndAITab";
import UserManagementTab from "./UserManagementTab";
import IntegrationsTab from "./IntegrationsTab"; 
// ၁။ ကျွန်တော်တို့ အသစ်ဆောက်ထားတဲ့ Insights Component ဖိုင်ကို ဒီမှာ လှမ်းပြီး Import လုပ်ပါသည်
import EnterpriseInsightsTab from "./EnterpriseInsightsTab";

export default function EnterpriseSuitePage() {
  // ၂။ Type State ထဲမှာ "insights" ကိုပါ ရွေးချယ်နိုင်အောင် ထည့်သွင်းပေးလိုက်ပါသည်
  const [activeTab, setActiveTab] = useState<"analytics" | "user_management" | "integrations" | "insights">("analytics");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Premium Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <Layers className="w-5 h-5" />
            </div>
            Enterprise Control Suite
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            Predictive AI analytics, localized brand vectors, granular role governance, and synchronized external webhooks.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Live Stream Online
          </span>
        </div>
      </div>

      {/* Main Tab Switcher Menu Bar */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-x-6 gap-y-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 transform active:scale-98 ${
            activeTab === "analytics"
              ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Executive Analytics & AI
          {activeTab === "analytics" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>
          )}
        </button>

        {/* ၃။ ဤနေရာတွင် မီနူး Tab အသစ်ဖြစ်သော "Staff & Competitor Insights" ခလုတ်ကို ဖြည့်စွက်ထည့်သွင်းထားပါသည် */}
        <button
          onClick={() => setActiveTab("insights")}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 transform active:scale-98 ${
            activeTab === "insights"
              ? "text-amber-600 font-extrabold"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-500" />
          Staff & Competitor Insights
          <span className="text-[9px] uppercase font-black tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded ml-0.5 animate-pulse">
            New
          </span>
          {activeTab === "insights" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-amber-500 rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("user_management")}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 transform active:scale-98 ${
            activeTab === "user_management"
              ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          User Management (Roles & Audits)
          {activeTab === "user_management" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 transform active:scale-98 ${
            activeTab === "integrations"
              ? "text-indigo-600 dark:text-indigo-400 font-extrabold"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <PlugZap className="w-4 h-4 text-indigo-500" />
          Custom Integration Hub
          {activeTab === "integrations" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Mount Point Dashboard Render Framework */}
      <div className="mt-4">
        {activeTab === "analytics" && <AnalyticsAndAITab />}
        
        {/* ၄။ Active Tab က insights ဖြစ်နေပါက အသစ်ဖန်တီးထားသော Dashboard ကူးပြောင်းပြသပေးရန် Logic စနစ် ချိတ်ဆက်မှု */}
        {activeTab === "insights" && <EnterpriseInsightsTab />}
        
        {activeTab === "user_management" && <UserManagementTab />}
        {activeTab === "integrations" && <IntegrationsTab />}
      </div>
    </div>
  );
}