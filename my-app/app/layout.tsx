import type { Metadata } from "next";
import { Geist, Geist_Mono} from "next/font/google";
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
  title: "Recipe App",
  description: "A simple recipe app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ get user correctly
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
      <Navbar/>

        {children}
      </body>
    </html>
  );
}