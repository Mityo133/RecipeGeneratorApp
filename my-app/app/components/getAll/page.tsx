'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullRecipe } from "../../interfaces/obj";
import { GetAllRecipes, supabase } from "../../interfaces/utilities/fetching";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, FileText, ChevronRight, ChevronDown, Inbox, Sparkles, Loader2, Users, Flame } from "lucide-react";

export default function GetAll() {
  const [arr, setArr] = useState<FullRecipe[]>([]);
  const [searchedRes, setSearchedRes] = useState<FullRecipe[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/components/login");
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

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 25 } }
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 py-4">
        <div className="text-center space-y-3">
          <div className="h-5 skeleton rounded-full w-36 mx-auto" />
          <div className="h-10 skeleton rounded-xl w-72 mx-auto" />
          <div className="h-4 skeleton rounded w-80 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-4">

      {/* ── Header ── */}
      <section className="flex flex-col items-center justify-center text-center space-y-5">
        <div className="badge">
          <Sparkles className="w-3 h-3" />
          <span>Curated Cookbook</span>
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold text-white leading-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          Discover{" "}
          <span className="gradient-text">Chef Blueprints</span>
        </h1>
        <p className="text-[15px] max-w-md leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Explore gourmet recipes engineered with detailed macronutrients and step-by-step culinary blueprints.
        </p>

        {/* Search */}
        <div className="w-full max-w-lg pt-2">
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Search className="w-4 h-4 ml-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, tag, ingredient..."
              className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              id="search-recipes-btn"
              className="gradient-btn mr-2 px-5 py-2 rounded-lg text-white font-semibold text-xs cursor-pointer flex-shrink-0"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── Grid / Empty State ── */}
      <AnimatePresence mode="wait">
        {searchedRes.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 rounded-2xl border border-dashed max-w-md mx-auto flex flex-col items-center gap-4"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}
          >
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Inbox className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
            </div>
            <h3 className="text-base font-semibold text-white">No Blueprints Found</h3>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              No matching records. Try a different ingredient or tag.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {searchedRes.map((fullRecipe) => {
              const recipe = fullRecipe.recipe;
              const isExpanded = expandedId === recipe.id;

              return (
                <motion.div
                  key={recipe.id}
                  variants={itemVariants}
                  layout
                  className="rounded-2xl flex flex-col overflow-hidden relative group"
                  style={{
                    background: "rgba(10,11,16,0.85)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isExpanded ? "0 8px 40px rgba(168,85,247,0.12)" : "none",
                    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                    borderColor: isExpanded ? "rgba(168,85,247,0.20)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Top gradient glow line on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.45) 50%, transparent)" }}
                  />

                  {/* ── Card Body ── */}
                  <div className="p-5 flex flex-col gap-4 flex-grow">

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.tags.slice(0, 3).map((tag, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(168,85,247,0.08)",
                            border: "1px solid rgba(168,85,247,0.16)",
                            color: "rgba(168,85,247,0.75)",
                          }}
                        >
                          {typeof tag === 'string' ? tag : tag.names}
                        </span>
                      ))}
                      {recipe.tags.length > 3 && (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}
                        >
                          +{recipe.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className="text-base font-semibold text-white leading-snug group-hover:text-purple-300 transition-colors duration-200"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {recipe.name}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-[13px] leading-relaxed line-clamp-2 flex-grow"
                      style={{ color: "#71717a" }}
                    >
                      {recipe.description}
                    </p>

                    {/* Quick Stats Row */}
                    <div className="flex items-center gap-4 text-[12px] font-medium" style={{ color: "#52525b" }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>{recipe.prepTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-pink-500" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      {recipe.calories && (
                        <div className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          <span>{recipe.calories}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Expandable Details Panel ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mx-4 mb-4 rounded-xl p-4 space-y-4"
                          style={{
                            background: "rgba(0,0,0,0.35)",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {/* Nutrition row */}
                          {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: "Calories", value: recipe.calories, color: "text-orange-400" },
                                { label: "Protein", value: recipe.protein, color: "text-emerald-400" },
                                { label: "Carbs",   value: recipe.carbs,   color: "text-amber-400" },
                                { label: "Fat",     value: recipe.fat,     color: "text-blue-400" },
                              ].filter(m => m.value).map((m, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                                >
                                  <span className="text-[11px] text-zinc-500 font-medium">{m.label}</span>
                                  <span className={`text-[11px] font-bold ${m.color}`}>{m.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Ingredients */}
                          {fullRecipe.ingridients && fullRecipe.ingridients.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>
                                Ingredients ({fullRecipe.ingridients.length})
                              </span>
                              <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                {fullRecipe.ingridients.map((ing, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-[12px]">
                                    <div
                                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                      style={{ background: "rgba(168,85,247,0.6)" }}
                                    />
                                    <span className="font-semibold text-purple-300">{ing.quantity}</span>
                                    <span style={{ color: "#a1a1aa" }}>{ing.item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* View full details link */}
                          <Link
                            href={`/components/getOne/${recipe.id}`}
                            className="w-full py-2.5 rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 hover:gap-2.5"
                            style={{
                              background: "rgba(168,85,247,0.10)",
                              border: "1px solid rgba(168,85,247,0.18)",
                              color: "rgba(168,85,247,0.9)",
                            }}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Full Recipe</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Details Toggle Button ── */}
                  <button
                    id={`details-btn-${recipe.id}`}
                    onClick={() => toggleExpand(recipe.id)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-200 cursor-pointer border-t"
                    style={{
                      color: isExpanded ? "rgba(168,85,247,0.85)" : "#52525b",
                      borderColor: "rgba(255,255,255,0.05)",
                      background: isExpanded ? "rgba(168,85,247,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) (e.currentTarget as HTMLElement).style.color = "#52525b";
                    }}
                  >
                    <span>{isExpanded ? "Hide Details" : "Details"}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
