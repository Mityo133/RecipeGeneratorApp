// src/app/components/details.tsx
'use client'
import { useEffect, useState } from "react";
import { GetRecipeById } from "@/app/interfaces/utilities/fetching";
import { FullRecipe } from "@/app/interfaces/obj";
import Card from "./card";
import Link from "next/link";
import { Loader2, ArrowLeft, EyeOff } from "lucide-react";

export default function Details({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result: FullRecipe = await GetRecipeById(id);
        setRecipe(result);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 glass-panel rounded-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 ambient-glow" style={{ width: 220, height: 220, background: "radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-28 -right-24 ambient-glow" style={{ width: 240, height: 240, background: "radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)" }} />
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-cyan-300 animate-spin z-10" />
            <div className="absolute w-12 h-12 bg-cyan-500/10 rounded-full blur-md" />
          </div>
          <div className="text-center space-y-2 relative z-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">Loading Chef Blueprint...</p>
            <p className="gradient-text text-sm font-semibold">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-full max-w-md glass-panel rounded-2xl p-8 md:p-10 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-2xl glass-card glow-ring">
              <EyeOff className="w-8 h-8 text-rose-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="gradient-text">Recipe Record Missing</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                The requested culinary blueprint does not exist or has been deleted from our servers.
              </p>
            </div>
          </div>

          <Link
            href="/components/getAll"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all active:scale-95 gradient-btn relative z-10 hover-lift"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-black" />
            <span className="text-black">Back to Browse</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <Link
          href="/components/getAll"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 border border-white/[0.05] hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
          <span>Browse Feed</span>
        </Link>
      </div>
      <Card data={recipe} />
    </div>
  );
}