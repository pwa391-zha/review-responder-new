"use client";

import React, { useState, useMemo } from "react";
import { 
  UserPlus, 
  ShieldCheck, 
  Search, 
  UserX,
  History, 
  Terminal,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  Mail,
  ShieldAlert,
  HelpCircle,
  X
} from "lucide-react";

// --- Types Definitions ---
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Branch Manager" | "Review Responder" | "Analyst";
  branch: string;
  status: "Active" | "Suspended";
  joinedDate: string;
}

interface AuditLog {
  id: string;
  operator: string;
  action: string;
  target: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
  ip: string;
}

export default function UserManagementTab() {
  // Main inner state orchestration
  const [activeSubTab, setActiveSubTab] = useState<"roles" | "audits">("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  // Modal Interactive States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "Review Responder" as StaffMember["role"],
    branch: "Downtown Headquarters"
  });

  // --- Reactive Database States (Fully Functional App Memory) ---
  const [teamMembers, setTeamMembers] = useState<StaffMember[]>([
    { id: "USR-001", name: "Aung Kyaw", email: "aungkyaw@repsaas.com", role: "Super Admin", branch: "All Branches", status: "Active", joinedDate: "2025-01-12" },
    { id: "USR-002", name: "Thiri Shwe", email: "thiri.s@repsaas.com", role: "Branch Manager", branch: "Downtown HQ", status: "Active", joinedDate: "2025-06-20" },
    { id: "USR-003", name: "Min Thant", email: "minthant@repsaas.com", role: "Review Responder", branch: "Westside Retail Hub", status: "Active", joinedDate: "2026-02-15" },
    { id: "USR-004", name: "Hsu Myat", email: "hsumyat@repsaas.com", role: "Analyst", branch: "North Pier Logistics", status: "Suspended", joinedDate: "2026-04-02" },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "LOG-9801", operator: "Aung Kyaw", action: "Modified Access Permissions", target: "Hsu Myat (Account Suspended)", timestamp: "2026-07-06 18:42", severity: "high", ip: "192.168.1.45" },
    { id: "LOG-9802", operator: "Thiri Shwe", action: "Executed Artificial Intelligence Auto-Replies", target: "Google Reviews Package (Downtown HQ)", timestamp: "2026-07-06 17:15", severity: "low", ip: "192.168.1.12" },
    { id: "LOG-9803", operator: "Min Thant", action: "Exported System Analytics Log Bundle", target: "Westside Hub Revenue Dataset", timestamp: "2026-07-06 15:30", severity: "medium", ip: "192.168.3.89" },
    { id: "LOG-9804", operator: "Aung Kyaw", action: "Provisioned External Live Integration Vector", target: "Google Merchant API Framework", timestamp: "2026-07-06 11:12", severity: "high", ip: "192.168.1.45" },
  ]);

  // --- Real-time Core Functional Logic Mechanics ---
  
  // 1. Add New Staff Member Logic
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const newId = `USR-00${teamMembers.length + 1}`;
    const generatedStaff: StaffMember = {
      id: newId,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      branch: newStaff.branch,
      status: "Active",
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // System Event Auto-Logger Engine Injection
    const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
    const autoAudit: AuditLog = {
      id: logId,
      operator: "Current Admin",
      action: `Provisioned New User Account (${newStaff.role})`,
      target: `${newStaff.name} (${newStaff.email})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      severity: "medium",
      ip: "127.0.0.1 (Local session)"
    };

    setTeamMembers([generatedStaff, ...teamMembers]);
    setAuditLogs([autoAudit, ...auditLogs]);
    setIsAddModalOpen(false);
    setNewStaff({ name: "", email: "", role: "Review Responder", branch: "Downtown Headquarters" });
  };

  // 2. Toggle Status (Active / Suspend) Logic Trigger
  const handleToggleStatus = (id: string) => {
    setTeamMembers(prev => prev.map(member => {
      if (member.id === id) {
        const nextStatus = member.status === "Active" ? "Suspended" : "Active";
        
        // Auto Inject into system stream logs
        const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
        const autoAudit: AuditLog = {
          id: logId,
          operator: "System Overlord",
          action: `Altered Security Access Status to ${nextStatus}`,
          target: `${member.name} (${member.id})`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          severity: nextStatus === "Suspended" ? "high" : "medium",
          ip: "127.0.0.1"
        };
        setAuditLogs(prevLogs => [autoAudit, ...prevLogs]);
        
        return { ...member, status: nextStatus };
      }
      return member;
    }));
  };

  // 3. Dynamic Inline Role Shifting Logic Engine
  const handleRoleShift = (id: string, nextRole: StaffMember["role"]) => {
    setTeamMembers(prev => prev.map(member => {
      if (member.id === id) {
        const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
        setAuditLogs(prevLogs => [{
          id: logId,
          operator: "System Overlord",
          action: `Elevated / Shifted Role Metric to ${nextRole}`,
          target: `${member.name}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          severity: "high",
          ip: "127.0.0.1"
        }, ...prevLogs]);

        return { ...member, role: nextRole };
      }
      return member;
    }));
  };

  // --- Memory Optimized Search and Filtering Pipelines ---
  const filteredStaff = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.branch.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchTerm, roleFilter]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.operator.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [auditLogs, searchTerm, severityFilter]);

  return (
    <div className="space-y-6 relative">
      
      {/* =========================================================================
          PREMIUM NAVIGATION TAB CONTROLLER BAR 
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full sm:w-auto border border-slate-200/30 dark:border-slate-800">
          <button
            onClick={() => { setActiveSubTab("roles"); setSearchTerm(""); }}
            className={`flex items-center justify-center gap-2.5 py-2 px-5 text-xs font-bold rounded-lg transition-all duration-300 transform active:scale-98 ${
              activeSubTab === "roles"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 transition-transform duration-500 ${activeSubTab === "roles" ? "rotate-360 text-indigo-600 dark:text-indigo-400" : ""}`} /> 
            Team Roles & Collaboration
          </button>
          <button
            onClick={() => { setActiveSubTab("audits"); setSearchTerm(""); }}
            className={`flex items-center justify-center gap-2.5 py-2 px-5 text-xs font-bold rounded-lg transition-all duration-300 transform active:scale-98 ${
              activeSubTab === "audits"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <History className={`w-4 h-4 transition-transform duration-500 ${activeSubTab === "audits" ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""}`} /> 
            Live Security Audit Logs
          </button>
        </div>

        {/* Global Live Stream Counter Metric */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="text-right">
            <span className="text-slate-900 dark:text-white font-extrabold block">{teamMembers.length} Accounts Active</span>
            <span className="text-[10px]">Real-time synchronization loop</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB PANEL ONE: STAFF ROLES GOVERNANCE INTERFACE
          ========================================================================= */}
      {activeSubTab === "roles" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          
          {/* Operations Context Controls Row */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              {/* Dynamic Live Input Filter */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter name, email, or operations hub..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-semibold transition-colors"
                />
              </div>
              {/* Inline Selection Dropdown Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none appearance-none font-bold text-slate-600 dark:text-slate-300 cursor-pointer w-full sm:w-44"
                >
                  <option value="all">All Roles Matrix</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Branch Manager">Branch Manager</option>
                  <option value="Review Responder">Review Responder</option>
                  <option value="Analyst">Analyst</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/10 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <UserPlus className="w-4 h-4" /> Provision New Staff Member
            </button>
          </div>

          {/* Secure Enterprise Database Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black bg-slate-50/50 dark:bg-slate-950/20">
                    <th className="py-3.5 pl-4">Personnel Cluster</th>
                    <th className="py-3.5 px-3">Role Authority Level</th>
                    <th className="py-3.5 px-3">Operations Hub Boundary</th>
                    <th className="py-3.5 px-3">Governance Status</th>
                    <th className="py-3.5 pr-4 text-right">System Configuration Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-indigo-50/20 dark:hover:bg-slate-800/30 transition-colors duration-200 group">
                        {/* Member Card Details Block */}
                        <td className="py-4 pl-4 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-xs ${
                            member.status === "Active" ? "bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400" : "bg-rose-50 text-rose-500 dark:bg-rose-950/20"
                          }`}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{member.name}</p>
                            <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {member.email}</span>
                          </div>
                        </td>

                        {/* Inline Role Shifting Cell Module */}
                        <td className="py-4 px-3">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleShift(member.id, e.target.value as StaffMember["role"])}
                            className="bg-slate-50 dark:bg-slate-950 text-[11px] font-bold py-1 px-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Branch Manager">Branch Manager</option>
                            <option value="Review Responder">Review Responder</option>
                            <option value="Analyst">Analyst</option>
                          </select>
                        </td>

                        {/* Operational Scope Cell */}
                        <td className="py-4 px-3 font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" /> {member.branch}
                        </td>

                        {/* Security State Banner Cell */}
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            member.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${member.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                            {member.status}
                          </span>
                        </td>

                        {/* Interactive Execution Action Buttons */}
                        <td className="py-4 pr-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleToggleStatus(member.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                member.status === "Active"
                                  ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400"
                                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400"
                              }`}
                            >
                              {member.status === "Active" ? (
                                <>
                                  <ShieldAlert className="w-3 h-3" /> Suspend
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3" /> Reinstate
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 font-medium bg-slate-50/50 dark:bg-transparent">
                        <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" /> No personnel records matching active query filters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB PANEL TWO: ENTERPRISE AUDIT EVENT RECORD STREAM
          ========================================================================= */}
      {activeSubTab === "audits" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          
          {/* Operations Context Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Query operator activity trails, hash IDs, or specific targeted modifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-semibold"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Terminal className="absolute left-3 top-3 h-3 w-3 text-slate-400 pointer-events-none" />
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none appearance-none font-bold text-slate-600 dark:text-slate-300 cursor-pointer w-full"
              >
                <option value="all">All Severity Streams</option>
                <option value="high">Critical Severity [High]</option>
                <option value="medium">Standard Operation [Medium]</option>
                <option value="low">Subtle Telemetry [Low]</option>
              </select>
            </div>
          </div>

          {/* Chronological Event Pipeline Terminal Display */}
          <div className="space-y-2.5">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-all duration-200 hover:translate-x-1 ${
                    log.severity === "high" 
                      ? "bg-rose-500/5 border-rose-500/20 shadow-xs shadow-rose-500/2" 
                      : log.severity === "medium"
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-3xs"
                  }`}
                >
                  {/* Left Side: System Operator Context Meta */}
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      log.severity === "high" 
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400" 
                        : log.severity === "medium"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {log.severity === "high" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        <span className="font-extrabold text-slate-900 dark:text-white underline decoration-slate-200 decoration-2">{log.operator}</span>
                        <span className="text-slate-400 dark:text-slate-500 mx-1.5">executed</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded-md text-[11px]">{log.action}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-semibold">
                        Target System Node Area: <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-1 py-0.5 rounded">{log.target}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Security Tracking Fingerprint Hash */}
                  <div className="flex items-center md:items-end flex-row md:flex-col justify-between md:justify-center border-t md:border-0 pt-2.5 md:pt-0 border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="font-mono font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-400 tracking-tight md:mb-1.5 shadow-3xs border border-slate-200/20">
                      {log.id}
                    </span>
                    <span className="font-medium">{log.timestamp} <span className="mx-1 text-slate-300">•</span> {log.ip}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 font-medium">
                <Terminal className="w-8 h-8 text-slate-300 mx-auto mb-2" /> No security transaction hashes matched your scope search query parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE PROVISIONING INLINE SLIDE MODAL WINDOW
          ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Navigation Window Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Provision Account Core</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Data Struct Submission Framework Form */}
            <form onSubmit={handleCreateStaff} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wide text-[10px] mb-1.5">Staff Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mg Mg"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wide text-[10px] mb-1.5">Secure Corporate Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@repsaas.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wide text-[10px] mb-1.5">Authority Matrix Role</label>
                  <select 
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value as StaffMember["role"]})}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Review Responder">Review Responder</option>
                    <option value="Analyst">Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wide text-[10px] mb-1.5">Operational Branch Perimeter</label>
                  <select 
                    value={newStaff.branch}
                    onChange={(e) => setNewStaff({...newStaff, branch: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="All Branches">All Branches Scope</option>
                    <option value="Downtown HQ">Downtown HQ</option>
                    <option value="Westside Retail Hub">Westside Retail Hub</option>
                    <option value="North Pier Logistics">North Pier Logistics</option>
                  </select>
                </div>
              </div>

              {/* Action Operations Tray */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 mt-5">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-600/10"
                >
                  Inject Account Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}