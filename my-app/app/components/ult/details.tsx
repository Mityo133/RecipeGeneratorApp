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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin z-10" />
          <div className="absolute w-12 h-12 bg-cyan-500/10 rounded-full blur-md" />
        </div>
        <p className="text-zinc-500 text-sm font-semibold tracking-wider uppercase">Loading Chef Blueprint...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="p-4 rounded-full bg-zinc-900 border border-white/[0.06] text-zinc-500 shadow-xl shadow-black/25">
          <EyeOff className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Recipe Record Missing</h2>
          <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
            The requested culinary blueprint does not exist or has been deleted from our servers.
          </p>
        </div>
        <Link
          href="/components/getAll"
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/5 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Browse</span>
        </Link>
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