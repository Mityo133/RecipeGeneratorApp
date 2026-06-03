'use client'
import React, { useState } from "react";
import { FullRecipe } from "../../interfaces/obj";
import Image from 'next/image';
import Button from '@/app/components/ult/button';
import { motion } from "framer-motion";
import { Clock, Users, Flame, Dumbbell, Apple, Droplet, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

interface CardProps {
  data: FullRecipe;
}

export default function Card({ data }: CardProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!data) {
    return (
      <div className={cn('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-[400px]', 'space-y-4', 'text-center', 'relative')}>
        <AlertCircle className={cn('w-12', 'h-12', 'text-purple-400/60', 'animate-bounce', 'relative', 'z-10')} />
        <h2 className={cn('text-xl', 'font-bold', 'text-slate-700', 'relative', 'z-10')}>Data is undefined!</h2>
        <p className={cn('text-slate-500', 'max-w-xs', 'text-sm', 'relative', 'z-10')}>Failed to retrieve blueprint details from server.</p>
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

  const tags = data.recipe.tags || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('max-w-4xl', 'mx-auto', 'p-6', 'md:p-10', 'space-y-10', 'relative', 'z-10', 'glass-card', 'rounded-3xl')}
    >
      {/* Premium Hero Spotlight Banner */}
      <motion.div
        variants={itemVariants}
        className={cn('relative', 'overflow-hidden', 'border', 'border-purple-200/30', 'bg-gray-800', 'aspect-[16/9]', 'md:aspect-[21/9]', 'glass-card')}
      >

        <Image
          src={data.recipe.imageURL || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"}
          fill
          alt={data.recipe.name}
          className={cn('object-cover', 'transition-transform', 'duration-700', 'hover:scale-102', 'bg-gray-800/75')}
          priority
          sizes="(max-width: 1200px) 100vw, 1000px"
          style={{
            filter: 'brightness(70%) blur(2px)'
          }}
        />
        {/* Dark Vignette Overlay */}
        <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-slate-900', 'via-slate-900/30', 'to-transparent')} />

        {/* Floating Accent Title Content */}
        <div className={cn('absolute', 'bottom-0', 'left-0', 'right-0', 'p-6', 'md:p-8', 'space-y-3', 'relative', 'z-10')}>
          <div className={cn('flex', 'flex-wrap', 'gap-2')}>
            {tags.map((tag, index) => {
              const tagText = typeof tag === 'string' ? tag : (tag.names || tag.id);
              return (
                <span key={index} className="badge">
                  {tagText}
                </span>
              );
            })}
          </div>
          <h1 className={cn(
            'text-2xl',
            'md:text-4xl',
            'font-extrabold',
            'tracking-tight',
            'leading-tight',
            'relative',
            'z-10',
            // Gradient Classes
            'bg-gradient-to-r',
            'from-purple-600',
            'via-blue-500',
            'via-pink-500',
            'to-cyan-400',
            'bg-clip-text',
            'text-transparent',
            // FIXED: 4px down, 4px right, 0px blur makes a distinct, solid blocky shadow
            'drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]'
          )}>
            {data.recipe.name}
          </h1>
        </div>
      </motion.div>

      {/* Action Favorites & Quick Metadata */}
      <motion.div
        variants={itemVariants}
        className={cn('flex', 'flex-col', 'sm:flex-row', 'items-start', 'sm:items-center', 'justify-between', 'gap-4', 'p-6', 'rounded-sm', 'glass-card', 'shadow-inner', 'border')}
      >
        <div className={cn('space-y-1', 'relative')}>
          <span className={cn('text-gray-500', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider', 'relative', 'z-10')}>Culinary Plan</span>
          <p className={cn('text-gray-500', 'text-sm', 'font-medium', 'leading-relaxed', 'relative', 'z-10',)}>
            Configure this recipe details in your private list database.
          </p>
        </div>
        <Button mealId={data.recipe.id} />
      </motion.div>

      {/* Description */}
      <motion.section variants={itemVariants} className="space-y-3">
        <h3 className={cn('text-purple-600', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider', 'flex', 'items-center', 'gap-1.5', 'relative')}>
          <Sparkles className={cn('w-3.5', 'h-3.5', 'text-purple-500')} />
          <span className={cn('relative', 'z-10')}>Description Overview</span>
        </h3>
        <p className={cn('text-slate-100', 'text-lg', 'font-normal', 'leading-relaxed', 'relative', 'z-10', 'text-white')}>
          {data.recipe.description}
        </p>
      </motion.section>

      {/* Performance Metrics Grid */}
      <motion.section
        variants={itemVariants}
        className={cn('gap-4')}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
        }}
      >
        {[
          { label: "Prep Duration", value: `${data.recipe.prepTime} Mins`, color: "text-cyan-100", icon: Clock },
          { label: "Cook Duration", value: `${data.recipe.cookTime} Mins`, color: "text-cyan-100", icon: Clock },
          { label: "Total Duration", value: `${data.recipe.totalTime} Mins`, color: "text-cyan-100", icon: Clock },
          { label: "Yield Count", value: `${data.recipe.servings} Servings`, color: "text-cyan-100", icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={cn(
                'p-5',
                'rounded-sm',
                'surface-card',
                'hover-lift',
                'text-center',
                'space-y-1',
                'relative',
                'group',
                'overflow-hidden'
              )}
            >
              <div className={cn('absolute', 'top-0', 'left-0', 'w-full', 'h-[1.5px]', 'bg-gradient-to-r', 'from-transparent', 'via-purple-300/30', 'to-transparent', 'group-hover:via-purple-400/50', 'transition-all', 'duration-300')} />
              <Icon className={`w-4 h-4 mx-auto mb-2 ${stat.color}`} />
              <span className={cn('text-[10px]', 'uppercase', 'tracking-wider', 'font-semibold', 'relative', 'z-10')}>{stat.label}</span>
              <p className={cn('text-base', 'font-bold', 'relative', 'z-10')}>{stat.value}</p>
            </div>
          );
        })}
      </motion.section>

      {/* Macro Nutrition Widgets */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="space-y-1">
          <h3 className={cn('text-whie', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider')}>Macronutrients Blueprint</h3>
          <p className={cn('text-whie', 'text-xs')}>Total nutrition levels mapped per recommended serving.</p>
        </div>

        <div
          className={cn('gap-4')}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
          }}
        >

          {[
            { label: "Calories", value: data.recipe.calories, icon: Flame, color: "text-orange-600", suffix: "kcal", barColor: "bg-orange-500" },
            { label: "Protein", value: data.recipe.protein, icon: Dumbbell, color: "text-emerald-600", suffix: "g", barColor: "bg-emerald-500" },
            { label: "Carbohydrates", value: data.recipe.carbs, icon: Apple, color: "text-amber-600", suffix: "g", barColor: "bg-amber-500" },
            { label: "Fat Content", value: data.recipe.fat, icon: Droplet, color: "text-blue-600", suffix: "g", barColor: "bg-blue-500" },
          ].map((macro, idx) => {
            const Icon = macro.icon;
            const valNum = parseInt(macro.value?.replace(/[^0-9]/g, '') || "0");
            const percentage = Math.min(100, Math.max(8, macro.label === "Calories" ? (valNum / 800) * 100 : (valNum / 60) * 100));

            return (
              <div
                key={idx}
                className={cn(
                  'p-5',
                  'rounded-sm',
                  'surface-card',
                  'hover-lift',
                  'space-y-4',
                  'text-slate-100',
                  'transition-all',
                  'duration-300'
                )}
              >
                <div className={cn('flex', 'items-center', 'justify-between')}>
                  <span className={cn('text-[10px]', 'text-white', 'font-semibold', 'uppercase', 'tracking-wider', 'relative', 'z-10')}>{macro.label}</span>
                  <Icon className={`w-4 h-4 ${macro.color}`} />
                </div>
                <div className="space-y-1.5">
                  <p className={cn('text-xl', 'font-extrabold', 'text-slate-700', 'tracking-tight', 'relative', 'z-10')}>
                    {macro.value}
                    <span className={cn('text-xs', 'text-white', 'font-medium', 'ml-0.5', 'relative', 'z-10')}>{macro.value?.includes(macro.suffix) ? "" : macro.suffix}</span>
                  </p>
                  <div className={cn('h-1.5', 'w-full', 'bg-slate-200', 'rounded-full', 'overflow-hidden')}>
                    <div className={`h-full ${macro.barColor} rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Checkable Ingredients list */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="space-y-1">
          <h3 className={cn('text-slate-200', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider')}>Required Ingredients</h3>
          <p className={cn('text-slate-400', 'text-xs')}>Tap items to check off ingredients as you aggregate them.</p>
        </div>

        <div className={cn('p-6', 'rounded-sm', 'glass-card', 'border')}>
          <ul
            className={cn('gap-4')}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
            }}
          >

            {data.ingridients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <li
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={cn(
                    'flex',
                    'items-center',
                    'gap-2',
                    'py-2',
                    'px-3',
                    'rounded-xl',
                    'glass-card',
                    'hover-lift',
                    'text-slate-200',
                    'cursor-pointer',
                    'group',
                    'transition-colors',
                    'select-none'
                  )}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isChecked
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-600"
                      : "border-slate-300 group-hover:border-purple-400"
                      }`}
                  >
                    {isChecked && <CheckCircle2 className={cn('w-3.5', 'h-3.5')} />}
                  </div>
                  <span className={`text-sm font-semibold tracking-tight ${isChecked ? 'text-cyan-600/70' : 'text-cyan-600'}`}>
                    {ing.quantity}
                  </span>
                  <span className={`text-sm tracking-tight transition-all leading-relaxed ${isChecked ? "line-through text-slate-400" : "text-slate-600"
                    }`}>
                    {ing.item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.section>

      {/* Interactive Step-by-Step Instructions */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="space-y-1">
          <h3 className={cn('text-slate-600', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider')}>Culinary Instructions</h3>
          <p className={cn('text-slate-500', 'text-xs')}>Follow step-by-step. Click a step card to record your progress.</p>
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
                  className={`text-white p-5 rounded-sm border transition-all duration-300 cursor-pointer select-none flex gap-4 items-start relative glass-card hover-lift ${isDone
                    ? "opacity-60 border-white/20"
                    : "border-purple-200/40"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${isDone
                    ? "bg-gray-900 border-slate-300 text-slate-200"
                    : "bg-gray-950 border-purple-300 text-slate-700 shadow-md shadow-purple-100/50"
                    }`}>
                    {isDone ? <CheckCircle2 className={cn('w-4', 'h-4', 'text-emerald-600')} /> : step.stepnumber}
                  </div>
                  <div className={cn('space-y-1.5', 'pt-0.5', 'relative')}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isDone ? 'text-slate-400' : 'text-slate-500'}`}>
                      Step {step.stepnumber}
                    </span>
                    <p className={`text-sm leading-relaxed transition-all relative z-10 ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </motion.section>

      {/* Chef Notes */}
      {data.recipe.notes && (
        <motion.section
          variants={itemVariants}
          className={cn('p-6', 'rounded-sm', 'bg-gray-900', 'hover:bg-gray-950', 'border', 'border-orange-200/50', 'backdrop-blur-md', 'space-y-3', 'relative')}
        >
          <h3 className={cn('text-white', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider', 'flex', 'items-center', 'gap-1.5', 'relative')}>
            <AlertCircle className={cn('w-4', 'h-4')} />
            <span className={cn('relative', 'z-10')}>Culinary Architect Notes</span>
          </h3>
          <p className={cn('text-slate-700', 'text-sm', 'leading-relaxed', 'font-normal', 'relative', 'z-10')}>
            {data.recipe.notes}
          </p>
        </motion.section>
      )}
    </motion.div>
  );
}
