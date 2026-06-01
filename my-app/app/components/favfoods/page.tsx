'use client'
import { useState, useEffect } from 'react'
import { supabase } from "@/app/interfaces/utilities/fetching"
import { Favorite_Food, FullRecipe } from "@/app/interfaces/obj"
import { ExtracRecipeByFavoriteId, GetRecipeById } from '@/app/interfaces/utilities/fetching';
import Image from 'next/image'
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Compass, Clock, ArrowRight, Sparkles, Inbox } from "lucide-react";

export default function FavoriteFood() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<FullRecipe[] | null>(null);

  useEffect(() => {
    const getFoods = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const info: Favorite_Food = await ExtracRecipeByFavoriteId(user.id);
          const arr: FullRecipe[] = [];
          if (info.recipe_id && info.recipe_id.length > 0) {
            for (let i = 0; i < info.recipe_id.length; i++) {
              const res = await GetRecipeById(info.recipe_id[i]);
              if (res) arr.push(res);
            }
            setRecipes(arr);
          } else {
            setRecipes([]);
          }
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    getFoods();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 240, damping: 25 } }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-center space-y-10">
        <div className="text-center space-y-3">
          <div className="h-6 bg-zinc-900/60 border border-white/[0.04] rounded-full animate-pulse w-32 mx-auto" />
          <div className="h-10 bg-zinc-900/40 rounded-xl animate-pulse w-72 mx-auto" />
          <div className="h-4 bg-zinc-900/20 rounded w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900/[0.15] border border-white/[0.04] h-64 rounded-2xl animate-pulse p-4 space-y-4">
              <div className="w-full h-36 bg-zinc-800 rounded-xl" />
              <div className="h-5 w-3/4 bg-zinc-800 rounded-md" />
              <div className="h-8 w-full bg-zinc-800/40 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen relative space-y-12">
      {/* Header section */}
      <section className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/[0.02] border border-rose-500/10 text-xs font-semibold text-rose-400 uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose-400/20" />
          <span>Personal Cookbook</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Favorite{" "}
          <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Recipes
          </span>
        </h1>
        <p className="text-zinc-400 max-w-lg text-sm sm:text-base leading-relaxed">
          A customized treasury of your generated culinary maps and handpicked blueprints.
        </p>
      </section>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        {recipes && recipes.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
          >
            {recipes.map((fullRes) => (
              <motion.div
                key={fullRes.recipe.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-zinc-900/[0.15] border border-white/[0.04] overflow-hidden backdrop-blur-md hover:border-zinc-800 transition-all duration-300 flex flex-col h-full group relative"
              >
                {/* Widescreen image with smooth scale on hover */}
                <div className="relative h-40 w-full overflow-hidden border-b border-white/[0.04]">
                  <Link href={`/components/getOne/${fullRes.recipe.id}`}>
                    <Image
                      src={fullRes.recipe.imageURL}
                      fill
                      alt={fullRes.recipe.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </Link>
                  {/* Glassmorphic Time overlay pill */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-zinc-950/75 border border-white/[0.06] flex items-center gap-1 text-[9px] font-bold text-zinc-300">
                    <Clock className="w-3 h-3 text-rose-400" />
                    <span>{fullRes.recipe.prepTime}m</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-rose-400 transition-colors duration-300">
                      {fullRes.recipe.name}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-normal">
                      {fullRes.recipe.description}
                    </p>
                  </div>

                  {/* Primary Link CTA */}
                  <Link 
                    href={`/components/getOne/${fullRes.recipe.id}`}
                    className="w-full py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group/btn"
                  >
                    <span>View Cook Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 rounded-2xl bg-zinc-900/[0.08] border border-white/[0.04] border-dashed max-w-md mx-auto flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-500">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Empty Cookbook</h3>
            <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
              You haven&apos;t favorited any recipes yet. Generate a recipe or browse pre-compiled blueprints to start.
            </p>
            <Link
              href="/components/getAll"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg bg-zinc-900 border border-white/[0.06] hover:bg-zinc-800 text-white transition-all active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Blueprints</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}