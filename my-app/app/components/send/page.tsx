'use client'
import { useEffect, useState } from 'react'
import { SendRecipe } from '../../interfaces/utilities/fetching'
import { FullRecipe } from '../../interfaces/obj'
import { useRouter } from "next/navigation";
import { supabase } from "../../interfaces/utilities/fetching"
import Card from '../ult/card'
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Sparkles, Send as SendIcon, Loader2, ListPlus, Wand2 } from 'lucide-react';

export default function Send() {
  const router = useRouter();
  const [promt, setPromt] = useState("");
  const [recipe, setRecipe] = useState<FullRecipe | undefined>(undefined);
  const [load, setLoad] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/components/login");
        return;
      }
    };
    check();
  }, [router]);

  // Loading text steps
  const loadingMessages = [
    "Connecting to AuraChef AI engines...",
    "Analyzing nutrient compatibility profiles...",
    "Perfecting calories & macronutrient ratios...",
    "Drafting step-by-step culinary blueprints...",
    "Garnishing with chef secret tips...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (load) {
      interval = setInterval(() => {
        setLoadStep(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadStep(0);
    }
    return () => clearInterval(interval);
  }, [load]);

  const presetChips = [
    "Salmon, wild asparagus, fresh lemon, olive oil",
    "Chicken breast, avocado, cherry tomatoes, baby spinach",
    "High-protein vegan dinner with tofu and broccoli",
    "Under 20 minutes healthy lunch leftover ideas",
    "Low-carb keto steak marinade with garlic butter",
  ];

  const handleChipClick = (preset: string) => {
    setPromt(preset);
  };

  const handleGenerate = async () => {
    if (!promt.trim()) return;
    setLoad(true);
    setRecipe(undefined);
    try {
      const res = await SendRecipe(promt);
      setRecipe(res);
    } catch (error) {
      console.error("Failed to generate recipe:", error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen relative space-y-8">
      {/* Background ambient radial lights */}
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] bg-indigo-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <section className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/[0.03] border border-cyan-500/10 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Generative Workspace</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Culinary{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            AI Architect
          </span>
        </h1>
        <p className="text-zinc-400 max-w-lg text-base">
          Input your available ingredients or target meal structure. Let the AI draft perfect cookbook recipes.
        </p>
      </section>

      {/* 🔥 GRID LAYOUT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* LEFT COLUMN (FORM CONTROLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/[0.05] backdrop-blur-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Ingredients Terminal</span>
              </h2>
              <p className="text-zinc-500 text-xs font-medium">Input raw values or comma-separated lists.</p>
            </div>

            {/* Input area */}
            <div className="space-y-3">
              <textarea
                value={promt}
                onChange={(e) => setPromt(e.target.value)}
                placeholder="Examples: 250g ribeye steak, fresh mushrooms, shallots, butter, sprig of thyme..."
                className="w-full h-44 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-4 text-white text-sm outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 focus:bg-black/60 transition-all duration-300 resize-none leading-relaxed"
              />

              {/* Quick Helper presets */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1">
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Prompt presets assist</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-zinc-700 text-zinc-400 hover:text-white text-xs text-left transition-all cursor-pointer"
                    >
                      {chip.length > 40 ? chip.substring(0, 37) + "..." : chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleGenerate}
              disabled={load || !promt.trim()}
              className="w-full py-4 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold tracking-tight shadow-xl hover:bg-zinc-200 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {load ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                  <span>Constructing Recipe...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Draft AI Recipe Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (RESULT PREVIEW) */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-900/10 border border-white/[0.04] border-dashed min-h-[500px] flex items-center justify-center overflow-hidden relative">
          <AnimatePresence mode="wait">
            {load ? (
              /* PREMIUM GLASS SPINNER CONTAINER */
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center justify-center p-8 space-y-6 text-center z-10"
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">Generating Blueprint</h3>
                  <p className="text-zinc-400 text-sm max-w-xs font-mono h-8 transition-all duration-300">
                    {loadingMessages[loadStep]}
                  </p>
                </div>
              </motion.div>
            ) : recipe ? (
              /* DYNAMIC RECIPE CARD DISPLAY */
              <motion.div
                key="recipe-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring" as const, stiffness: 240, damping: 25 }}
                className="w-full h-full"
              >
                <Card data={recipe} />
              </motion.div>
            ) : (
              /* EMPTY PREVIEW LANDING */
              <motion.div
                key="empty-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 space-y-4 max-w-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mx-auto text-zinc-500 shadow-xl shadow-black/25">
                  <Wand2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">No Recipe Compiled</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Input ingredients and trigger compilation. Generated recipe metrics will render here in real-time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}