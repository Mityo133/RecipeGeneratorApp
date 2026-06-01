import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style/globals.css";
import Navbar from "@/app/components/Navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraChef — AI Culinary Architect",
  description: "Generate world-class, premium recipes using state-of-the-art AI technology. Styled for culinary connoisseurs.",
  keywords: ["AI recipe generator", "gourmet cooking", "meal planner", "premium recipes", "AuraChef"],
  authors: [{ name: "AuraChef Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#030303] text-[#fafafa] relative font-sans`}
      >
        {/* Modern Ambient Glowing Spotlights & Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/[0.03] to-transparent pointer-events-none blur-[100px] z-0" />
        <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full pointer-events-none blur-[120px] z-0" />

        {/* Sticky Full-Width Header Wrapper */}
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#030303]/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
          </div>
        </header>
        
        {/* Main Content Layout Container */}
        
<div className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="flex-grow py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}