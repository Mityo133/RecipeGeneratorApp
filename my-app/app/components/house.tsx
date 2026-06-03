'use client'
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Brain, Zap, ShieldCheck, Terminal } from "lucide-react";

export default function House() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 280, damping: 26 },
    },
  };

  const featureCards = [
    {
      icon: Brain,
      title: "AI-Powered Intuition",
      description: "Convert any set of leftover ingredients or specific macronutrient profiles into five-star culinary blueprints instantly.",
      accentColor: "rgba(34, 211, 238, 0.8)",
      borderAccent: "rgba(34, 211, 238, 0.12)",
      bgAccent: "rgba(34, 211, 238, 0.04)",
    },
    {
      icon: Zap,
      title: "Precision Nutrients",
      description: "Real-time, comprehensive nutritional metrics — exact calories, prep times, and calibrated macronutrient content.",
      accentColor: "rgba(168, 85, 247, 0.8)",
      borderAccent: "rgba(168, 85, 247, 0.12)",
      bgAccent: "rgba(168, 85, 247, 0.04)",
    },
    {
      icon: BookOpen,
      title: "Curation Engine",
      description: "A visually-matched digital cookbook with quick bookmarks, intelligent tags, and interactive progress checklists.",
      accentColor: "rgba(236, 72, 153, 0.8)",
      borderAccent: "rgba(236, 72, 153, 0.12)",
      bgAccent: "rgba(236, 72, 153, 0.04)",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-28 py-10 md:py-16"
    >
      {/* ── Hero Section ── */}
      <section className="text-center relative max-w-4xl mx-auto space-y-7">
        {/* Decorative glow sphere behind title */}
          <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "clamp(18rem, 50vw, 37.5rem)",
            height: "clamp(9rem, 25vw, 18.75rem)",
            background: "radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.04) 50%, transparent 80%)",
            filter: "blur(40px)",
          }}
        />

        <motion.div variants={itemVariants} className="badge mx-auto">
          <Sparkles className="w-3 h-3" />
          <span>Interactive Culinary Assistant</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-bold tracking-tight leading-[1.04] text-white relative"
          style={{
            fontSize: "clamp(2.25rem, 4.2vw, 4.5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Draft Masterpieces{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">with AI Precision</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-xl mx-auto leading-relaxed text-white"
          style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)" }}
        >
          AuraChef is an advanced generative platform crafted for culinary connoisseurs. Bridge the gap between random kitchen ingredients and gastronomical perfection.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm sm:max-w-none mx-auto"
        >
          <Link
            href="/components/send"
            id="hero-cta-generate"
            className="gradient-btn w-full sm:w-auto px-7 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 group"
          >
            <span>Start Generating</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href="/components/getAll"
            id="hero-cta-browse"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12] text-zinc-300 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-zinc-500" />
            <span>Browse Blueprints</span>
          </Link>
        </motion.div>
      </section>

      {/* ── Terminal Workspace Mockup ── */}
      <motion.section
        variants={itemVariants}
        className="max-w-3xl mx-auto rounded-2xl overflow-hidden relative"
        style={{
          background: "rgba(8,9,12,0.90)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.06)",
        }}
      >
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5) 35%, rgba(34,211,238,0.35) 70%, transparent)" }} />

        {/* Title bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.35)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>aurachef-core</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Terminal content */}
        <div className="p-6 md:p-8 space-y-5 font-mono text-[13px] text-zinc-300">
          <div className="flex items-start gap-3">
            <span className="text-purple-400 font-semibold select-none flex-shrink-0">›</span>
            <p className="text-white leading-relaxed">
              generate-recipe --ingredients <span style={{ color: "var(--accent-cyan)" }}>&quot;salmon, asparagus, rosemary, lemon&quot;</span>
            </p>
          </div>

          <div className="space-y-1.5 pl-4 text-zinc-500 leading-relaxed" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
            <p>Initializing AI pairing models...</p>
            <p>Configuring micro-nutrient ratios...</p>
            <div className="flex items-center gap-2" style={{ color: "var(--accent-cyan)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
              <span>Drafting: Pan-Seared Salmon with Lemon Rosemary Asparagus</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.25)" }}>Prep: 10 min  ·  Cook: 15 min  ·  Yields: 2 servings</p>
            <p className="text-[11px] tracking-wider uppercase font-semibold" style={{ color: "rgba(255,255,255,0.18)" }}>
              Calories: 450 kcal  ·  Protein: 38g  ·  Carbs: 8g  ·  Fat: 28g
            </p>
          </div>

          <div className="flex items-center gap-2 pl-4 font-semibold text-emerald-400 text-[13px]">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>
              Success — culinary blueprint compiled
              <span className="cursor-blink ml-0.5">_</span>
            </span>
          </div>
        </div>
      </motion.section>

      {/* ── Feature Cards ── */}
      <section
        className="mx-auto gap-5"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
        }}
      >
        {featureCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="glass-card p-6 rounded-2xl relative overflow-hidden"
              style={{ borderColor: card.borderAccent }}
            >
              {/* Top accent glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accentColor.replace("0.8", "0.4")} 50%, transparent)` }}
              />

              <div className="relative z-10 space-y-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: card.bgAccent, border: `1px solid ${card.borderAccent}` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.accentColor }} />
                </div>
                <h3
                  className="text-sm font-semibold text-white tracking-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {card.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>
    </motion.div >
  );
}