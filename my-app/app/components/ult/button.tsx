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
      <div className="h-10 w-40 glass-card rounded-xl animate-pulse hover-lift border border-purple-200/20" />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleToggleFavorite}
      className={`px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border glass-card hover-lift ${
        favorited ? "glow-ring border border-fuchsia-300/30" : "border-purple-100/30"
      } ${favorited ? "bg-white/04" : "bg-white/02"}`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          favorited
            ? "fill-pink-400/90 text-pink-400 scale-110 animate-heartbeat"
            : "text-purple-400 group-hover:text-purple-300"
        }`}
      />
      <span className="text-white/90">
        {favorited ? "Saved in Cookbook" : "Add to Favorites"}
      </span>
    </motion.button>
  );
}
