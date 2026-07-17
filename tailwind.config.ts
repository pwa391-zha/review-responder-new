import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // 🌓 အလင်း/အမှောင် ခလုတ် အလုပ်လုပ်စေရန်
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // 👈 အစ်ကို့ရဲ့ admin ဖိုင်တွေက src/app အောက်မှာမို့ ဒါက အဓိကပါ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;