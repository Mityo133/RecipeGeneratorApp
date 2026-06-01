'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullRecipe } from "../../interfaces/obj";
import { GetAllRecipes, supabase } from "../../interfaces/utilities/fetching";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, FileText, ChevronRight, Inbox, Sparkles, Loader2 } from "lucide-react";

export default function GetAll() {
  const [arr, setArr] = useState<FullRecipe[]>([]);
  const [searchedRes, setSearchedRes] = useState<FullRecipe[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/components/login");
      }
    };

    checkUser();
    fetchRecipes();
  }, [router]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const res = await GetAllRecipes();
      setArr(res);
      setSearchedRes(res);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search) {
      setSearchedRes(arr);
    } else {
      const filtered = arr.filter((fullRecipe) => 
        fullRecipe.recipe.name.toLowerCase().includes(search.toLowerCase()) ||
        (fullRecipe.recipe.tags?.some(tag => {
          const tagName = typeof tag === 'string' ? tag : tag.names;
          return tagName?.toLowerCase().includes(search.toLowerCase());
        }))
      );
      setSearchedRes(filtered);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 25 } }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[70vh] flex flex-col justify-center space-y-10">
        <div className="text-center space-y-3">
          <div className="h-6 bg-zinc-900/60 border border-white/[0.04] rounded-full animate-pulse w-32 mx-auto" />
          <div className="h-10 bg-zinc-900/40 rounded-xl animate-pulse w-72 mx-auto" />
          <div className="h-4 bg-zinc-900/20 rounded w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-900/[0.15] border border-white/[0.04] h-60 rounded-2xl animate-pulse flex flex-col p-6 space-y-4">
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-zinc-800 rounded-lg" />
                <div className="h-5 w-16 bg-zinc-800 rounded-lg" />
              </div>
              <div className="h-6 w-3/4 bg-zinc-800 rounded-md" />
              <div className="h-12 w-full bg-zinc-800/40 rounded-lg" />
              <div className="mt-auto h-5 w-full bg-zinc-800/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen relative space-y-12">
      {/* Header & Search Console */}
      <section className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Cookbook Records</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Discover{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Chef Blueprints
          </span>
        </h1>
        <p className="text-zinc-400 max-w-lg text-sm sm:text-base leading-relaxed">
          Explore gourmet recipes engineered with detailed macronutrients and step-by-step culinary blueprints.
        </p>

        {/* Minimal Search Input */}
        <div className="w-full max-w-lg relative pt-4 group">
          <div className="relative flex items-center bg-[#0a0a0f]/60 rounded-xl border border-white/[0.06] focus-within:border-cyan-500/40 focus-within:ring-4 focus-within:ring-cyan-500/5 transition-all duration-300 overflow-hidden">
            <Search className="w-4 h-4 text-zinc-500 ml-4 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by ingredients, tags, names..."
              className="w-full bg-transparent text-white placeholder-zinc-600 px-4 py-3.5 text-xs font-semibold focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="mr-2 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        {searchedRes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="text-center py-20 rounded-2xl bg-zinc-900/[0.08] border border-white/[0.04] border-dashed max-w-md mx-auto flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-500">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">No Blueprints Compiled</h3>
            <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
              We couldn&apos;t find matching records. Try a different ingredient search query.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {searchedRes.map((fullRecipe) => {
              const recipe = fullRecipe.recipe;
              return (
                <motion.div
                  key={recipe.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-zinc-900/[0.15] border border-white/[0.04] backdrop-blur-md hover:border-zinc-800 transition-all duration-300 flex flex-col h-full relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="p-6 flex flex-col h-full space-y-4">
                    {/* Tag Badges */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag, tIndex: number) => (
                        <span 
                          key={tIndex} 
                          className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.06] text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/10 transition-colors duration-300"
                        >
                          {typeof tag === 'string' ? tag : tag.names}
                        </span>
                      ))}
                      {recipe.tags.length > 3 && (
                        <span className="text-[9px] text-zinc-600 font-bold px-2 py-0.5 bg-white/[0.01] rounded-md border border-white/[0.03]">
                          +{recipe.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-white tracking-tight leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                      {recipe.name}
                    </h2>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 flex-grow font-normal">
                      {recipe.description}
                    </p>

                    {/* Footer stats */}
                    <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-zinc-400 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{recipe.prepTime} Mins</span>
                      </div>

                      <Link 
                        href={`/components/getOne/${recipe.id}`} 
                        className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-cyan-400 transition-all duration-200 group/btn"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:text-cyan-400 transition-colors" />
                        <span>{fullRecipe.ingridients?.length || 0} Ingr.</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}