// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Review {
  id: number;
  created_at: string;
  rating: number;
  comment: string;
  business_name: string;
  branch_name: string;
  email: string;
  is_replied?: boolean;
}

interface BranchStat {
  name: string;
  averageRating: number;
  totalReviews: number;
  status: 'Excellent' | 'Good' | 'Critical';
}

interface TemplateStructure {
  id: string;
  name: string;
  subject: string;
  message: string;
}

interface StarPresets {
  1: TemplateStructure[];
  2: TemplateStructure[];
  3: TemplateStructure[];
  4: TemplateStructure[];
  5: TemplateStructure[];
}

export default function AdvancedAdminDashboard() {
  // ⚡ ၁။ အပေါ်ဆုံးမှာ React State တွေကို အရင်ထားရပါမယ် (ဒါမှ setTheme ကို သိမှာပါ)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // ⚡ ၂။ ပြီးရင် <body> ရဲ့ class ကို စောင့်ကြည့်မယ့် useEffect ကို ထားရပါမယ်
  useEffect(() => {
    const isDark = document.body.classList.contains('dark-mode-active') || localStorage.getItem('theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const updatedIsDark = document.body.classList.contains('dark-mode-active');
          setTheme(updatedIsDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  // 💎 Plan Tier ('Starter' | 'pro' | 'Enterprise') - TypeScript Error မတက်အောင် 'pro' ကို ဖြည့်စွက်သတ်မှတ်ပေးလိုက်ပါတယ်
 const [planTier, setPlanTier] = useState<'Starter' | 'Pro' | 'Enterprise'>('Enterprise');
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Enterprise');
  
  // ⚡ Auto-Pilot AI Automation Mode
  const [autoPilotMode, setAutoPilotMode] = useState<boolean>(false);
  const [autoProcessingIds, setAutoProcessingIds] = useState<number[]>([]);

  // Core Data States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartRendered, setChartRendered] = useState<boolean>(false); 

  // Pagination States (Items Per Page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Expanded Comments State
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});

  // Filters Matrix
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'neutral' | 'excellent'>('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Analytics Stats States
  const [totalIntercepted, setTotalIntercepted] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState(0);
  const [neutralInsights, setNeutralInsights] = useState(0);
  const [excellentReviews, setExcellentReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [averageRating, setAverageRating] = useState<number>(0);
  
  // Mapped Active Operational Branches
  const [branchStats, setBranchStats] = useState<BranchStat[]>([]);
  const [isNodeFullScreen, setIsNodeFullScreen] = useState<boolean>(false);

  // 🏢 Node Branch Directory Storage (Can be selected/re-added again after deletion)
  const availableSystemNodes = [
    { name: 'Main Branch', details: 'HQ - Core Center Operations Control', capacity: 'Enterprise Master' },
    { name: 'Hledan Branch', details: 'University Avenue Junction Center', capacity: 'Active Node 02' },
    { name: 'Mandalay Branch', details: 'Upper Myanmar Distribution Wing', capacity: 'Active Node 03' }
  ];

  // 🏢 Fixed Select modal trigger state
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
  
  // Premium Custom Remove Dialog State
  const [removeNodeDialog, setRemoveNodeDialog] = useState<{ open: boolean; branchName: string | null }>({
    open: false,
    branchName: null
  });

  // 📋 Full Screen Modal States (For Template Popups)
  const [fullScreenTarget, setFullScreenTarget] = useState<{ starKey: 1 | 2 | 3 | 4 | 5; index: number } | null>(null);

  // Default Template Pool
  const defaultPresets: StarPresets = {
    1: [
      { id: 'star1_1', name: '1★ Urgent Apology', subject: 'Sincere Apology regarding your experience - Alpha Dental Clinic', message: 'Hello,\n\nWe are deeply sorry for the 1-star experience at our {Branch} branch.\n\nRegarding your feedback: "{Comment}", we are taking immediate action.\n\nBest regards,\nManagement' },
      { id: 'star1_2', name: '1★ Manager Investigation', subject: 'Urgent: Clinic Manager Review - Alpha Dental Clinic', message: 'Hello,\n\nI am the General Manager. I noticed your 1-star rating about "{Comment}".\n\nI want to personally resolve this issue for you.\n\nSincerely,\nClinic Manager' },
      { id: 'star1_3', name: '1★ Service Recovery Offer', subject: 'Compensation Offer & Apology - Alpha Dental Clinic', message: 'Hello,\n\nWe want to make things right. Please accept our apology for the issues at {Branch}.\n\nWe would like to offer you a complimentary follow-up service.\n\nWarm regards,\nPatient Care Team' }
    ],
    2: [
      { id: 'star2_1', name: '2★ Standard Resolution', subject: 'Improving your experience - Alpha Dental Clinic', message: 'Hello,\n\nThank you for your feedback regarding {Branch}. We are sorry to hear we fell short during your visit.\n\nWe will improve based on your note: "{Comment}".\n\nBest regards,\nManagement Team' },
      { id: 'star2_2', name: '2★ Detailed Feedback Request', subject: 'Help us improve your dental visit', message: 'Hello,\n\nThank you for your 2-star rating. To help us fix this, could you share more details about your visit to {Branch}?\n\nSincerely,\nQuality Team' },
      { id: 'star2_3', name: '2★ Follow-up Action', subject: 'Update on your recent experience - Alpha Dental Clinic', message: 'Hello,\n\nWe have shared your comment: "{Comment}" with our head dental team at {Branch} to make sure this does not happen again.\n\nBest regards,\nCare Team' }
    ],
    3: [
      { id: 'star3_1', name: '3★ Neutral Acknowledgement', subject: 'Thank you for your valuable feedback - Alpha Dental Clinic', message: 'Hello,\n\nThank you for sharing your honest experience at {Branch}.\n\nYour feedback: "{Comment}" helps us understand where we can improve.\n\nBest regards,\nManagement Team' },
      { id: 'star3_2', name: '3★ Better Service Promise', subject: 'We strive for 5-stars next time! - Alpha Dental', message: 'Hello,\n\nThank you for your 3-star rating. We are glad your visit was okay, but we want it to be perfect next time at {Branch}.\n\nWarm regards,\nStaff Team' },
      { id: 'star3_3', name: '3★ General Follow-up', subject: 'Regarding your recent dental visit', message: 'Hello,\n\nWe appreciate your 3-star review of our {Branch} location. Thank you for helping us grow.\n\nSincerely,\nAlpha Dental Clinic' }
    ],
    4: [
      { id: 'star4_1', name: '4★ Appreciative Thank You', subject: 'Thank you for the great review! - Alpha Dental Clinic', message: 'Hello,\n\nThank you for the wonderful 4-star rating! We are happy you had a good experience at {Branch}.\n\nBest regards,\nManagement Team' },
      { id: 'star4_2', name: '4★ Referral Incentive', subject: 'We appreciate your support! - Alpha Dental Clinic', message: 'Hello,\n\nThank you for the 4-star review of {Branch}! If you recommend us to friends, let us know so we can thank you.\n\nWarm regards,\nFront Desk' },
      { id: 'star4_3', name: '4★ Continuous Improvement', subject: 'Thank you for choosing Alpha Dental Clinic', message: 'Hello,\n\nWe love hearing from our patients. Thank you for the 4-star feedback for {Branch}. We look forward to seeing you again!\n\nBest regards,\nOur Team' }
    ],
    5: [
      { id: 'star5_1', name: '5★ Enthusiastic Appreciation', subject: 'Thank you for the fantastic 5-star review!', message: 'Hello,\n\nWow! Thank you so much for your fantastic 5-star review of our {Branch} branch!\n\nOur team is thrilled to hear your kind words.\n\nBest regards,\nManagement Team' },
      { id: 'star5_2', name: '5★ Google Review Request', subject: 'Share your 5-star experience on Google!', message: 'Hello,\n\nThank you for your 5-star review at {Branch}! Would you mind sharing this wonderful experience on our main Google Maps page too?\n\nSincerely,\nMarketing Team' },
      { id: 'star5_3', name: '5★ Loyalty VIP Welcome', subject: 'You are a valued patient! - Alpha Dental Clinic', message: 'Hello,\n\nThank you for the perfect 5-star rating! We always love providing top-tier care at {Branch}.\n\nSee you at your next checkup!\n\nWarm regards,\nAlpha Dental Family' }
    ]
  };

  const [editablePresets, setEditablePresets] = useState<StarPresets>(defaultPresets);
  const [tempPresets, setTempPresets] = useState<StarPresets | null>(null);
  const [showPresetManager, setShowPresetManager] = useState<boolean>(false);
  const [activePresetTab, setActivePresetTab] = useState<1 | 2 | 3 | 4 | 5>(1); 
  
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; message: string; actionType: 'closePreset' | 'factoryReset' }>({
    open: false, title: '', message: '', actionType: 'closePreset'
  });

  // Email Reply Modal States
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('custom');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Synchronize HTML data-theme setup to guarantee accurate element background adjustments
  useEffect(() => {
    const isDark = document.body.classList.contains('dark-mode-active') || localStorage.getItem('theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const updatedIsDark = document.body.classList.contains('dark-mode-active');
          setTheme(updatedIsDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // ⚡ Component စဖွင့်ချင်း ဒေတာဆွဲမည် + Supabase Real-time စနစ် ချိတ်ဆက်မည်
  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel('realtime-reviews-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',   
          schema: 'public',
          table: 'reviews'   
        },
        (payload) => {
          console.log('🔄 ဒေတာအသစ် Real-time ရရှိပါပြီ - ', payload.new);
          fetchReviews(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==========================================
  // 🔥 AI AUTO-PILOT REAL-TIME CORE LOGIC
  // ==========================================
  useEffect(() => {
    if (!autoPilotMode || reviews.length === 0) return;

    const unrepliedReviews = reviews.filter(r => !r.is_replied && r.email && !autoProcessingIds.includes(r.id));
    if (unrepliedReviews.length === 0) return;

    const runAutoPilotAutomation = async () => {
      const reviewToProcess = unrepliedReviews[0];
      setAutoProcessingIds(prev => [...prev, reviewToProcess.id]);

      try {
        const response = await fetch('/api/generate-ai-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: reviewToProcess.rating,
            comment: reviewToProcess.comment,
            branch: reviewToProcess.branch_name || 'Main Branch'
          }),
        });

        const result = await response.json();
        const aiGeneratedText = result?.aiGeneratedMessage || result?.choices?.[0]?.message?.content || result?.reply;

        const dynamicSubject = `Regarding your recent visit - ${reviewToProcess.business_name || 'Alpha Dental Clinic'}`;
        const dynamicMessage = aiGeneratedText || `Thank you for your ${reviewToProcess.rating}-star review. We appreciate your feedback.`;

        const sendResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: reviewToProcess.email,
            subject: dynamicSubject,
            message: dynamicMessage,
            reviewId: reviewToProcess.id,
          }),
        });

        const sendResult = await sendResponse.json();
        if (sendResponse.ok && sendResult.success) {
          fetchReviews();
        }
      } catch (error) {
        console.error("⚠️ [Auto-Pilot Critical Error]:", error);
      } finally {
        setAutoProcessingIds(prev => prev.filter(id => id !== reviewToProcess.id));
      }
    };

    const timer = setTimeout(() => { runAutoPilotAutomation(); }, 1500);
    return () => clearTimeout(timer);
  }, [autoPilotMode, reviews, autoProcessingIds]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, created_at, rating, comment, business_name, branch_name, email, is_replied')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setReviews(data);
        applyCombinedFilters(data, activeFilter, selectedBranchFilter, timeFilter, searchQuery);
      }
    } catch (error) {
      console.error('Error syncing with server:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIReply = async () => {
    if (currentPlan !== 'Enterprise') {
      alert("🔒 AI Smart Replies require the Premium Enterprise Node Level.");
      return;
    }
    if (!selectedReview) return;
    setIsGeneratingAI(true);

    try {
      const response = await fetch('/api/generate-ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: selectedReview.rating,
          comment: selectedReview.comment,
          branch: selectedReview.branch_name || 'Main Branch'
        }),
      });

      const result = await response.json();
      const finalMessage = result?.aiGeneratedMessage || result?.choices?.[0]?.message?.content || result?.reply;

      if (response.ok && finalMessage) {
        setEmailSubject(`Regarding your recent visit - ${selectedReview.business_name || 'Alpha Dental Clinic'}`);
        setEmailMessage(finalMessage);
        setSelectedTemplateKey('custom');
      } else {
        alert(`AI Configuration Hint: API Framework Error.`);
      }
    } catch (err) {
      console.error("AI Connection Failure:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // 📝 Custom Preset Manager Functions
  const openPresetManager = () => {
    // 💡 Enterprise မဟုတ်လျှင် (Starter သို့မဟုတ် pro ဖြစ်လျှင်) Lock Alert တန်းပြရန် ပြောင်းလဲလိုက်ခြင်းဖြစ်ပါတယ်
    if (currentPlan !== 'Enterprise') {
      alert("🔒 Custom Template Configuration requires the Premium Enterprise Plan.");
      return;
    }
    
    setTempPresets(JSON.parse(JSON.stringify(editablePresets)));
    setShowPresetManager(true);
  };

  const handlePresetTextChange = (starKey: 1 | 2 | 3 | 4 | 5, index: number, field: 'name' | 'subject' | 'message', value: string) => {
    setEditablePresets(prev => ({
      ...prev,
      [starKey]: prev[starKey].map((tpl, idx) => 
        idx === index ? { ...tpl, [field]: value } : tpl
      )
    }));
  };

  const savePresets = () => {
    setTempPresets(JSON.parse(JSON.stringify(editablePresets)));
    setShowPresetManager(false);
    alert("💾 Custom 5-Star preset configuration settings have been updated.");
  };

  const closePresetManagerWithCheck = () => {
    const hasChanges = JSON.stringify(editablePresets) !== JSON.stringify(tempPresets);
    if (hasChanges) {
      setConfirmDialog({
        open: true,
        title: '💾 Unsaved Custom Changes Found!',
        message: 'You have modified your 1-5 star templates. Do you want to save them before exiting, or completely discard changes?',
        actionType: 'closePreset'
      });
    } else {
      setShowPresetManager(false);
    }
  };

  const triggerFactoryReset = () => {
    setConfirmDialog({
      open: true,
      title: '⚠️ Factory Reset Warning',
      message: 'Are you completely sure you want to revert all custom configurations back to the 1-5 star default templates?',
      actionType: 'factoryReset'
    });
  };

  const executeConfirmAction = (approved: boolean) => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
    if (confirmDialog.actionType === 'closePreset') {
      if (approved) {
        savePresets();
      } else {
        if (tempPresets) setEditablePresets(tempPresets); 
        setShowPresetManager(false);
      }
    } else if (confirmDialog.actionType === 'factoryReset') {
      if (approved) {
        setEditablePresets(JSON.parse(JSON.stringify(defaultPresets)));
        if (tempPresets) setTempPresets(JSON.parse(JSON.stringify(defaultPresets)));
        alert("🔄 System Core: 1-5 Star templates successfully restored to defaults.");
      }
    }
  };

  // Node Setup Configuration Trigger
  const handleSelectBranchNode = (branchName: string) => {
    const checkExist = branchStats.find(b => b.name === branchName);
    if (checkExist) {
      alert("This operational node branch configuration is already actively mapped inside your main view.");
      return;
    }
    const updatedStats: BranchStat[] = [
      ...branchStats,
      { name: branchName, averageRating: 5.0, totalReviews: 0, status: 'Excellent' }
    ];
    setBranchStats(updatedStats);
    setShowBranchModal(false);
  };

  // ❌ Opens Premium Custom Delete Confirmation Dialog Modal
  const openRemoveConfirmDialog = (branchName: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setRemoveNodeDialog({
      open: true,
      branchName: branchName
    });
  };

  // ❌ Executes Complete Stable Array Cleanup of Removed Branch Node Entries
  const confirmExecuteRemoveNode = () => {
    const target = removeNodeDialog.branchName;
    if (target) {
      const cleanedStats = branchStats.filter(b => b.name !== target);
      setBranchStats(cleanedStats);
      
      if (selectedBranchFilter === target) {
        setSelectedBranchFilter('all');
        applyCombinedFilters(reviews, activeFilter, 'all', timeFilter, searchQuery);
      }
    }
    setRemoveNodeDialog({ open: false, branchName: null });
  };

  const calculateAdvancedStats = (data: Review[]) => {
    const total = data.length;
    setTotalIntercepted(total);
    let critical = 0; let neutral = 0; let excellent = 0; let sumRatings = 0;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    data.forEach((item) => {
      sumRatings += item.rating;
      if (item.rating <= 2) critical++;
      if (item.rating === 3) neutral++;
      if (item.rating >= 4) excellent++;
      if (item.rating >= 1 && item.rating <= 5) counts[item.rating as 1 | 2 | 3 | 4 | 5] += 1;
    });

    setCriticalAlerts(critical);
    setNeutralInsights(neutral);
    setExcellentReviews(excellent);
    setRatingCounts(counts);
    setAverageRating(total > 0 ? parseFloat((sumRatings / total).toFixed(1)) : 0);
  };

  const calculateBranchStats = (data: Review[]) => {
    if (branchStats.length > 0) return;

    const branchesMap: { [key: string]: { totalRating: number; count: number } } = {};
    const seedNodes = ['Main Branch', 'Hledan Branch', 'Mandalay Branch'];
    seedNodes.forEach(node => {
      branchesMap[node] = { totalRating: 0, count: 0 };
    });

    data.forEach((item) => {
      const branch = item.branch_name || 'Main Branch';
      if (!branchesMap[branch]) branchesMap[branch] = { totalRating: 0, count: 0 };
      branchesMap[branch].totalRating += item.rating;
      branchesMap[branch].count += 1;
    });

    const stats: BranchStat[] = Object.keys(branchesMap).map((name) => {
      const count = branchesMap[name].count;
      const avg = count > 0 ? parseFloat((branchesMap[name].totalRating / count).toFixed(1)) : 5.0;
      let status: 'Excellent' | 'Good' | 'Critical' = 'Good';
      if (avg >= 4.5) status = 'Excellent';
      if (avg < 3.5) status = 'Critical';
      return { name, averageRating: avg, totalReviews: count, status };
    });

    setBranchStats(stats);
  };

  const applyCombinedFilters = (allReviews: Review[], ratingType: string, branchType: string, timeType: string, query: string) => {
    setChartRendered(false);
    
    let planFiltered = [...allReviews];
    if (currentPlan === 'Starter') {
      const now = new Date();
      planFiltered = planFiltered.filter(r => {
        const itemDate = new Date(r.created_at);
        const diffTime = Math.abs(now.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7; 
      });
    }

    let timeFiltered = [...planFiltered];

    if (timeType !== 'all') {
      const now = new Date();
      timeFiltered = timeFiltered.filter(r => {
        const itemDate = new Date(r.created_at);
        const diffTime = Math.abs(now.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (timeType === 'today') return itemDate.toDateString() === now.toDateString();
        if (timeType === 'week') return diffDays <= 7;
        if (timeType === 'month') return diffDays <= 30;
        return true;
      });
    }

    calculateBranchStats(timeFiltered);
    let branchAndTimeFiltered = [...timeFiltered];
    
    if (currentPlan === 'Starter') {
      branchAndTimeFiltered = branchAndTimeFiltered.filter(r => (r.branch_name || 'Main Branch') === 'Main Branch');
    } else if (branchType !== 'all') {
      branchAndTimeFiltered = branchAndTimeFiltered.filter(r => (r.branch_name || 'Main Branch') === branchType);
    }

    calculateAdvancedStats(branchAndTimeFiltered);
    let finalFiltered = [...branchAndTimeFiltered];
    if (ratingType === 'critical') finalFiltered = finalFiltered.filter(r => r.rating <= 2);
    else if (ratingType === 'neutral') finalFiltered = finalFiltered.filter(r => r.rating === 3);
    else if (ratingType === 'excellent') finalFiltered = finalFiltered.filter(r => r.rating >= 4);

    if (query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      finalFiltered = finalFiltered.filter(r => 
        (r.email && r.email.toLowerCase().includes(lowerQuery)) || 
        (r.comment && r.comment.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredReviews(finalFiltered);
    setCurrentPage(1);
    setTimeout(() => { setChartRendered(true); }, 150);
  };

  const handleFilterChange = (filterType: 'all' | 'critical' | 'neutral' | 'excellent') => {
    setActiveFilter(filterType);
    applyCombinedFilters(reviews, filterType, selectedBranchFilter, timeFilter, searchQuery);
  };

  const handleBranchFilterChange = (branchName: string) => {
    setSelectedBranchFilter(branchName);
    applyCombinedFilters(reviews, activeFilter, branchName, timeFilter, searchQuery);
  };

  const handleTimeFilterChange = (t: 'all' | 'today' | 'week' | 'month') => {
    setTimeFilter(t);
    applyCombinedFilters(reviews, activeFilter, selectedBranchFilter, t, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    applyCombinedFilters(reviews, activeFilter, selectedBranchFilter, timeFilter, value);
  };

  const replacePlaceholders = (text: string, review: Review) => {
    return text
      .replaceAll('{Branch}', review.branch_name || 'Main Branch')
      .replaceAll('{Comment}', review.comment || 'No comment left')
      .replaceAll('{Rating}', review.rating.toString());
  };

  const handleTemplateDropdownChange = (key: string) => {
    setSelectedTemplateKey(key);
    if (!selectedReview) return;
    if (key === 'custom') {
      setEmailSubject('');
      setEmailMessage('');
      return;
    }

    const targetRating = selectedReview.rating as 1 | 2 | 3 | 4 | 5;
    const currentPool = editablePresets[targetRating] || [];

    const targetTemplate = currentPool.find(t => t.id === key);
    if (targetTemplate) {
      setEmailSubject(replacePlaceholders(targetTemplate.subject, selectedReview));
      setEmailMessage(replacePlaceholders(targetTemplate.message, selectedReview));
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;
    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerEmail,
          subject: emailSubject,
          message: emailMessage,
          reviewId: selectedReview.id, 
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert(`Success! Email sent to ${customerEmail}`);
        setIsModalOpen(false);
        fetchReviews();
      } else {
        alert(`Failed to send email: ${result.error || 'Unknown Error'}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const toggleCommentExpand = (id: number) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Pagination Engine Calculations
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  const emptyRowsCount = itemsPerPage - paginatedReviews.length;

  const getPaginationRange = () => {
    const current = currentPage;
    const total = totalPages;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }
    return [1, '...', current, '...', total];
  };

  const excPct = totalIntercepted > 0 ? (excellentReviews / totalIntercepted) * 100 : 0;
  const neuPct = totalIntercepted > 0 ? (neutralInsights / totalIntercepted) * 100 : 0;
  const criPct = totalIntercepted > 0 ? (criticalAlerts / totalIntercepted) * 100 : 0;

  const strokeDashExcellent = `${chartRendered ? excPct : 0} ${100 - (chartRendered ? excPct : 0)}`;
  const strokeDashneutral = `${chartRendered ? neuPct : 0} ${100 - (chartRendered ? neuPct : 0)}`;
  const strokeDashCritical = `${chartRendered ? criPct : 0} ${100 - (chartRendered ? criPct : 0)}`;

  const offsetNeutral = 100 - excPct;
  const offsetCritical = 100 - excPct - neuPct;

  const activeFullScreenTemplate = fullScreenTarget 
    ? editablePresets[fullScreenTarget.starKey][fullScreenTarget.index] 
    : null;

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 transition-colors duration-200">
      <style dangerouslySetInnerHTML={{ __html: `
        :root, [data-theme="dark"] {
          --bg-main: #020617;
          --bg-card: rgba(15, 23, 42, 0.6);
          --border-color: #1e293b;
          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --bg-input: rgba(30, 41, 59, 0.5);
        }
        body:not(.dark-mode-active), [data-theme="light"] {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --border-color: #e2e8f0;
          --text-primary: #0f172a;
          --text-secondary: #64748b;
          --bg-input: #f1f5f9;
        }
        body:not(.dark-mode-active) .bg-slate-900, 
        body:not(.dark-mode-active) .bg-slate-950, 
        body:not(.dark-mode-active) .bg-[#020617], 
        body:not(.dark-mode-active) .bg-slate-800, 
        body:not(.dark-mode-active) .border-slate-800, 
        body:not(.dark-mode-active) .border-slate-700 {
          background-color: var(--bg-card) !important;
          border-color: var(--border-color) !important;
        }
        input, textarea, select {
          background-color: var(--bg-input) !important;
          color: var(--text-primary) !important;
          border-color: var(--border-color) !important;
        }
        body {
          background-color: var(--bg-main) !important;
          color: var(--text-primary) !important;
        }
      `}} />

      {/* Header Banner Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            R
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Reputation Management Hub</span>
            <h1 className="text-base font-bold tracking-tight m-0" style={{ color: 'var(--text-primary)' }}>Business Admin Workspace</h1>
          </div>
        </div>

        {/* Menu Row Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all" 
            style={
              currentPlan !== 'Enterprise'
                ? { backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid #334155', opacity: 0.6 } 
                : { backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' } 
            }
          >
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentPlan !== 'Enterprise' ? '#64748b' : 'var(--text-indigo)' }}>
              {currentPlan !== 'Enterprise' ? '🔒 Auto-Pilot' : '⚡ Auto-Pilot'}
            </span>
            <input 
              type="checkbox" 
              checked={autoPilotMode && currentPlan === 'Enterprise'} 
              onChange={(e) => {
                if (currentPlan !== 'Enterprise') {
                  alert("🔒 AI Auto-Pilot Engine requires the Premium Enterprise Node Level.");
                  return;
                }
                setAutoPilotMode(e.target.checked);
              }}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
              style={{ cursor: currentPlan !== 'Enterprise' ? 'not-allowed' : 'pointer' }}
            />
          </div>

          <button 
            onClick={openPresetManager}
            className="px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1"
            style={
              currentPlan !== 'Enterprise' 
                ? { backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid #334155', color: '#64748b' } 
                : { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' } 
            }
          >
            {currentPlan !== 'Enterprise' ? '🔒 Preset Templates (Enterprise)' : '📋 Manage Presets'}
          </button>
       
          <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setCurrentPlan('Starter')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-none cursor-pointer transition-all ${currentPlan === 'Starter' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 bg-transparent'}`}>Starter</button>
            <button onClick={() => setCurrentPlan('Pro')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-none cursor-pointer transition-all ${currentPlan === 'Pro' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 bg-transparent'}`}>Pro</button>
            <button onClick={() => setCurrentPlan('Enterprise')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border-none cursor-pointer transition-all ${currentPlan === 'Enterprise' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white bg-transparent'}`}>💎 Enterprise</button>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <main className="w-full space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-xs font-medium">Syncing Live Database Records...</p>
          </div>
        ) : (
          <>
            {/* Overview Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total Feedbacks</p>
                    <h3 className="text-2xl font-bold mt-1 m-0" style={{ color: 'var(--text-primary)' }}>{totalIntercepted}</h3>
                  </div>
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center text-lg">📊</div>
                </div>
              </div>

              <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Excellent (4-5★)</p>
                    <h3 className="text-2xl font-bold text-emerald-500 mt-1 m-0">{excellentReviews}</h3>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center text-lg">❤️</div>
                </div>
              </div>

              <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Neutral (3★)</p>
                    <h3 className="text-2xl font-bold text-amber-500 mt-1 m-0">{neutralInsights}</h3>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center text-lg">⏳</div>
                </div>
              </div>

              <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Critical Alerts (1-2★)</p>
                    <h3 className="text-2xl font-bold text-rose-500 mt-1 m-0">{criticalAlerts}</h3>
                  </div>
                  <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center text-lg">⚠️</div>
                </div>
              </div>
            </div>

            {/* Main Interactive Grid Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column Controls Panel */}
              <div className="space-y-6 flex flex-col lg:sticky lg:top-24 h-fit order-first">
                
                {/* Rating Metrics Profiler */}
                <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight m-0" style={{ color: 'var(--text-primary)' }}>Review Density Breakdown</h3>
                      <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--text-secondary)' }}>Real-time cluster calculations.</p>
                    </div>
                    
                    <div className="space-y-3 pt-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star] || 0;
                        const percentage = totalIntercepted > 0 ? (count / totalIntercepted) * 100 : 0;
                        let barColor = 'bg-rose-500';
                        if (star === 3) barColor = 'bg-amber-500';
                        if (star >= 4) barColor = 'bg-emerald-500';
                        return (
                          <div key={star} className="flex items-center gap-3 text-xs font-medium">
                            <span className="w-12 font-bold" style={{ color: 'var(--text-secondary)' }}>{star} Star</span>
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-input)' }}>
                              <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="w-6 text-right font-bold" style={{ color: 'var(--text-primary)' }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sentiment Analytics Ring */}
                  <div className="pt-4 mt-4 border-t flex flex-col items-center justify-center" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Sentiment Index Profile</p>
                    <div className="flex items-center justify-center gap-6 w-full">
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 origin-center transition-transform" style={{ transitionDuration: '1200ms' }}>
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--bg-input)" strokeWidth="3.8" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={strokeDashExcellent} strokeDashoffset="0" style={{ transition: 'all 1200ms' }} />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={strokeDashneutral} strokeDashoffset={offsetNeutral} style={{ transition: 'all 1200ms' }} />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={strokeDashCritical} strokeDashoffset={offsetCritical} style={{ transition: 'all 1200ms' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{averageRating}</span>
                          <span className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-secondary)' }}>Score</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-[11px] font-bold">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                          <span style={{ color: 'var(--text-secondary)' }}>Pos ({Math.round(excPct)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                          <span style={{ color: 'var(--text-secondary)' }}>Neu ({Math.round(neuPct)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                          <span style={{ color: 'var(--text-secondary)' }}>Crit ({Math.round(criPct)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🏢 Branch Leaderboard Section */}
                <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold tracking-tight m-0" style={{ color: 'var(--text-primary)' }}>Mapped Branch Nodes</h3>
                        <p className="text-xs mt-0.5 m-0" style={{ color: 'var(--text-secondary)' }}>Operational overview indexes.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowBranchModal(true)} 
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] border-none rounded-lg cursor-pointer transition-colors"
                      >
                        🏢 Map Node
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsNodeFullScreen(true)}
                      className="w-full text-center py-1 bg-slate-500/10 hover:bg-slate-500/20 text-[10px] text-indigo-400 font-extrabold rounded-lg border border-solid cursor-pointer transition-all"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      🔍 Open Full Screen Multi-Branch Matrix
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {branchStats.length === 0 ? (
                      <p className="text-center text-xs italic py-4" style={{ color: 'var(--text-secondary)' }}>No branches mapped. Click Map Node to add.</p>
                    ) : (
                      branchStats.map((branch, index) => {
                        let statusBadge = "bg-emerald-500/10 text-emerald-500";
                        if (branch.status === 'Good') statusBadge = "bg-amber-500/10 text-amber-500";
                        if (branch.status === 'Critical') statusBadge = "bg-rose-500/10 text-rose-500";
                        
                        return (
                          <div 
                            key={`side-node-${branch.name}-${index}`} 
                            onClick={() => handleBranchFilterChange(selectedBranchFilter === branch.name ? 'all' : branch.name)}
                            className={`p-3 rounded-xl border border-solid flex items-center justify-between cursor-pointer transition-all ${selectedBranchFilter === branch.name ? 'bg-indigo-600/10 border-indigo-500' : 'hover:bg-slate-500/5'}`}
                            style={{ backgroundColor: 'var(--bg-input)', borderColor: selectedBranchFilter === branch.name ? '#6366f1' : 'var(--border-color)' }}
                          >
                            <div className="space-y-0.5 flex-1 pr-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>{branch.name}</span>
                                
                                <button
                                  type="button"
                                  onClick={(e) => openRemoveConfirmDialog(branch.name, e)}
                                  className="px-1.5 py-0.5 text-[9px] bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 font-bold border-none rounded cursor-pointer transition-all"
                                >
                                  Remove
                                </button>
                              </div>
                              <span className="text-[10px] block" style={{ color: 'var(--text-secondary)' }}>{branch.totalReviews} entries logged</span>
                            </div>
                            <div className="text-right space-y-1 pl-1 shrink-0">
                              <span className="text-xs font-black block" style={{ color: 'var(--text-primary)' }}>{branch.averageRating} ★</span>
                              <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded uppercase tracking-wide inline-block ${statusBadge}`}>{branch.status}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column Core Data Table Workstation */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Advanced Filtering Matrix Panel */}
                <div className="transition-colors duration-200 border p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input 
                          type="text" 
                          placeholder="Query database for comments or specific emails..."
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="w-full p-2.5 rounded-xl border text-xs outline-none transition-colors"
                          style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <select
                          value={timeFilter}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (currentPlan === 'Starter' && (selectedValue === 'all' || selectedValue === 'month')) {
                              alert("🔒 Viewing analytics records beyond 7 days requires the Pro or Enterprise Plan.");
                              return; 
                            }
                            handleTimeFilterChange(selectedValue as any);
                          }}
                          className="w-full p-2.5 rounded-xl border text-xs outline-none transition-colors"
                          style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          <option value="all">📅 System Scope: All-Time {currentPlan === 'Starter' ? '🔒' : ''}</option>
                          <option value="today">Today</option>
                          <option value="week">Past 7 Days</option>
                          <option value="month">Past 30 Days {currentPlan === 'Starter' ? '🔒' : ''}</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1 p-0.5 rounded-xl" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                        <button onClick={() => handleFilterChange('all')} className={`px-3 py-1.5 text-xs font-bold border-none rounded-lg cursor-pointer transition-all ${activeFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 bg-transparent hover:text-slate-200'}`}>All Reviews</button>
                        <button onClick={() => handleFilterChange('critical')} className={`px-3 py-1.5 text-xs font-bold border-none rounded-lg cursor-pointer transition-all ${activeFilter === 'critical' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 bg-transparent hover:text-rose-400'}`}>⚠️ Critical</button>
                        <button onClick={() => handleFilterChange('neutral')} className={`px-3 py-1.5 text-xs font-bold border-none rounded-lg cursor-pointer transition-all ${activeFilter === 'neutral' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 bg-transparent hover:text-amber-400'}`}>⏳ Neutral</button>
                        <button onClick={() => handleFilterChange('excellent')} className={`px-3 py-1.5 text-xs font-bold border-none rounded-lg cursor-pointer transition-all ${activeFilter === 'excellent' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 bg-transparent hover:text-emerald-400'}`}>❤️ Excellent</button>
                      </div>

                      {selectedBranchFilter !== 'all' && (
                        <div className="text-[10px] font-bold bg-indigo-500/10 border border-solid border-indigo-500/30 text-indigo-500 px-2 py-1 rounded-lg flex items-center gap-1.5">
                          <span>🏢 Node Filter: {selectedBranchFilter}</span>
                          <button onClick={() => handleBranchFilterChange('all')} className="bg-transparent border-none text-indigo-500 font-bold cursor-pointer hover:text-rose-500">✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Central Registry Data Grid Table */}
                <div 
                  className="transition-colors duration-200 border overflow-hidden p-0 flex flex-col justify-between" 
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', minHeight: '480px' }}
                >
                  <div className="overflow-x-auto w-full flex-1">
                    <table className="w-full text-left border-collapse m-0 table-fixed">
                      <thead>
                        <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                          <th className="p-4 text-[11px] font-bold uppercase tracking-wider w-[40%] sm:w-[30%]" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Target Node Address</th>
                          <th className="hidden sm:table-cell p-4 text-[11px] font-bold uppercase tracking-wider w-[15%]" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Score Rating</th>
                          <th className="hidden sm:table-cell p-4 text-[11px] font-bold uppercase tracking-wider w-[35%]" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Intercepted Feed Text</th>
                          <th className="p-4 text-[11px] font-bold uppercase tracking-wider w-[60%] sm:w-[20%] text-right" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Control Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        {paginatedReviews.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="sm:colSpan-4 p-12 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                              No review indices discovered matching active configuration profiles.
                            </td>
                          </tr>
                        ) : (
                          paginatedReviews.map((review) => {
                            let starBadgeColor = "text-emerald-500 bg-emerald-500/10";
                            if (review.rating === 3) starBadgeColor = "text-amber-500 bg-amber-500/10";
                            if (review.rating <= 2) starBadgeColor = "text-rose-500 bg-rose-500/10";

                            const isLongComment = review.comment && review.comment.length > 70;
                            const isExpanded = expandedComments[review.id] || false;
                            const displayComment = isLongComment && !isExpanded 
                              ? `${review.comment.substring(0, 70)}...` 
                              : review.comment || 'No textual feedback content found.';

                            return (
                              <tr key={review.id} className="h-[76px] hover:bg-slate-500/5 transition-colors">
                                <td className="p-4 text-xs truncate">
                                  <span className="block truncate font-bold" style={{ color: review.email ? '#38bdf8' : 'var(--text-secondary)' }}>
                                    {review.email === 'NO_EMAIL_DIRECT_GOOGLE' ? 'direct-google-reviewer@gmail.com' : (review.email || 'Anonymous Patient Node')}
                                  </span>
                                  <div className="hidden sm:flex items-center gap-2 mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="font-extrabold uppercase px-1 rounded bg-slate-500/10">{review.branch_name || 'Main Branch'}</span>
                                    <span>•</span>
                                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                  </div>
                                </td>

                                <td className="hidden sm:table-cell p-4">
                                  <div className={`px-2 py-0.5 font-bold rounded text-xs inline-flex items-center gap-0.5 ${starBadgeColor}`}>
                                    <span>{review.rating}</span>
                                    <span>★</span>
                                  </div>
                                </td>

                                <td className="hidden sm:table-cell p-4 text-xs font-medium whitespace-normal break-words">
                                  <p className="m-0 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                    {displayComment}
                                  </p>
                                  {isLongComment && (
                                    <button
                                      onClick={() => toggleCommentExpand(review.id)}
                                      className="text-indigo-400 font-bold border-none bg-transparent p-0 mt-0.5 cursor-pointer hover:text-indigo-300 block text-[10px]"
                                    >
                                      {isExpanded ? 'Minimize View' : 'Expand Text'}
                                    </button>
                                  )}
                                </td>

                                <td className="p-4 text-right">
                                  {review.is_replied ? (
                                    <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-solid border-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                                      <span>✓ Handled</span>
                                    </div>
                                  ) : review.email === 'NO_EMAIL_DIRECT_GOOGLE' ? (
                                    <span style={{ 
                                      display: 'inline-block', 
                                      padding: '6px 12px', 
                                      borderRadius: '8px', 
                                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                                      color: '#10b981', 
                                      fontSize: '11px', 
                                      fontWeight: 'bold',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      ⚡ Google Direct
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setSelectedReview(review);
                                        setCustomerEmail(review.email || '');
                                        setEmailSubject('');
                                        setEmailMessage('');
                                        setSelectedTemplateKey('custom');
                                        setIsModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 text-[11px] font-bold rounded-xl border-none cursor-pointer active:scale-95 text-white bg-indigo-600 hover:bg-indigo-700 shadow transition-colors min-w-[110px]"
                                    >
                                      ✉ Outbound CRM
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}

                        {paginatedReviews.length > 0 && emptyRowsCount > 0 && (
                          Array.from({ length: emptyRowsCount }).map((_, idx) => (
                            <tr key={`filler-row-${idx}`} className="h-[76px] opacity-10 border-none pointer-events-none">
                              <td colSpan={2} className="sm:colSpan-4 p-4 text-[11px] italic" style={{ color: 'var(--text-secondary)' }}>- Open Index Container Slot -</td>
                              <td className="hidden sm:table-cell p-4"></td>
                              <td className="hidden sm:table-cell p-4"></td>
                              <td className="hidden sm:table-cell p-4"></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination Matrix Panel Footer */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between text-xs font-bold shrink-0" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Showing Index {currentPage} of {totalPages} Pages</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className="px-2.5 py-1.5 rounded-lg border border-solid bg-transparent text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          Previous
                        </button>

                        <div className="hidden sm:flex items-center gap-1">
                          {getPaginationRange().map((pageItem, index) => {
                            if (pageItem === '...') {
                              return <span key={`dots-${index}`} className="px-2 text-slate-400 text-xs">...</span>;
                            }
                            return (
                              <button
                                key={`page-btn-${pageItem}`}
                                type="button"
                                onClick={() => setCurrentPage(Number(pageItem))}
                                className={`w-7 h-7 font-black rounded-lg text-xs border-none cursor-pointer transition-all ${currentPage === pageItem ? 'bg-indigo-600 text-white shadow' : 'bg-transparent text-slate-400'}`}
                                style={{ color: currentPage === pageItem ? '#ffffff' : 'var(--text-secondary)' }}
                              >
                                {pageItem}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className="px-2.5 py-1.5 rounded-lg border border-solid bg-transparent text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL CONFIGURATION MODULES                                               */}
      {/* ========================================================================= */}

      {/* 🏢 Modal 1: Deploy & Map Branch Node Directory */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 border border-solid shadow-2xl animate-in fade-in zoom-in-95 duration-150" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Enterprise Hub Directory</span>
                <h3 className="text-base font-black m-0" style={{ color: 'var(--text-primary)' }}>Select Active Node Branch Dashboard</h3>
              </div>
              <button onClick={() => setShowBranchModal(false)} className="bg-transparent border-none font-bold cursor-pointer text-lg" style={{ color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <p className="text-xs m-0" style={{ color: 'var(--text-secondary)' }}>
              To prevent non-existent database sync values, map metrics directly from verified live setup streams below:
            </p>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {availableSystemNodes.map((node, index) => (
                <div 
                  key={`add-node-card-${index}`}
                  onClick={() => handleSelectBranchNode(node.name)}
                  className="p-4 rounded-xl border border-solid text-left cursor-pointer transition-all hover:border-indigo-500 group"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold m-0" style={{ color: 'var(--text-primary)' }}>🏢 {node.name}</h4>
                      <p className="text-[11px] mt-1 m-0" style={{ color: 'var(--text-secondary)' }}>{node.details}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white rounded-lg transition-colors">
                      Map & Activate Node &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                Cancel Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌐 Full Screen Multi-Branch Matrix Console Modal */}
      {isNodeFullScreen && (
        <>
          {/* 🌑 1. DARK MODE VERSION */}
          {theme === 'dark' && (
            <div className="fixed inset-0 bg-[#020617] z-50 p-6 flex flex-col transition-colors duration-200 text-[#f8fafc]">
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#1e293b]">
                <div>
                  <h2 className="text-base font-bold m-0 text-[#f8fafc]">Operational Node Center</h2>
                  <p className="text-[11px] m-0 text-[#94a3b8]">Full Screen Multi-Branch Matrix Console</p>
                </div>
                <button onClick={() => setIsNodeFullScreen(false)} className="px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer bg-red-500/10 text-red-500 border border-solid border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">✕ Close Full Screen View</button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold m-0 text-[#94a3b8]">
                  Displaying all currently provisioned network branch channels. Total Active Profiles mapped count: <span className="font-bold text-[#f8fafc]">{branchStats.length} channels.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
                {branchStats.map((branch, idx) => {
                  let statusColor = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";
                  if (branch.status === 'Good') statusColor = "border-amber-500/30 bg-amber-500/5 text-amber-400";
                  if (branch.status === 'Critical') statusColor = "border-rose-500/30 bg-rose-500/5 text-rose-400";

                  return (
                    <div key={`dark-grid-node-${idx}`} className="p-5 rounded-2xl border border-solid shadow-sm flex flex-col justify-between transition-colors duration-200 bg-[rgba(15,23,42,0.6)] border-[#1e293b]">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wide">Live Mapped Index</span>
                            <h3 className="text-base font-black text-white m-0">{branch.name}</h3>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                            {branch.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 border-t border-b border-solid border-[#1e293b] py-3 text-xs">
                          <div>
                            <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">Density Score</span>
                            <b className="text-white text-base mt-0.5 block">{branch.averageRating} ★</b>
                          </div>
                          <div>
                            <span className="text-[#94a3b8] block text-[10px] uppercase font-bold">Total Reviews</span>
                            <b className="text-white text-base mt-0.5 block">{branch.totalReviews} units</b>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 mt-4">
                        <button 
                          type="button"
                          onClick={() => {
                            setIsNodeFullScreen(false);
                            handleBranchFilterChange(branch.name);
                          }} 
                          className="text-xs font-bold text-indigo-400 bg-transparent border-none hover:text-indigo-300 cursor-pointer"
                        >
                          Filter Main Screen Dashboard &rarr;
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setRemoveNodeDialog({ open: true, branchName: branch.name });
                          }}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border-none rounded-lg font-bold text-[10px] cursor-pointer transition-all"
                        >
                          Remove Node
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ☀️ 2. LIGHT MODE VERSION */}
          {theme === 'light' && (
            <div className="fixed inset-0 bg-[#f8fafc] z-50 p-6 flex flex-col transition-colors duration-200 text-[#0f172a]">
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-[#e2e8f0]">
                <div>
                  <h2 className="text-base font-bold m-0 text-[#0f172a]">Operational Node Center</h2>
                  <p className="text-[11px] m-0 text-[#64748b]">Full Screen Multi-Branch Matrix Console</p>
                </div>
                <button onClick={() => setIsNodeFullScreen(false)} className="px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer bg-red-500/10 text-red-500 border border-solid border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">✕ Close Full Screen View</button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold m-0 text-[#64748b]">
                  Displaying all currently provisioned network branch channels. Total Active Profiles mapped count: <span className="font-bold text-[#0f172a]">{branchStats.length} channels.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1">
                {branchStats.map((branch, idx) => {
                  let statusColor = "border-emerald-500/30 bg-emerald-500/5 text-emerald-600";
                  if (branch.status === 'Good') statusColor = "border-amber-500/30 bg-amber-500/5 text-amber-600";
                  if (branch.status === 'Critical') statusColor = "border-rose-500/30 bg-rose-500/5 text-rose-600";

                  return (
                    <div key={`light-grid-node-${idx}`} className="p-5 rounded-2xl border border-solid shadow-sm flex flex-col justify-between transition-colors duration-200 bg-[#ffffff] border-[#e2e8f0]">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-wide">Live Mapped Index</span>
                            <h3 className="text-base font-black text-[#0f172a] m-0">{branch.name}</h3>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                            {branch.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 border-t border-b border-solid border-[#e2e8f0] py-3 text-xs">
                          <div>
                            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Density Score</span>
                            <b className="text-[#0f172a] text-base mt-0.5 block">{branch.averageRating} ★</b>
                          </div>
                          <div>
                            <span className="text-[#64748b] block text-[10px] uppercase font-bold">Total Reviews</span>
                            <b className="text-[#0f172a] text-base mt-0.5 block">{branch.totalReviews} units</b>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 mt-4">
                        <button 
                          type="button"
                          onClick={() => {
                            setIsNodeFullScreen(false);
                            handleBranchFilterChange(branch.name);
                          }} 
                          className="text-xs font-bold text-indigo-600 bg-transparent border-none hover:text-indigo-500 cursor-pointer"
                        >
                          Filter Main Screen Dashboard &rarr;
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setRemoveNodeDialog({ open: true, branchName: branch.name });
                          }}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white border-none rounded-lg font-bold text-[10px] cursor-pointer transition-all"
                        >
                          Remove Node
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ❌ PREMIUM CUSTOM REMOVE CONFIRMATION MODAL DIALOG */}
      {removeNodeDialog.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div 
            className="w-full max-w-sm rounded-2xl p-6 text-center space-y-5 border border-solid shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center text-xl mx-auto border border-solid border-rose-500/20 animate-pulse">
              🚨
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base font-black m-0" style={{ color: 'var(--text-primary)' }}>Confirm Node Disconnection</h3>
              <p className="text-xs font-medium leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to completely isolate and delete <b className="text-rose-500">"{removeNodeDialog.branchName}"</b> from your admin layout interface panel views?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
              <button 
                type="button"
                onClick={() => setRemoveNodeDialog({ open: false, branchName: null })} 
                className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white border-none cursor-pointer transition-colors"
              >
                Cancel Deletion
              </button>
              <button 
                type="button"
                onClick={confirmExecuteRemoveNode} 
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white border-none cursor-pointer transition-colors shadow-md"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✉ Modal 2: CRM Outbound Resolution Reply Console */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl p-6 space-y-4 border border-solid shadow-2xl overflow-y-auto max-h-[90vh]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            
            <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">CRM Response Link</span>
                <h3 className="text-base font-bold m-0" style={{ color: 'var(--text-primary)' }}>Compose Resolution System Dispatch</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-transparent border-none text-slate-400 hover:text-slate-200 cursor-pointer text-lg font-bold">✕</button>
            </div>

            <div className="p-3 rounded-xl border text-xs space-y-1.5" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between font-bold" style={{ color: 'var(--text-secondary)' }}>
                <span>Patient Intercept Metadata</span>
                <span className="text-amber-500">{selectedReview.rating} Star Rating Logged</span>
              </div>
              <p className="m-0 italic leading-relaxed" style={{ color: 'var(--text-primary)' }}>"{selectedReview.comment || 'No text content provided.'}"</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>System Presets Matrix</label>
                <select
                  value={selectedTemplateKey}
                  onChange={(e) => handleTemplateDropdownChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border text-xs outline-none"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="custom">✍ Manual Composition Layout</option>
                  <optgroup label={`${selectedReview.rating} Star Matching Presets`}>
                    {(editablePresets[selectedReview.rating as 1 | 2 | 3 | 4 | 5] || []).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <button
                type="button"
                disabled={isGeneratingAI || currentPlan !== 'Enterprise'}
                onClick={generateAIReply}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isGeneratingAI ? '🧠 Computing AI Nodes...' : '✨ Generate AI Smart Reply'}
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3 pt-2 border-t m-0" style={{ borderColor: 'var(--border-color)' }}>
              <input type="email" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full p-2.5 rounded-xl border text-xs outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="customer@domain.com" />
              <input type="text" required value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full p-2.5 rounded-xl border text-xs outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Email Subject String" />
              <textarea rows={5} required value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} className="w-full p-2.5 rounded-xl border text-xs outline-none" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="Email Message Body..." />
              
              <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer bg-slate-700 text-white hover:bg-slate-600 transition-colors">Cancel</button>
                <button type="submit" disabled={isSending} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg border-none cursor-pointer transition-colors">
                  {isSending ? 'Sending...' : 'Send Resolution Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Modal 3: Global Variables Custom Preset Manager */}
      {showPresetManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-5xl rounded-2xl p-6 space-y-4 border border-solid shadow-2xl overflow-y-auto max-h-[90vh]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            
            <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">CRM Core Template Node Override</span>
                <h3 className="text-base font-bold m-0" style={{ color: 'var(--text-primary)' }}>Manage Matrix Response Templates</h3>
              </div>
              <button onClick={closePresetManagerWithCheck} className="bg-transparent border-none text-slate-400 hover:text-slate-200 cursor-pointer text-lg font-bold">✕</button>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              {([1, 2, 3, 4, 5] as const).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setActivePresetTab(star)}
                  className={`flex-1 py-2 text-xs font-bold border-none rounded-lg cursor-pointer transition-all ${activePresetTab === star ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 bg-transparent'}`}
                >
                  {star} Star Presets
                </button>
              ))}
            </div>

            <div className="pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(editablePresets[activePresetTab] || []).map((tpl, idx) => (
                  <div key={tpl.id} className="p-4 rounded-xl border space-y-3 relative group" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                    
                    <button
                      type="button"
                      onClick={() => setFullScreenTarget({ starKey: activePresetTab, index: idx })}
                      className="absolute top-3 right-3 bg-slate-950 text-slate-300 hover:bg-indigo-600 hover:text-white px-2 py-1 text-[10px] font-bold border border-solid rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      🔲 Full Screen
                    </button>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Preset Handle Label</label>
                      <input type="text" value={tpl.name} onChange={(e) => handlePresetTextChange(activePresetTab, idx, 'name', e.target.value)} className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-950 text-slate-100 border-slate-800" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Email Subject String</label>
                      <input type="text" value={tpl.subject} onChange={(e) => handlePresetTextChange(activePresetTab, idx, 'subject', e.target.value)} className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-950 text-slate-100 border-slate-800" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Message Array Code</label>
                      <textarea rows={6} value={tpl.message} onChange={(e) => handlePresetTextChange(activePresetTab, idx, 'message', e.target.value)} className="w-full p-2.5 rounded-xl border text-xs outline-none bg-slate-950 text-slate-100 border-slate-800 resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button 
                type="button"
                onClick={triggerFactoryReset} 
                className="px-3 py-1.5 text-xs font-bold text-rose-500 bg-transparent hover:bg-rose-500/10 border border-solid border-rose-500/30 rounded-xl cursor-pointer transition-colors"
              >
                🔄 Restore Defaults
              </button>
              <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={closePresetManagerWithCheck} className="px-3 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer bg-slate-700 text-white hover:bg-slate-600 transition-colors">Discard</button>
                <button type="button" onClick={savePresets} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg border-none cursor-pointer shadow transition-colors">Commit Settings</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🔲 Focus Overlay: Full Screen Template Composer View Panel */}
      {fullScreenTarget && activeFullScreenTemplate && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl p-6 space-y-4 border border-solid shadow-2xl duration-200" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-600 text-white rounded uppercase tracking-wider">Focus Editor Mode</span>
                <h3 className="text-base font-bold m-0" style={{ color: 'var(--text-primary)' }}>
                  Modifying Slot {fullScreenTarget.index + 1} ({fullScreenTarget.starKey} Star Level Array Group)
                </h3>
              </div>
              <button 
                onClick={() => setFullScreenTarget(null)} 
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white font-bold border-none text-xs rounded-lg cursor-pointer transition-colors"
              >
                ✕ Close & Return
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Template Name Label Title</label>
                  <input type="text" value={activeFullScreenTemplate.name} onChange={(e) => handlePresetTextChange(fullScreenTarget.starKey, fullScreenTarget.index, 'name', e.target.value)} className="w-full p-3 rounded-xl border text-xs outline-none bg-slate-950 text-slate-100 border-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Email Subject Line Block String</label>
                  <input type="text" value={activeFullScreenTemplate.subject} onChange={(e) => handlePresetTextChange(fullScreenTarget.starKey, fullScreenTarget.index, 'subject', e.target.value)} className="w-full p-3 rounded-xl border text-xs outline-none bg-slate-950 text-slate-100 border-slate-800" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Full Text Content Body Matrix Block</label>
                <textarea rows={12} value={activeFullScreenTemplate.message} onChange={(e) => handlePresetTextChange(fullScreenTarget.starKey, fullScreenTarget.index, 'message', e.target.value)} className="w-full p-4 rounded-xl border text-xs outline-none bg-slate-950 text-slate-100 border-slate-800 font-mono leading-relaxed" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="button" onClick={() => setFullScreenTarget(null)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold border-none rounded-xl cursor-pointer shadow transition-all">
                ✓ Apply Focus Target Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ⚠️ Modal 4: Action Alert Confirmation Box */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4 border border-solid shadow-2xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 rounded-full flex items-center justify-center text-xl mx-auto border border-solid border-indigo-500/20">⚠️</div>
            <div className="space-y-1">
              <h3 className="text-base font-black m-0" style={{ color: 'var(--text-primary)' }}>{confirmDialog.title}</h3>
              <p className="text-xs font-medium leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{confirmDialog.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold">
              <button onClick={() => executeConfirmAction(false)} className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white border-none cursor-pointer transition-colors">
                {confirmDialog.actionType === 'closePreset' ? 'Discard Changes' : 'Cancel Operation'}
              </button>
              <button onClick={() => executeConfirmAction(true)} className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border-none cursor-pointer transition-colors">
                {confirmDialog.actionType === 'closePreset' ? 'Save Changes' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}