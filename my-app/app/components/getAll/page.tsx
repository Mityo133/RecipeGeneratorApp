'use client'
import { useState, useEffect } from "react";
import { FullRecipe } from "../../interfaces/obj";
import { useRouter } from "next/navigation";
import { GetAllRecipes, supabase } from "../../interfaces/utilities/fetching"
import Link from "next/link";

// Ensure these types/interfaces exist in your project for this to compile
// interface FullRecipe { recipe: { id: number; name: string; description: string; tags: string[]; ingredients: string[] } }

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
        
        // Run user check first
        checkUser();
        // Run fetch immediately after
        fetchRecipes();
    }, [router]);

    const fetchRecipes = async () => {
        try {
            setIsLoading(true);
            const res = await GetAllRecipes();
            setArr(res);
            // Update search results on initial load
            setSearchedRes(res);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        if (!search) {
            // Reset to all recipes if search is empty
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

    if (isLoading) {
        return (
            <div className="p-6 max-w-7xl mx-auto min-h-[50vh]">
                <div className="mb-8 h-8 bg-gray-800 rounded animate-pulse w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-800/30 h-64 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen">
            {/* Header & Search Section */}
            <div className="mb-10 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Discover Recipes
                    </span>
                </h1>
                <p className="text-gray-400 max-w-lg mb-8 text-lg">
                    Explore our collection of culinary masterpieces crafted with precision.
                </p>
                
                {/* Enhanced Search UI */}
                <div className="w-full max-w-2xl relative group">
                    {/* Outer Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    
                    {/* Inner Search Input */}
                    <div className="relative flex items-center bg-gray-800 rounded-xl overflow-hidden border border-gray-700 
                        focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/50 
                        transition-all duration-300 ease-in-out">
                        <svg 
                            className="w-6 h-6 text-gray-400 ml-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search by name or ingredient..."
                            className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-0"
                        />
                        <button
                            onClick={handleSearch}
                            className="mr-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg hover:shadow-cyan-500/50"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {searchedRes.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700 border-dashed">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <p className="text-xl text-gray-300 font-medium">No recipes found</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchedRes.map((fullRecipe, index) => {
                        const recipe = fullRecipe.recipe;
                        return (
                            <Link 
                                key={recipe.id} 
                                href={`/components/getOne/${recipe.id}`} 
                                className="block group"
                            >
                                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 
                                    hover:border-cyan-500/50 
                                    hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] 
                                    transition-all duration-300 ease-out 
                                    transform hover:-translate-y-2 
                                    h-full flex flex-col">
                                    
                                    {/* Tag Container */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {recipe.tags.slice(0, 3).map((tag, tIndex: number) => (
                                            <span key={tIndex} className="text-xs font-semibold px-3 py-1 rounded-full 
                                                bg-gray-700 text-gray-300 border border-gray-600 
                                                group-hover:bg-cyan-900/30 group-hover:text-cyan-300 transition-colors duration-300">
                                                {typeof tag === 'string' ? tag : tag.names}
                                            </span>
                                        ))}
                                        {recipe.tags.length > 3 && (
                                            <span className="text-xs text-gray-500 px-2 py-1">+{recipe.tags.length - 3} more</span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-gray-100 mb-3 font-['Playfair+Display']">
                                        {recipe.name}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                                        {recipe.description}
                                    </p>

                                    {/* Footer: Time & Ingredients */}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-700/50">
                                        {/* Prep Time Badge */}
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                            <span className="text-xs text-gray-300 font-medium">
                                                {recipe.prepTime} min
                                            </span>
                                        </div>

                                        {/* Ingredients Count */}
                                        <div className="flex items-center gap-1 text-gray-300">
                                            <svg
                                                className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            <span className="text-xs font-medium">
                                                {fullRecipe.ingridients?.length || 0} {fullRecipe.ingridients?.length === 1 ? "ingredient" : "ingredients"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}