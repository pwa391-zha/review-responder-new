"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  GitCompare, 
  QrCode, 
  Sun, 
  Menu,
  Coins,       // အိုင်ကွန်အသစ်: Ledger Engine အတွက်
  Layers       // အိုင်ကွန်အသစ်: Enterprise Suite အတွက်
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 1. Theme Configuration Initialization & Sync
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 2. Real-time Dark/Light Mode Switcher
  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // --- အသစ်ဖြည့်စွက်ပြီး ချိတ်ဆက်ထားသော MENU ITEMS ---
  const menuItems = [
    { name: "Overview Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Branch Comparison", href: "/admin/comparison", icon: GitCompare },
    { name: "QR Code Generator", href: "/admin/qr-generator", icon: QrCode },
    
    // SECTION Divider ကဲ့သို့ ခွဲခြားနိုင်ရန်နှင့် လမ်းကြောင်းအသစ်များ ထည့်သွင်းခြင်း
    { name: "Ledger Engine (New)", href: "/admin/enterprise", icon: Coins },
    { name: "Enterprise Suite", href: "/admin/enterprise/suite", icon: Layers },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
      
      {/* Old Clean Design Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Reputation SaaS
            </span>
            <span className="text-[10px] ml-2 font-medium tracking-wider text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded-md">
              Admin Panel
            </span>
          </div>

          {/* Navigation Items Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // စာမျက်နှာ အတိအကျတူရင်သော်လည်းကောင်း၊ (သို့) Sub-path တွေထဲ ရောက်နေရင်လည်း Active ဖြစ်နေစေရန်
              const isActive = pathname === item.href;
              
              // Ledger Engine အသစ်အတွက် Special Highlight ပေးရန် ခွဲထုတ်ခြင်း
              const isNewEngine = item.href === "/admin/enterprise";

              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-white" : isNewEngine ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400"
                    }`} />
                    <span>{item.name}</span>
                  </div>

                  {/* Dashboard အသစ်အတွက် "New" Badge လေးပြပေးခြင်း (ပိုပြီး High-density ဆန်သွားစေရန်) */}
                  {isNewEngine && !isActive && (
                    <span className="text-[9px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wide border border-indigo-100 dark:border-indigo-900/40 animate-pulse">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Controls (Fixed Light/Dark Mode) */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800 space-y-1">
          <button 
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Sun className={`w-4 h-4 transition-transform duration-300 ${isDarkMode ? "text-slate-400 rotate-45" : "text-amber-500 scale-105"}`} /> 
            <span>{isDarkMode ? "Switch to Light Mode" : "Light Mode Enabled"}</span>
          </button>
          
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <Menu className="w-4 h-4" /> Menubar
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}