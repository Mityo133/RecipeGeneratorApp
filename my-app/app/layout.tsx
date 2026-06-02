import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./style/globals.css";
import Navbar from "@/app/components/Navbar/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-inter), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Ambient Glow Spots */}
        <div className="ambient-glow top-[-15%] left-[-8%]" />
        <div className="ambient-glow top-[30%] right-[-12%]" />
        <div className="ambient-glow bottom-[-5%] left-[30%]" />

        {/* Sticky Full-Width Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[rgba(8,9,12,0.82)] backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="flex-grow py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
