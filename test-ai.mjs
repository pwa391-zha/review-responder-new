import Groq from "groq-sdk";



async function testReply() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "ဝယ်သူပေးတဲ့ Review ကို မြန်မာလို ယဉ်ကျေးစွာ ပြန်စာရေးပေးပါ။" },
        { role: "user", content: "ဒီဆိုင်က ဝန်ဆောင်မှု အရမ်းကောင်းတယ်၊ သဘောကျလို့ နောက်လည်း ထပ်ဝယ်မယ်။" }
      ],
      model: "llama-3.3-70b-versatile", // <--- ဒီစာကြောင်းကို အခုလိုပဲ အတိအကျ ပြင်ပေးပါ
    });

    console.log("AI ၏ ပြန်စာ ->", completion.choices[0].message.content);
  } catch (error) {
    console.error("Error တက်သွားပါတယ် ->", error);
  }
}

testReply();