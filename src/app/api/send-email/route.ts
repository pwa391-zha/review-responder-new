// src/app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Incoming Request Body:", body);

    // ----------------------------------------------------
    // ပုံစံ (က) - Admin Dashboard ကနေ Customer ဆီ Reply ပြန်တဲ့အခါ
    // ----------------------------------------------------
    if (body.to && body.message) {
      const { to, subject, message, reviewId } = body;

      // ၁။ Customer ဆီ အီးမေးလ် အရင် ပို့မယ်
      const emailData = await resend.emails.send({
        from: 'Alpha Dental Clinic <onboarding@resend.dev>',
        to: [to],
        subject: subject || 'Feedback Follow-up',
        text: message,
      });

      console.log("Resend API Response:", emailData);

      // ၂။ အီးမေးလ် ပို့ပြီးရင် Supabase မှာ is_replied ကို true သွားပြင်မယ်
      if (reviewId) {
        const { data: updateData, error: updateError } = await supabase
          .from('reviews')
          .update({ is_replied: true })
          .eq('id', String(reviewId))
          .select();

        if (!updateData || updateData.length === 0) {
          await supabase
            .from('reviews')
            .update({ is_replied: true })
            .eq('id', Number(reviewId))
            .select();
        }

        if (updateError) {
          console.error("Supabase Update Error:", updateError);
        }
      }

      return NextResponse.json({ success: true, data: emailData });
    }

    // ----------------------------------------------------
    // ပုံစံ (ခ) - Customer က Review ပေးလို့ ပိုင်ရှင်ဆီ Alert ပို့တဲ့အခါ
    // ----------------------------------------------------
    const { rating, comment, businessName } = body;

    const data = await resend.emails.send({
      from: 'Feedback Alert <onboarding@resend.dev>',
      to: ['pwa391@gmail.com'],
      subject: `⚠️ New Negative Feedback Received for ${businessName || 'Alpha Dental Clinic'}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #dc2626;">Alert: Low Rating Received!</h2>
          <p>A customer has left a low rating for <strong>${businessName || 'Alpha Dental Clinic'}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Rating Given:</strong> ${rating} / 5 Stars</p>
          <p><strong>Customer Comment:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #e11d48; font-style: italic;">
            "${comment || 'No comment provided'}"
          </blockquote>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666;">This alert was generated automatically by your QR Review Funnel System.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Catch Block Error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}