'use client'
import { useState, useEffect } from "react";
import { FullRecipe } from "../../interfaces/obj";
import { useRouter } from "next/navigation";
import { GetAllRecipes, supabase } from "../../interfaces/utilities/fetching"
import Link from "next/link";
export default function GetAll() {
    const [arr, setArr] = useState<FullRecipe[]>([]);
    const [searchedRes, setSearchedRes] = useState<FullRecipe[]>([]);
    const [search, setSearch] = useState("");
    const router = useRouter();
    useEffect(() => {
        const fetchRecipes = (async () => {
            try {
                const res = await GetAllRecipes();
                setArr(res);
                console.log("All Recipes:", res); // "Print out everything"
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        });
        const checkUser = (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/components/login"); // Redirect if not logged in
                return;
            } else {
                fetchRecipes();
            }
        });
        checkUser();
    }, [router])

    return (
        <>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">All Recipes</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex-1 sm:flex-initial">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Search</label>
                            <input
                                type="text"
                                id="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Find your favorite recipe..."
                                className="w-full sm:w-64 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={() => {
                                const filtered = arr.filter((recipe) => recipe.recipe.name.toLowerCase().includes(search.toLowerCase()));
                                setSearchedRes(filtered);
                            }}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>
                </div>
                {arr.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
                        <p className="text-xl text-gray-400">No recipes found</p>
                    </div>
                ) : (
                    searchedRes.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {arr.map((fullRecipe, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-cyan-400/50 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                                    <Link href={`/components/getOne/${fullRecipe.recipe.id}`}>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{fullRecipe.recipe.name}</h3>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchedRes.map((fullres, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-cyan-400/50 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                                    <Link href={`/components/getOne/${fullres.recipe.id}`}>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{fullres.recipe.name}</h3>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </>
    );
}
