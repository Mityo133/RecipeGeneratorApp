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
      <div className="h-10 w-36 bg-purple-100/60 rounded-xl animate-pulse border border-purple-200/30" />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleToggleFavorite}
      className={`px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
        favorited
          ? "bg-pink-100/70 border-pink-300/40 text-pink-700 shadow-[0_0_20px_-5px_rgba(236,72,153,0.2)] hover:bg-pink-200/80 hover:shadow-[0_0_25px_-5px_rgba(236,72,153,0.3)]"
          : "bg-white/70 border-purple-200/30 text-purple-600 hover:border-purple-400 hover:bg-purple-50/80 hover:text-purple-700 hover:shadow-[0_4px_15px_-3px_rgba(168,85,247,0.15)]"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          favorited ? "fill-pink-500 text-pink-500 scale-110 animate-heartbeat" : "text-purple-500 group-hover:text-purple-600"
        }`}
      />
      <span>{favorited ? "Saved in Cookbook" : "Add to Favorites"}</span>
    </motion.button>
  );
}
