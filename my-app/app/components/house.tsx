'use client'
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Brain, Zap, Clock, ShieldCheck, Terminal } from "lucide-react";

export default function House() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 25 },
    },
  };

  const featureCards = [
    {
      icon: Brain,
      title: "AI-Powered Intuition",
      description: "Convert any arbitrary set of leftover ingredients or specific macronutrient profiles into five-star culinary blueprints instantly.",
      color: "from-cyan-500/10 to-blue-500/10",
      textColor: "text-cyan-400",
      iconColor: "text-cyan-400 border-cyan-500/10",
    },
    {
      icon: Zap,
      title: "Precision Nutrients",
      description: "Receive real-time, comprehensive nutritional metrics detailing prep times, exact calories, and calibrated macronutrient content.",
      color: "from-purple-500/10 to-indigo-500/10",
      textColor: "text-purple-400",
      iconColor: "text-purple-400 border-purple-500/10",
    },
    {
      icon: BookOpen,
      title: "Curation Engine",
      description: "Maintain a visually matching digital cookbook loaded with quick bookmarks, active tags, and interactive progress checklists.",
      color: "from-amber-500/10 to-rose-500/10",
      textColor: "text-amber-400",
      iconColor: "text-amber-400 border-amber-500/10",
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-24 py-12 md:py-20"
    >
      {/* Hero Section */}
      <section className="text-center relative max-w-4xl mx-auto space-y-6">
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Culinary Assistant</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white"
        >
          Draft Masterpieces with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            AI Precision
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed"
        >
          AuraChef is an advanced generative platform crafted for culinary connoisseurs. Bridge the gap between random kitchen ingredients and absolute gastronomical perfection.
        </motion.p>

        {/* Action CTAs */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-sm sm:max-w-none mx-auto"
        >
          <Link
            href="/components/send"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95 shadow-xl shadow-white/5"
          >
            <span>Start Generating</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/components/getAll"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 border border-white/[0.06] hover:bg-zinc-800 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-zinc-500" />
            <span>Browse Blueprints</span>
          </Link>
        </motion.div>
      </section>

      {/* Terminal Workspace Mockup */}
      <motion.section 
        variants={itemVariants}
        className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-md shadow-2xl relative"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono font-bold tracking-wider uppercase">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>aurachef-core-compiler</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-8 space-y-5 font-mono text-xs md:text-sm text-zinc-300">
          <div className="flex items-start gap-3">
            <span className="text-cyan-500 font-semibold select-none">aurachef:~$</span>
            <p className="text-white leading-relaxed">generate-recipe --ingredients &quot;salmon fillet, asparagus, rosemary, lemon&quot;</p>
          </div>
          
          <div className="space-y-1.5 pl-4 border-l border-zinc-800 text-zinc-400 leading-relaxed">
            <p className="text-zinc-600">Initializing pairing logic models...</p>
            <p className="text-zinc-600">Configuring micro-nutrients ratios...</p>
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Drafting: Pan-Seared Salmon with Lemon Rosemary Asparagus</span>
            </div>
            <p className="text-zinc-500">Prep: 10 mins  |  Cook: 15 mins  |  Yields: 2 servings</p>
            <p className="text-zinc-500 font-semibold text-[11px] uppercase tracking-wider text-zinc-600">Calories: 450 kcal  |  Protein: 38g  |  Carbs: 8g  |  Fat: 28g</p>
          </div>

          <div className="flex items-center gap-2 pl-4 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Success: Culinary mapping compiled inside database.</span>
          </div>
        </div>
      </motion.section>

      {/* Feature Value Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {featureCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-zinc-900/[0.15] border border-white/[0.04] backdrop-blur-md relative overflow-hidden group hover:border-zinc-800 transition-all duration-300"
            >
              <div className="relative z-10 space-y-4">
                <div className={`w-9 h-9 rounded-xl bg-white/[0.02] border ${card.iconColor} flex items-center justify-center`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{card.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </section>
    </motion.div>
  );
}