"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Radio, 
  Activity, 
  HelpCircle,
  RefreshCw,
  Sliders,
  Sparkles,
  Database,
  ArrowUpRight
} from "lucide-react";

// --- Data Contracts Definition ---
interface IntegrationApp {
  id: string;
  name: string;
  category: "Communication" | "Finance" | "CRM" | "Marketing";
  description: string;
  status: "Connected" | "Disconnected";
  lastSynced: string;
  developer: string;
  version: string;
}

interface WebhookTelemetryLog {
  id: string;
  app: string;
  event: string;
  statusCode: number;
  timeAgo: string;
  payloadSize: string;
}

export default function IntegrationsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Reactive Applications Database State ---
  const [apps, setApps] = useState<IntegrationApp[]>([
    { id: "INT-SLK", name: "Slack Notifications", category: "Communication", description: "Stream localized brand alerts, negative feedback spikes, and critical AI diagnostic sequences directly into choice channels.", status: "Connected", lastSynced: "Just now", developer: "RepSaaS Lab", version: "v2.4.0" },
    { id: "INT-QBK", name: "QuickBooks Online", category: "Finance", description: "Synchronize localized corporate accounting ledgers, franchise billing matrices, and invoice cycles seamlessly inside standard safety guidelines.", status: "Disconnected", lastSynced: "3 days ago", developer: "Intuit Certified", version: "v1.9.2" },
    { id: "INT-HUB", name: "HubSpot CRM Link", category: "CRM", description: "Inject positive customer feedback events directly into customer profiles to automate retention micro-campaigns safely.", status: "Connected", lastSynced: "12 mins ago", developer: "HubSpot Official", version: "v3.1.1" },
    { id: "INT-MAL", name: "Mailchimp Vector", category: "Marketing", description: "Sync customer feedback clusters with targeting lists to automate smart marketing newsletter drips with zero human friction.", status: "Disconnected", lastSynced: "Never connected", developer: "RepSaaS Lab", version: "v1.0.4" },
  ]);

  // --- Telemetry Event Stream State ---
  const [telemetryLogs, setTelemetryLogs] = useState<WebhookTelemetryLog[]>([
    { id: "TX-9081", app: "Slack Notifications", event: "webhook.risk_alert_fired", statusCode: 200, timeAgo: "1m ago", payloadSize: "2.4 KB" },
    { id: "TX-9080", app: "HubSpot CRM Link", event: "crm.customer_profile_updated", statusCode: 201, timeAgo: "12m ago", payloadSize: "5.1 KB" },
    { id: "TX-9079", app: "Slack Notifications", event: "webhook.weekly_analytics_digest", statusCode: 200, timeAgo: "1h ago", payloadSize: "14.8 KB" },
  ]);

  // --- 1. Toggle Switch Active Logic Mechanics ---
  const handleToggleConnection = (id: string) => {
    setApps(prevApps => prevApps.map(app => {
      if (app.id === id) {
        const nextStatus = app.status === "Connected" ? "Disconnected" : "Connected";
        
        // Fix: Generate guaranteed unique timestamp-backed IDs to eliminate React key duplicate bugs
        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
        const transactionId = `TX-${uniqueSuffix}`;
        
        const newLog: WebhookTelemetryLog = {
          id: transactionId,
          app: app.name,
          event: nextStatus === "Connected" ? "system.integration_established" : "system.integration_revoked",
          statusCode: nextStatus === "Connected" ? 200 : 204,
          timeAgo: "Just now",
          payloadSize: "1.1 KB"
        };
        
        setTelemetryLogs(prevLogs => [newLog, ...prevLogs]);
        return { ...app, status: nextStatus, lastSynced: nextStatus === "Connected" ? "Just now" : app.lastSynced };
      }
      return app;
    }));
  };

  // --- 2. Global Sync Simulation Loop Engine ---
  const triggerGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
      const transactionId = `TX-${uniqueSuffix}`;
      setTelemetryLogs(prev => [{
        id: transactionId,
        app: "Global Sync Engine",
        event: "cluster.force_sync_completed",
        statusCode: 200,
        timeAgo: "Just now",
        payloadSize: "42.1 KB"
      }, ...prev]);
    }, 1200);
  };

  // --- Memory Performance Filter Pipelines ---
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [apps, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* TOP OPERATIONS MANAGEMENT CONTROLS PANEL */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cloud software configurations, webhooks, hooks pipelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white font-semibold transition-colors"
            />
          </div>

          <div className="relative">
            <Sliders className="absolute left-3 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none appearance-none font-bold text-slate-600 dark:text-slate-300 cursor-pointer w-full sm:w-44"
            >
              <option value="all">All Ecosystems</option>
              <option value="Communication">Communication</option>
              <option value="Finance">Finance</option>
              <option value="CRM">CRM</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none appearance-none font-bold text-slate-600 dark:text-slate-300 cursor-pointer w-full sm:w-40"
            >
              <option value="all">All Connection States</option>
              <option value="Connected">Connected Only</option>
              <option value="Disconnected">Inactive Only</option>
            </select>
          </div>
        </div>

        <button 
          onClick={triggerGlobalSync}
          disabled={isSyncing}
          className="bg-slate-950 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-500" : ""}`} />
          {isSyncing ? "Synchronizing Gateways..." : "Sync Webhook Web Vectors"}
        </button>
      </div>

      {/* TWIN GRID SYSTEM ARCHITECTURE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN PANEL: APPLICATIONS CARDS INTERFACE */}
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <div 
                  key={app.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 relative overflow-hidden group"
                >
                  {app.status === "Connected" && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300"></div>
                  )}

                  <div>
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          app.status === "Connected" 
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" 
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {app.name === "Slack Notifications" ? <Radio className="w-5 h-5" /> : app.name[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            {app.name}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                            {app.category}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleConnection(app.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shadow-inner p-0.5 ${
                          app.status === "Connected" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                        }`}
                        aria-label={`Toggle connection status for ${app.name}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-out ${
                          app.status === "Connected" ? "translate-x-5" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                      {app.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Activity className={`w-3 h-3 ${app.status === "Connected" ? "text-emerald-500" : "text-slate-300"}`} />
                      Synced: <span className="text-slate-600 dark:text-slate-300 font-bold">{app.lastSynced}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200/10">
                      {app.version}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-medium">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" /> No enterprise integrations software matched active filter bounds.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN PANEL: LIVE LOGS TELEMETRY STREAM CONSOLE (FIXED TO WHITE/LIGHT MODE) */}
        <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between shadow-xs relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Sidebar Module Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white font-mono">Live Webhook Log Feed</span>
              </div>
              <span className="text-[9px] font-mono font-black text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full animate-pulse border border-emerald-500/20 uppercase tracking-widest">
                Listening
              </span>
            </div>

            {/* Micro Event Transaction Scroll Stream Loop */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {telemetryLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl space-y-1.5 font-mono text-[11px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-200 truncate max-w-[140px] flex items-center gap-1">
                      <Database className="w-3 h-3 text-slate-400" /> {log.app}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 rounded ${
                      log.statusCode >= 200 && log.statusCode < 300 
                        ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" 
                        : "text-rose-600 bg-rose-500/10 dark:text-rose-400"
                    }`}>
                      HTTP {log.statusCode}
                    </span>
                  </div>
                  
                  <p className="text-amber-600 dark:text-amber-400 font-semibold text-xs truncate">
                    {log.event}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/40">
                    <span>ID: {log.id} • {log.payloadSize}</span>
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> {log.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Developer Guide Alert Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                Need customized custom software vectors? Read our <span className="text-amber-600 dark:text-amber-400 font-bold underline cursor-pointer hover:text-amber-700 dark:hover:text-amber-300 transition-colors">Developer Webhooks Documentation</span> matrix.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}