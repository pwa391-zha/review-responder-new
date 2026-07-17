'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function QRFunnelPage() {
  const searchParams = useSearchParams();
  const [branchParam, setBranchParam] = useState<string>('Main Branch');

  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [email, setEmail] = useState<string>('@gmail.com'); // Pre-filled but deletable
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false); 

  useEffect(() => {
    const branch = searchParams.get('branch');
    if (branch) setBranchParam(branch);
  }, [searchParams]);

  const baseBusinessName = "Alpha Dental Clinic";
  const displayBusinessName = branchParam ? `${baseBusinessName} (${branchParam})` : baseBusinessName; 
  const googleReviewUrl = "https://maps.google.com"; 

  // ⚡ Email Validation System
  const validateEmail = (inputEmail: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(inputEmail)) return false;

    const username = inputEmail.split('@')[0].toLowerCase();
    if (username.length < 5) return false;

    const consonantsOnly = /[^aeiou0-9_.-]{5,}/.test(username);
    if (consonantsOnly) return false;

    const isRepeated = /(.)\1{3,}/.test(username); 
    if (isRepeated) return false;

    return true;
  };

  const handleRatingClick = async (selectedRating: number) => {
    setRating(selectedRating);

    if (selectedRating >= 4) {
      setIsRedirecting(true);
      try {
        await supabase
          .from('reviews')
          .insert([
            { 
              rating: selectedRating, 
              comment: "Direct Google Review Redirect", 
              business_name: baseBusinessName,
              branch_name: branchParam,
              email: "NO_EMAIL_DIRECT_GOOGLE" 
            }
          ]);
      } catch (err) {
        console.error("Error auto-saving positive review:", err);
      }
      
      // 🎯 ၁.၅ စက္ကန့်လောက် Loading အဝိုင်းလေးပြပြီးမှ Google Maps သို့ လွှဲပေးပါမည်
      setTimeout(() => {
        window.location.href = googleReviewUrl;
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    if (!validateEmail(email.trim())) {
      alert("⚠️ Your Gmail looks invalid or temporary. Please enter your real active Gmail address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          { 
            rating: rating, 
            comment: comment, 
            business_name: baseBusinessName,
            branch_name: branchParam,
            email: email.trim()
          }
        ]);

      if (error) throw error;
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error('Error saving to database:', error);
      setIsSubmitting(false);
    }
  };

  const currentActiveRating = hoveredRating ?? rating;

  if (submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#f4f7fa] overflow-hidden px-4">
        <div className="relative max-w-md w-full bg-white p-10 rounded-3xl border border-zinc-200 shadow-xl text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">Thank You So Much!</h2>
          <p className="text-zinc-600 text-base">Your valuable feedback helps us maintain the highest standards of service.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f4f7fa] overflow-hidden px-4">
      <div className="relative max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-4 uppercase tracking-wider">Share Your Experience</span>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{displayBusinessName}</h1>
          <p className="text-zinc-600 text-sm mt-2.5">How was your visit? Tap a star to leave your rating.</p>
        </div>

        {/* ⚡ စိတ်ပညာလှုံ့ဆော်မှု စာသား */}
        <div className="text-center mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl animate-pulse">
          <span className="text-xs font-bold text-amber-800">
            ⚡ Select 5-Stars for instant submission! (No Email Required)
          </span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2 py-1 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-4 shadow-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isRedirecting || isSubmitting}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => !(isRedirecting || isSubmitting) && setHoveredRating(star)}
                onMouseLeave={() => !(isRedirecting || isSubmitting) && setHoveredRating(null)}
                className={`transform transition-all duration-150 focus:outline-none ${isRedirecting || isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:scale-120 active:scale-90'}`}
              >
                <svg xmlns="http://www.w3.org/2000/xl" viewBox="0 0 24 24" fill="currentColor" className={`w-10 h-10 transition-colors duration-200 ${currentActiveRating && currentActiveRating >= star ? 'text-amber-400 drop-shadow-[0_3px_10px_rgba(251,191,36,0.4)]' : 'text-zinc-200'}`}>
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>

          {/* 🌀 ၄၊ ၅ ပွင့်သမားများအတွက် ပေါ်လာမည့် Clean ဖြစ်ပြီး ရိုးရှင်းသော အဝိုင်းပတ် (Spinner) Loading Animation */}
          {isRedirecting && (
            <div className="flex flex-col items-center justify-center p-6 space-y-3 animate-in fade-in duration-200">
              <div className="w-9 h-9 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          {/* 📝 ၁၊ ၂၊ ၃ ပွင့်သမားများအတွက် ပုံမှန် Feedback Form */}
          {rating && rating <= 3 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-zinc-800 block pl-1">Your Gmail Address:</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full p-4 rounded-2xl bg-white border-2 border-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 text-sm font-medium text-zinc-800 placeholder-zinc-400 shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-zinc-800 block pl-1">We'd love to know what we can do better:</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience and how we can improve..."
                  className="w-full p-4 rounded-2xl bg-white border-2 border-zinc-200 focus:border-indigo-500 focus:outline-none text-sm text-zinc-800 shadow-sm"
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-base hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" /> : 'Submit Feedback'}
              </button>

              {/* ⚖️ Legal Policy အရ အောက်ခြေတွင် ပြသထားသည့် သေးငယ်မှိန်ဖျော့သော Link လေး */}
              <div className="text-center pt-2">
                <a 
                  href={googleReviewUrl}
                  className="text-[11px] font-medium text-zinc-400/80 hover:text-indigo-500 transition-colors underline underline-offset-4 decoration-zinc-300/60"
                >
                  Do you want to visit and review on Google Maps directly instead?
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}