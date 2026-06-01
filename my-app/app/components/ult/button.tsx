'use client'
import { supabase } from "@/app/interfaces/utilities/fetching";
import { useState, useEffect } from "react";
import { AddFavoriteFood, GetTheUsersMeals, RemoveFavoriteFood } from '@/app/interfaces/utilities/fetching'
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function Button({ mealId }: { mealId: string }) {
  const [favorited, setFavorited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const CheckForUsersFood = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const value: boolean = await GetTheUsersMeals(user.id, mealId);
          setFavorited(value);
        }
        setLoading(false);
      };
      CheckForUsersFood();
    } catch (error) {
      console.error("Error checking favorite status:", error);
      setLoading(false);
    }
  }, [mealId]);

  const handleToggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (favorited) {
      const result = await RemoveFavoriteFood(user.id, mealId);
      if (result) setFavorited(false);
    } else {
      await AddFavoriteFood(user.id, mealId);
      setFavorited(true);
    }
  };

  if (loading) {
    return (
      <div className="h-10 w-36 bg-zinc-800/40 rounded-xl animate-pulse border border-white/[0.04]" />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleToggleFavorite}
      className={`px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
        favorited
          ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)] hover:bg-rose-500/20"
          : "bg-zinc-900 border-white/[0.06] text-zinc-300 hover:text-white hover:bg-zinc-800"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          favorited ? "fill-rose-500 text-rose-500 scale-110" : "text-zinc-400 group-hover:text-white"
        }`}
      />
      <span>{favorited ? "Saved in Cookbook" : "Add to Favorites"}</span>
    </motion.button>
  );
}