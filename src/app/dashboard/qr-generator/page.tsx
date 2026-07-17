'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Settings, Layout, Printer, Image, Link2, BarChart3, Users, Percent, TrendingUp, Cpu, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface BranchConfig {
  url: string;
  color: string;
  template: string;
  paperSize: string;
  logo: string | null;
}

interface SmartQRGeneratorProps {
  realTimeMetrics?: {
    [branchId: string]: {
      all: { totalScans: number; uniqueUsers: number; conversionRate: string; chartData: number[] };
      digital: { totalScans: number; uniqueUsers: number; conversionRate: string; chartData: number[] };
      print: { totalScans: number; uniqueUsers: number; conversionRate: string; chartData: number[] };
    };
  };
}

export default function QRGeneratorPage({ realTimeMetrics }: SmartQRGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Starter'); // 🟢 ဒီစာကြောင်းကို ထည့်ပေးပါ

  const branches = [
    { id: 'hledan', name: 'Hledan Branch', defaultUrl: 'feedback.smartnode.com/hledan' },
    { id: 'chanthar', name: 'Chanthar Branch', defaultUrl: 'feedback.smartnode.com/chanthar' },
    { id: 'yankin', name: 'Yankin Branch', defaultUrl: 'feedback.smartnode.com/yankin' }
  ];

  // REAL SAVED STATE (REAL DATA)
  const [branchConfigs, setBranchConfigs] = useState<{ [key: string]: BranchConfig }>({
    hledan: { url: 'feedback.smartnode.com/hledan', color: '#6366f1', template: 'minimal', paperSize: 'A6', logo: null },
    chanthar: { url: 'feedback.smartnode.com/chanthar', color: '#10b981', template: 'minimal', paperSize: 'A6', logo: null },
    yankin: { url: 'feedback.smartnode.com/yankin', color: '#f59e0b', template: 'minimal', paperSize: 'A6', logo: null },
  });

  const [selectedBranchId, setSelectedBranchId] = useState('hledan');
  const [activeRightPanel, setActiveRightPanel] = useState<'analytics' | 'design'>('analytics');
  const [activeOutputTab, setActiveOutputTab] = useState<'digital' | 'print'>('digital');
  const [analyticsFilter, setAnalyticsFilter] = useState<'all' | 'digital' | 'print'>('all');

  // REAL-TIME INPUT STATES
  const [inputUrl, setInputUrl] = useState('feedback.smartnode.com/hledan');
  const [inputColor, setInputColor] = useState('#6366f1');
  const [inputTemplate, setInputTemplate] = useState('minimal');
  const [inputPaperSize, setInputPaperSize] = useState('A6');
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);

  // UNSAVED TRACKING STATES & PREMIUM CUSTOM MODAL
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingBranchId, setPendingBranchId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const activeConf = branchConfigs[selectedBranchId];
    if (activeConf) {
      setInputUrl(activeConf.url);
      setInputColor(activeConf.color);
      setInputTemplate(activeConf.template);
      setInputPaperSize(activeConf.paperSize);
      setUploadedLogo(activeConf.logo);
      setIsDirty(false); 
    }
  }, [selectedBranchId, branchConfigs]);

  useEffect(() => {
    const activeConf = branchConfigs[selectedBranchId];
    if (activeConf) {
      if (
        inputUrl !== activeConf.url ||
        inputColor !== activeConf.color ||
        inputTemplate !== activeConf.template ||
        inputPaperSize !== activeConf.paperSize ||
        uploadedLogo !== activeConf.logo
      ) {
        setIsDirty(true);
      } else {
        setIsDirty(false);
      }
    }
  }, [inputUrl, inputColor, inputTemplate, inputPaperSize, uploadedLogo, selectedBranchId, branchConfigs]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Unsaved changes detected.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const currentBranchName = branches.find(b => b.id === selectedBranchId)?.name || 'Hledan Branch';
  
  const activeMetrics = realTimeMetrics?.[selectedBranchId]?.[analyticsFilter] || { 
    totalScans: 0, 
    uniqueUsers: 0, 
    conversionRate: '0%', 
    chartData: [0, 0, 0, 0, 0, 0, 0] 
  };

  const getTrackingUrl = (type: 'digital' | 'print') => {
    let baseUrl = inputUrl.trim();
    if (!baseUrl) {
      baseUrl = branches.find(b => b.id === selectedBranchId)?.defaultUrl || 'feedback.smartnode.com';
    }
    const fullUrl = `https://${baseUrl}`;
    const connector = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${connector}utm_src=smartnode_${type}`;
  };

  const handleBranchChangeRequest = (nextBranchId: string) => {
    if (isDirty) {
      setPendingBranchId(nextBranchId);
      setShowSaveModal(true); 
    } else {
      setSelectedBranchId(nextBranchId);
    }
  };

  const executeSave = (targetBranchId: string, callback?: () => void) => {
    setBranchConfigs(prev => ({
      ...prev,
      [targetBranchId]: {
        url: inputUrl,
        color: inputColor,
        template: inputTemplate,
        paperSize: inputPaperSize,
        logo: uploadedLogo
      }
    }));
    setIsDirty(false);
    if (callback) callback();
  };

  const handleHardwareSync = () => {
    setIsGenerating(true);
    setTimeout(() => {
      executeSave(selectedBranchId);
      setIsGenerating(false);
    }, 2000);
  };

  const handleModalSaveAndGo = () => {
    if (pendingBranchId) {
      executeSave(selectedBranchId, () => {
        setSelectedBranchId(pendingBranchId);
        setShowSaveModal(false);
        setPendingBranchId(null);
      });
    }
  };

  const handleModalDiscardAndGo = () => {
    if (pendingBranchId) {
      setIsDirty(false);
      setSelectedBranchId(pendingBranchId);
      setShowSaveModal(false);
      setPendingBranchId(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setUploadedLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePrintFrame = () => window.print();

  const handleDigitalDownload = () => {
    const canvas = document.getElementById('real-qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentBranchName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTemplateStyles = (type: string) => {
    switch (type) {
      case 'cyber':
        return {
          frameClass: 'border-4 border-dashed rounded-none p-6 bg-slate-950 text-cyan-400 relative',
          headerClass: 'font-mono tracking-widest text-sm font-black uppercase text-cyan-400',
          footerClass: 'border-t border-cyan-800 pt-2 font-mono text-[9px] text-cyan-500'
        };
      case 'classic':
        return {
          frameClass: 'border-[8px] double rounded-lg p-5 bg-stone-50 text-stone-900',
          headerClass: 'font-serif tracking-normal text-sm font-bold text-stone-800',
          footerClass: 'border-t-2 border-stone-300 pt-2 font-serif text-[10px] text-stone-600'
        };
      case 'corporate':
        return {
          frameClass: 'border-t-[16px] border-x border-b rounded-xl p-5 bg-white text-slate-900 shadow-md',
          headerClass: 'font-sans tracking-wide text-xs font-extrabold text-indigo-900 uppercase',
          footerClass: 'bg-slate-50 p-2 rounded-lg text-[9px] text-slate-500 font-semibold'
        };
      case 'elegant':
        return {
          frameClass: 'border-2 rounded-3xl p-6 bg-neutral-900 text-amber-400 border-amber-500/40',
          headerClass: 'font-serif tracking-loose text-xs italic font-medium text-amber-300',
          footerClass: 'font-serif text-[9px] text-amber-500/70 tracking-widest'
        };
      case 'minimal':
      default:
        return {
          frameClass: 'border rounded-2xl p-5 bg-white text-slate-900 shadow-sm border-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800/80',
          headerClass: 'font-sans tracking-widest text-xs font-black text-slate-800 uppercase dark:text-slate-200',
          footerClass: 'text-[9px] text-slate-400 font-medium dark:text-slate-500'
        };
    }
  };

  const getPaperDimensions = (size: string) => {
    switch (size) {
      case 'A4': return 'w-[320px] h-[450px]';
      case 'A5': return 'w-[280px] h-[390px]';
      case 'A6': default: return 'w-[240px] h-[340px]';
    }
  };

  if (!isMounted) return null;
  const currentStyle = getTemplateStyles(inputTemplate);
  const currentDimension = getPaperDimensions(inputPaperSize);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 transition-colors duration-300 print:bg-white print:p-0 bg-transparent" style={{ color: 'var(--text-main)' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes chartGrow { from { height: 0%; opacity: 0; } to { opacity: 1; } }
        .animate-chart-grow { animation: chartGrow 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes laserMove { 0% { top: 0%; opacity: 1; } 50% { top: 100%; opacity: 1; } 100% { top: 0%; opacity: 1; } }
        .animate-laser-line {
          position: absolute; left: 0; width: 100%; height: 4px;
          background: linear-gradient(to right, transparent, ${inputColor}, transparent);
          box-shadow: 0 0 14px ${inputColor}, 0 0 6px ${inputColor};
          animation: laserMove 1.2s infinite ease-in-out; z-index: 40;
        }
        @media print {
          @page { size: ${inputPaperSize === 'A4' ? 'A4 portrait' : inputPaperSize === 'A5' ? 'A5 portrait' : 'A6 portrait'}; margin: 0; }
          body * { visibility: hidden; }
          #printable-counter-frame, #printable-counter-frame * { visibility: visible; }
          #printable-counter-frame { 
            position: absolute; left: 50%; top: 50%; 
            transform: translate(-50%, -50%) scale(${inputPaperSize === 'A4' ? '2.6' : inputPaperSize === 'A5' ? '1.8' : '1.2'});
            border: none !important; box-shadow: none !important; transform-origin: center center; 
          }
        }
      `}} />

      {/* 🔴 FIXED: 100% PREMIUM ENGLISH VERSION CUSTOM MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl transition-all animate-in fade-in zoom-in duration-200" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-main)' }}>Unsaved Changes Detected</h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  You have unsaved changes for this branch configuration. Would you like to save them before switching to another branch?
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2.5">
              <button 
                onClick={() => { setShowSaveModal(false); setPendingBranchId(null); }}
                className="px-4 py-2 text-xs font-bold rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{ color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleModalDiscardAndGo}
                className="px-4 py-2 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-colors"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleModalSaveAndGo}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full relative">

       {/* PREMIUM GLOBAL HEADER */}
        <div className="mb-6 pb-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <QrCode className="text-indigo-500 w-6 h-6" /> 
                Smart QR Generator & Analytics
              </h1>
              {isDirty && (
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
                  Unsaved Changes
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
              Dynamic tracking parameters integrated with SaaS Multi-channel Analytics.
            </p>
          </div>

          {/* 🟢 PLAN TEST SWITCHER (Global Header ညာဘက်အခြမ်းမှာ ပေါ်နေမှာဖြစ်ပါတယ်) */}
          <div className="flex gap-1 p-1 border rounded-xl bg-slate-500/5 text-[10px] h-fit sm:mt-auto" style={{ borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={() => setCurrentPlan('Starter')} className={`px-3 py-1.5 font-bold rounded-lg transition-all ${currentPlan === 'Starter' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>Starter</button>
            <button type="button" onClick={() => setCurrentPlan('Pro')} className={`px-3 py-1.5 font-bold rounded-lg transition-all ${currentPlan === 'Pro' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>Pro</button>
            <button type="button" onClick={() => setCurrentPlan('Enterprise')} className={`px-3 py-1.5 font-bold rounded-lg transition-all ${currentPlan === 'Enterprise' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>Enterprise</button>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex p-1 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
              <button 
                onClick={() => setActiveRightPanel('analytics')}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all ${activeRightPanel === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-indigo-500'}`}
                style={activeRightPanel !== 'analytics' ? { color: 'var(--text-muted)' } : {}}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Analytics Dashboard
              </button>
              <button 
                onClick={() => setActiveRightPanel('design')}
                className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all ${activeRightPanel === 'design' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:text-indigo-500'}`}
                style={activeRightPanel !== 'design' ? { color: 'var(--text-muted)' } : {}}
              >
                <Layout className="w-3.5 h-3.5" /> QR Frame Studio
              </button>
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden transition-all duration-300">
          
          {/* 🛠️ LEFT CONTROL PANEL */}
          {activeRightPanel === 'design' && (
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6 min-w-0 p-5 rounded-2xl border bg-transparent" style={{ borderColor: 'var(--border-color)' }}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <Settings className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>NODE SETTINGS</h2>
                </div>

                {/* Select Active Node Dropdown */}
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1.5" style={{ color: 'var(--text-muted)' }}>SELECT ACTIVE NODE</label>
                  <select
                    onChange={(e) => handleBranchChangeRequest(e.target.value)}
                    value={selectedBranchId}
                    className="w-full border rounded-xl px-3 py-2.5 text-xs outline-none font-semibold bg-transparent cursor-pointer"
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* URL Input Area */}
                <div>
                  <label className="text-[10px] font-bold uppercase flex items-center gap-1 mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Link2 className="w-3.5 h-3.5 text-indigo-500" /> BASE REDIRECT ENDPOINT URL
                  </label>
                  <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                    <span 
                      className="flex items-center justify-center px-3 text-xs font-bold font-mono border-r select-none"
                      style={{ 
                        borderColor: 'var(--border-color)', 
                        backgroundColor: 'var(--bg-card)', 
                        color: 'var(--text-muted)' 
                      }}
                    >
                      https://
                    </span>
                    <input
                      type="text"
                      value={inputUrl}
                      placeholder="feedback.smartnode.com/endpoint"
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs outline-none font-mono tracking-tight bg-transparent focus:border-indigo-500 transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                {/* Brand Styles Grid */}
                <div className="pt-2 border-t space-y-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* 🎨 BRAND COLOR */}
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        BRAND COLOR {currentPlan === 'Starter' ? '🔒' : ''}
                      </label>
                      <div 
                        className="flex items-center gap-2 p-1.5 rounded-xl border bg-transparent" 
                        style={{ borderColor: 'var(--border-color)', opacity: currentPlan === 'Starter' ? 0.6 : 1 }}
                        onClick={() => {
                          if (currentPlan === 'Starter') {
                            alert("🔒 Customizing brand color requires Pro or Enterprise Plan.");
                          }
                        }}
                      >
                        <input 
                          type="color" 
                          value={currentPlan === 'Starter' ? '#6366f1' : inputColor} 
                          onChange={(e) => setInputColor(e.target.value)} 
                          disabled={currentPlan === 'Starter'} 
                          className={`w-7 h-7 rounded-lg bg-transparent border-0 ${currentPlan === 'Starter' ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                        />
                        <span className="text-[10px] font-mono font-bold uppercase">
                          {currentPlan === 'Starter' ? '#6366F1' : inputColor}
                        </span>
                      </div>
                    </div>

                    {/* 🖼️ CENTER LOGO */}
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        CENTER LOGO {(currentPlan === 'Starter' || currentPlan === 'Pro') ? '🔒' : ''}
                      </label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => {
                          if (currentPlan === 'Starter' || currentPlan === 'Pro') return;
                          handleLogoUpload(e);
                        }} 
                        className="hidden" 
                        accept="image/*" 
                        disabled={currentPlan === 'Starter' || currentPlan === 'Pro'}
                      />
                      {uploadedLogo && currentPlan === 'Enterprise' ? (
                        <button onClick={clearLogo} className="w-full h-10 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl flex items-center justify-center text-[10px] font-bold px-2 gap-1 transition-all">✕ Clear Logo</button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (currentPlan === 'Starter' || currentPlan === 'Pro') {
                              alert(`🔒 Uploading custom brand logos inside QR code requires the Enterprise Plan. Your current plan is: ${currentPlan}`);
                              return;
                            }
                            fileInputRef.current?.click();
                          }} 
                          className={`w-full h-10 border rounded-xl flex items-center justify-center text-xs font-bold px-2 truncate transition-all ${
                            (currentPlan === 'Starter' || currentPlan === 'Pro')
                              ? 'bg-slate-500/5 text-slate-400 border-slate-500/20 cursor-not-allowed opacity-50' 
                              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20'
                          }`}
                        >
                          Upload PNG
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      QR TEMPLATES {currentPlan === 'Starter' ? '(1 Available 🔒)' : currentPlan === 'Pro' ? '(4 Available 🔒)' : '(All Unlocked ✅)'}
                    </label>
                    <select 
                      value={inputTemplate} 
                      onChange={(e) => {
                        const val = e.target.value;
                        
                        // 🔒 Starter Plan Check
                        if (currentPlan === 'Starter' && val !== 'minimal') {
                          alert("🔒 Premium QR Templates require the Pro or Enterprise Plan.");
                          return;
                        }
                        
                        // 🔒 Pro Plan Check (Cyberpunk က Enterprise သီးသန့်ဖြစ်လို့ တားဆီးရန်)
                        if (currentPlan === 'Pro' && val === 'cyber') {
                          alert("🔒 Cyberpunk Tech Node Template is exclusive to the Enterprise Plan.");
                          return;
                        }

                        setInputTemplate(val);
                      }} 
                      className="w-full bg-transparent border rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer" 
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                    >
                      <option value="minimal" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>Minimal Clean Stand</option>
                      <option value="classic" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>Classic Border Stand {currentPlan === 'Starter' ? '🔒' : ''}</option>
                      <option value="corporate" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>SaaS Corporate Layout {currentPlan === 'Starter' ? '🔒' : ''}</option>
                      <option value="elegant" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>Premium Elegant Style {currentPlan === 'Starter' ? '🔒' : ''}</option>
                      <option value="cyber" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>Cyberpunk Tech Node {(currentPlan === 'Starter' || currentPlan === 'Pro') ? '🔒' : ''}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase block mb-1.5" style={{ color: 'var(--text-muted)' }}>PRINT SHEET SIZE</label>
                    <select value={inputPaperSize} onChange={(e) => setInputPaperSize(e.target.value)} className="w-full bg-transparent border rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                      <option value="A6" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>A6 Size (Standard Stand)</option>
                      <option value="A5" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>A5 Size (Medium Sheet Layout)</option>
                      <option value="A4" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>A4 Size (Large Sheet Layout)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleHardwareSync} 
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs tracking-wider uppercase shadow-md active:scale-[0.99]"
              >
                <Cpu className="w-4 h-4" /> SAVE & SYNC TO HARDWARE
              </button>
            </div>
          )}

          {/* 📊 RIGHT VIEWPORT PANEL */}
          <div className={`${activeRightPanel === 'analytics' ? 'lg:col-span-12' : 'lg:col-span-8'} min-w-0 rounded-2xl border p-6 min-h-[520px] flex flex-col justify-between transition-all bg-transparent shadow-none`} style={{ borderColor: 'var(--border-color)' }}>
            
            {/* 📈 CASE 1: FULL WORKSPACE ANALYTICS DASHBOARD */}
            {activeRightPanel === 'analytics' && (
              <div className="space-y-6 w-full flex-1">
                <div className="flex justify-between items-center pb-2 border-b flex-wrap gap-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">SCAN METRICS LOG ({currentBranchName})</h3>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Real-time data feed filtering Across Live Active Fleet Nodes</p>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex p-1 rounded-lg border text-[10px] font-bold bg-transparent" style={{ borderColor: 'var(--border-color)' }}>
                      <button onClick={() => setAnalyticsFilter('all')} className={`px-3 py-1.5 rounded-md transition-all ${analyticsFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : ''}`}>All</button>
                      <button onClick={() => setAnalyticsFilter('digital')} className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${analyticsFilter === 'digital' ? 'bg-indigo-600 text-white shadow-sm' : ''}`}><Image className="w-2.5 h-2.5" /> Digital</button>
                      <button onClick={() => setAnalyticsFilter('print')} className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${analyticsFilter === 'print' ? 'bg-indigo-600 text-white shadow-sm' : ''}`}><Printer className="w-2.5 h-2.5" /> Print</button>
                    </div>

                   {/* 📅 🟢 Plan Block Logic with Native Element Access */}
                    <select 
                      defaultValue="today"
                      onChange={(e) => {
                        const val = e.target.value;
                        
                        // 🔒 Starter Plan: Past 30 Days နဲ့ All-Time ကို ပိတ်ခြင်း
                        if (currentPlan === 'Starter' && (val === 'month' || val === 'all')) {
                          alert(`🔒 Access Denied: Viewing '${val === 'month' ? 'Past 30 Days' : 'All-Time'}' statistics requires a Pro or Enterprise Plan.`);
                          e.target.value = "today"; // Starter ဖြစ်ရင် Filter ကို "Today" ဆီ ပြန်ပို့ပစ်ခြင်း
                          return;
                        }
                        
                        // 🔒 Pro Plan: All-Time ကို ပိတ်ခြင်း
                        if (currentPlan === 'Pro' && val === 'all') {
                          alert("🔒 Access Denied: Enterprise Level Scope Statistics (All-Time Data) requires the Enterprise Plan.");
                          e.target.value = "today"; // Pro ဖြစ်ရင် Filter ကို "Today" ဆီ ပြန်ပို့ပစ်ခြင်း
                          return;
                        }

                        // 💡 ဒီနေရာမှာ အစ်ကို့ရဲ့ မူရင်း Function နာမည်ကို လှမ်းခေါ်ရမှာ ဖြစ်ပါတယ်
                        // အကယ်၍ အလုပ်မလုပ်ရင် နည်းလမ်း (၂) ကို သုံးပေးပါဗျာ
                      }}
                      className="border rounded-lg px-2.5 py-1.5 text-[10px] outline-none font-bold bg-transparent cursor-pointer"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
                    >
                      <option value="today" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>Today</option>
                      <option value="week" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>Past 7 Days</option>
                      <option value="month" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                        Past 30 Days {currentPlan === 'Starter' ? '🔒' : ''}
                      </option>
                      <option value="all" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}>
                        System Scope: All-Time {(currentPlan === 'Starter' || currentPlan === 'Pro') ? '🔒' : ''}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border bg-transparent" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>TOTAL SCANS LOGGED</p>
                    <h3 className="text-xl font-black mt-1 text-indigo-600 dark:text-indigo-400 font-mono">{activeMetrics.totalScans}</h3>
                    <p className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5 font-bold"><TrendingUp className="w-3 h-3" /> Live Feed Active</p>
                  </div>

                  <div className="p-4 rounded-xl border bg-transparent" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>UNIQUE DEVICES</p>
                    <h3 className="text-xl font-black mt-1 font-mono">{activeMetrics.uniqueUsers}</h3>
                    <p className="text-[9px] text-blue-600 flex items-center gap-0.5 mt-0.5 font-bold"><Activity className="w-3 h-3 animate-pulse" /> Active Node</p>
                  </div>

                  <div className="p-4 rounded-xl border bg-transparent" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>CONV. RATE</p>
                    <h3 className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400 font-mono">{activeMetrics.conversionRate}</h3>
                    <p className="text-[9px] text-emerald-600 flex items-center gap-0.5 mt-0.5 font-bold"><ShieldCheck className="w-3 h-3" /> Integrity Secure</p>
                  </div>
                </div>

                {/* CHART WORKSPACE */}
                <div className="p-5 rounded-2xl border bg-transparent" style={{ borderColor: 'var(--border-color)' }}>
                  <div key={`${selectedBranchId}_${analyticsFilter}`} className="flex flex-col">
                    <div className="h-32 flex items-end justify-between px-2 gap-2 sm:gap-4">
                      {activeMetrics.chartData.map((val: number, idx: number) => {
                        const percentHeight = val > 0 ? (val / 150) * 100 : 0;
                        return (
                          <div key={idx} className="w-full flex flex-col items-center group relative h-full justify-end">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold font-mono px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-30">
                              {val} Scans
                            </div>
                            <div className="w-full bg-slate-200/20 dark:bg-slate-800/20 rounded-t-lg relative h-full flex items-end">
                              <div style={{ height: `${Math.min(percentHeight, 100)}%` }} className="w-full rounded-t-sm bg-gradient-to-t from-indigo-600 to-purple-400 animate-chart-grow" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between px-2 mt-8 pb-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                        <div key={idx} className="w-full text-center">
                          <span className="text-[10px] font-bold font-sans uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🖼️ CASE 2: LIVE PREVIEW DESIGN STUDIO */}
            {activeRightPanel === 'design' && (
              <div className="w-full h-full flex flex-col items-center justify-center flex-1">
                <div className="w-full flex flex-col items-center">
                  <div className="w-full flex items-center justify-center gap-1 p-1 bg-transparent rounded-full mb-6 border max-w-xs text-[11px] font-bold" style={{ borderColor: 'var(--border-color)' }}>
                    <button onClick={() => setActiveOutputTab('digital')} className={`flex items-center gap-1 w-1/2 justify-center py-1.5 rounded-full ${activeOutputTab === 'digital' ? 'bg-indigo-600 text-white shadow-md' : ''}`} style={activeOutputTab !== 'digital' ? { color: 'var(--text-muted)' } : {}}><Image className="w-3.5 h-3.5" /> Digital Asset</button>
                    <button onClick={() => setActiveOutputTab('print')} className={`flex items-center gap-1 w-1/2 justify-center py-1.5 rounded-full ${activeOutputTab === 'print' ? 'bg-indigo-600 text-white shadow-md' : ''}`} style={activeOutputTab !== 'print' ? { color: 'var(--text-muted)' } : {}}><Printer className="w-3.5 h-3.5" /> Print Layout</button>
                  </div>

                  {activeOutputTab === 'digital' && (
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-5 rounded-xl shadow-xl border border-slate-200 relative overflow-hidden">
                        {isGenerating && <div className="animate-laser-line" />}
                        <QRCodeCanvas id="real-qr-canvas" value={getTrackingUrl('digital')} size={150} level="H" fgColor={currentPlan === 'Starter' ? '#6366f1' : inputColor} bgColor="#ffffff" imageSettings={uploadedLogo ? { src: uploadedLogo, height: 34, width: 34, excavate: true } : undefined} />
                      </div>
                      <button onClick={handleDigitalDownload} className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Export Asset (PNG)</button>
                    </div>
                  )}

                  {activeOutputTab === 'print' && (
                    <div className="flex flex-col items-center w-full">
                      <div id="printable-counter-frame" className={`${currentDimension} ${currentStyle.frameClass} flex flex-col items-center justify-between text-center transition-all duration-300 relative overflow-hidden`} style={inputTemplate === 'minimal' || inputTemplate === 'classic' || inputTemplate === 'corporate' ? { borderColor: inputColor } : {}}>
                        {isGenerating && <div className="animate-laser-line" />}
                        <div className="w-full space-y-0.5 mt-1">
                          <h3 className={`${currentStyle.headerClass}`}>{inputTemplate === 'cyber' ? '// NODE_ACCESS' : 'SCAN & REVIEW'}</h3>
                          <p className="text-[8px] tracking-wider opacity-60 font-bold uppercase">Feedback System</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl my-2 border border-slate-100 shadow-sm inline-block">
                          <QRCodeCanvas id="final-print-canvas" value={getTrackingUrl('print')} size={inputPaperSize === 'A4' ? 140 : inputPaperSize === 'A5' ? 120 : 100} level="H" fgColor={currentPlan === 'Starter' ? '#6366f1' : inputColor} bgColor="#ffffff" imageSettings={uploadedLogo ? { src: uploadedLogo, height: 30, width: 30, excavate: true } : undefined} />
                        </div>
                        <div className="w-full space-y-1">
                          <div className={currentStyle.footerClass}>
                            <p className="font-bold opacity-70">Location Node</p>
                            <p className="text-xs font-black tracking-tight">{currentBranchName}</p>
                          </div>
                          <div className="text-[8px] opacity-40 font-mono font-bold">Target Sheet: {inputPaperSize} Size</div>
                        </div>
                      </div>
                      <button onClick={handlePrintFrame} className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl text-xs shadow-md flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> Print Layout</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}