'use client'
import React, { useState } from "react";
import { FullRecipe } from "../../interfaces/obj";
import Image from 'next/image';
import Button from '@/app/components/ult/button';
import { motion } from "framer-motion";
import { Clock, Users, Flame, Dumbbell, Apple, Droplet, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

interface CardProps {
  data: FullRecipe;
}

export default function Card({ data }: CardProps) {
  // Client state to track checked ingredients and completed steps (interactive!)
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-zinc-500 animate-bounce" />
        <h2 className="text-xl font-bold text-zinc-300">Data is undefined!</h2>
        <p className="text-zinc-500 max-w-xs text-sm">Failed to retrieve blueprint details from server.</p>
      </div>
    );
  }

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (stepNo: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepNo]: !prev[stepNo] }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 240, damping: 25 } }
  };

  // Safe parse tags
  const tags = data.recipe.tags || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 relative z-10"
    >
      {/* 📸 Premium Hero Spotlight Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] aspect-[16/9] md:aspect-[21/9]"
      >
        <Image
          src={data.recipe.imageURL || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"}
          fill
          alt={data.recipe.name}
          className="object-cover transition-transform duration-700 hover:scale-102"
          priority
          sizes="(max-width: 1200px) 100vw, 1000px"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
        
        {/* Floating Accent Title Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const tagText = typeof tag === 'string' ? tag : (tag.names || tag.id);
              return (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider font-bold text-cyan-400"
                >
                  {tagText}
                </span>
              );
            })}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {data.recipe.name}
          </h1>
        </div>
      </motion.div>

      {/* 🚀 Action Favorites & Quick Metadata */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/20 border border-white/[0.05] backdrop-blur-md"
      >
        <div className="space-y-1">
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Culinary Plan</span>
          <p className="text-zinc-300 text-sm font-medium leading-relaxed">
            Configure this recipe details in your private list database.
          </p>
        </div>
        <Button mealId={data.recipe.id} />
      </motion.div>

      {/* 📝 Description */}
      <motion.section variants={itemVariants} className="space-y-3">
        <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Description Overview</span>
        </h3>
        <p className="text-zinc-300 text-lg font-normal leading-relaxed">
          {data.recipe.description}
        </p>
      </motion.section>

      {/* ⏱️ Performance Metrics Grid */}
      <motion.section 
        variants={itemVariants} 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: "Prep Duration", value: `${data.recipe.prepTime} Mins`, color: "text-cyan-400", icon: Clock },
          { label: "Cook Duration", value: `${data.recipe.cookTime} Mins`, color: "text-purple-400", icon: Clock },
          { label: "Total Duration", value: `${data.recipe.totalTime} Mins`, color: "text-pink-400", icon: Clock },
          { label: "Yield Count", value: `${data.recipe.servings} Servings`, color: "text-amber-400", icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-zinc-900/20 border border-white/[0.05] backdrop-blur-md text-center space-y-1 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent group-hover:via-zinc-500/40 transition-all duration-300" />
              <Icon className={`w-4 h-4 mx-auto mb-2 ${stat.color}`} />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">{stat.label}</span>
              <p className="text-base font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </motion.section>

      {/* 🥦 Macro Nutrition Widgets */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Macronutrients Blueprint</h3>
          <p className="text-zinc-400 text-xs">Total nutrition levels mapped per recommended serving.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: data.recipe.calories, icon: Flame, color: "text-orange-400", suffix: "kcal", barColor: "bg-orange-500" },
            { label: "Protein", value: data.recipe.protein, icon: Dumbbell, color: "text-emerald-400", suffix: "g", barColor: "bg-emerald-500" },
            { label: "Carbohydrates", value: data.recipe.carbs, icon: Apple, color: "text-amber-400", suffix: "g", barColor: "bg-amber-500" },
            { label: "Fat Content", value: data.recipe.fat, icon: Droplet, color: "text-blue-400", suffix: "g", barColor: "bg-blue-500" },
          ].map((macro, idx) => {
            const Icon = macro.icon;
            // Clean value from non-digits if needed for progress bars
            const valNum = parseInt(macro.value?.replace(/[^0-9]/g, '') || "0");
            const percentage = Math.min(100, Math.max(8, macro.label === "Calories" ? (valNum / 800) * 100 : (valNum / 60) * 100));

            return (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900/30 border border-white/[0.06] backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">{macro.label}</span>
                  <Icon className={`w-4 h-4 ${macro.color}`} />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xl font-extrabold text-white tracking-tight">
                    {macro.value}
                    <span className="text-xs text-zinc-500 font-medium ml-0.5">{macro.value?.includes(macro.suffix) ? "" : macro.suffix}</span>
                  </p>
                  {/* Subtle Macro Bar Indicator */}
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${macro.barColor} rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* 🛒 Checkable Ingredients list */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Required Ingredients</h3>
          <p className="text-zinc-400 text-xs">Tap items to check off ingredients as you aggregate them.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/[0.05] backdrop-blur-md">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.ingridients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <li
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-white/[0.02] cursor-pointer group transition-colors select-none"
                >
                  <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                    isChecked 
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
                      : "border-zinc-700 group-hover:border-zinc-500"
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-sm font-semibold tracking-tight ${isChecked ? 'text-cyan-400/80' : 'text-cyan-400'}`}>
                    {ing.quantity}
                  </span>
                  <span className={`text-sm tracking-tight transition-all leading-relaxed ${
                    isChecked ? "line-through text-zinc-600" : "text-zinc-300"
                  }`}>
                    {ing.item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.section>

      {/* 👣 Interactive Step-by-Step Instructions */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Culinary Instructions</h3>
          <p className="text-zinc-400 text-xs">Follow step-by-step. Click a step card to record your progress.</p>
        </div>

        <div className="space-y-4">
          {[...data.instructions]
            .sort((a, b) => a.stepnumber - b.stepnumber)
            .map((step) => {
              const isDone = !!completedSteps[step.stepnumber];
              return (
                <div
                  key={step.stepnumber}
                  onClick={() => toggleStep(step.stepnumber)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex gap-4 items-start ${
                    isDone 
                      ? "bg-zinc-950/20 border-zinc-800/40 opacity-50" 
                      : "bg-zinc-900/20 border-white/[0.05] hover:border-white/10 hover:bg-zinc-900/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone 
                      ? "bg-zinc-800 border-zinc-700 text-zinc-500" 
                      : "bg-zinc-900 border-white/[0.08] text-white shadow-md shadow-black/20"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step.stepnumber}
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isDone ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      Step {step.stepnumber}
                    </span>
                    <p className={`text-sm leading-relaxed transition-all ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </motion.section>

      {/* 💡 Chef Notes */}
      {data.recipe.notes && (
        <motion.section 
          variants={itemVariants}
          className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 backdrop-blur-md space-y-3"
        >
          <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Culinary Architect Notes</span>
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-normal">
            {data.recipe.notes}
          </p>
        </motion.section>
      )}
    </motion.div>
  );
}
