import { NextResponse } from 'next/server';

// 🎯 Groq Down ဖြစ်သွားရင် သုံးမယ့် Fallback Static Template စာသား
const FALLBACK_TEMPLATE = `Dear valued customer,

We appreciate you taking the time to share your experience at our Main Branch. We understand your review did not meet your expectations, and for that, we regret any inconvenience this may have caused. We take all feedback seriously and are committed to continually improving our services. We have taken note of your concerns and made the necessary adjustments to prevent similar situations in the future. Your feedback is invaluable to us, and we appreciate your continued business.

Best regards,
Senior Customer Relations Executive`;

export async function POST(req: Request) {
  try {
    const { rating, comment, branch } = await req.json();
    const branchName = branch || "Main Branch";
    
    const apiKey = process.env.GROQ_API_KEY; 

    if (!apiKey) {
      console.error("❌ Groq API Key is missing in .env. Using fallback template.");
      return NextResponse.json({ success: true, aiGeneratedMessage: FALLBACK_TEMPLATE });
    }
    
    const url = "https://api.groq.com/openai/v1/chat/completions";

    // 🎯 မွမ်းမံထားသော Prompt: စာလုံးတိုလေးတွေ (ဥပမာ- Peakkk) ရေးရင်တောင် Context ကို နားလည်အောင် ပြင်ဆင်ထားသည်
    const prompt = `You are a Senior Customer Relations Executive for our premium business network. 
    A customer left a ${rating}-star review with the following feedback: "${comment}" at our ${branchName} branch.

    CRITICAL RULES FOR YOUR RESPONSE:
    1. ANALYZE THE CUSTOMER'S INTENT: If the text is positive (e.g., "Peakkk", "great", "love it"), write a highly enthusiastic, formal thank-you email. If the text or rating is negative, write an empathetic apology.
    2. Context Awareness: Understand modern slang like "Peakkk" means high praise. Do not apologize if the text is clearly praising the business.
    3. DO NOT ask questions like "How can I help you today?" or "What can I do for you?". 
    4. Treat the issue as handled, acknowledged, or celebrated. Write the response as a conclusive, formal business statement.
    5. Keep the text concise (maximum 100 words), natural, and human-like.
    6. Omit all placeholders like [Customer Name], [Your Name], or Subject lines. Write ONLY the actual body text directly.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", 
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.5 // ⚡ စာသားတွေ ပိုမိုတည်ငြိမ်ပြီး အမှားနည်းအောင် တန်ဖိုးကို 0.5 သို့ လျှော့ချထားသည်
      })
    });

    // 🎯 SERVER ERROR FALLBACK: Groq API Error တက်ခဲ့ရင် (ဥပမာ- Rate Limit ပြည့်သွားရင်) Static Template သို့ လွှဲပေးမည်
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("⚠️ Groq API Server Error. Triggering Fallback Template:", JSON.stringify(errorData, null, 2));
      return NextResponse.json({ success: true, aiGeneratedMessage: FALLBACK_TEMPLATE });
    }

    const data = await response.json();
    const aiGeneratedMessage = data.choices[0]?.message?.content;

    if (!aiGeneratedMessage) {
      return NextResponse.json({ success: true, aiGeneratedMessage: FALLBACK_TEMPLATE });
    }

    return NextResponse.json({ success: true, aiGeneratedMessage });

  } catch (error: any) {
    // 🎯 CATCH BLOCK FALLBACK: Internet ပြတ်တောက်မှု သို့မဟုတ် အခြား Error များအတွက် ဒေါင်းမသွားအောင် ထိန်းပေးခြင်း
    console.error("⚠️ Exception Caught In Route. Triggering Fallback Template:", error);
    return NextResponse.json({ success: true, aiGeneratedMessage: FALLBACK_TEMPLATE });
  }
}