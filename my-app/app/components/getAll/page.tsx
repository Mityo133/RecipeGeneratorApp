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
            }else{
                fetchRecipes();
            }
        });
        checkUser();
    }, [router])

    return (
        <>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">All Recipes</h2>
                <label htmlFor="search">Search</label>{" "}|{" "}
                <input type="text" id="search" value={(search)} onChange={(e) => setSearch(e.target.value)} /><button onClick={() => {
                    const filtered = arr.filter((recipe) => recipe.recipe.name.toLowerCase().includes(search.toLowerCase()));
                    setSearchedRes(filtered);
                }} className="bg-cyan-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded">Search</button>
                {arr.length === 0 ? (
                    <p>No recipes found</p>
                ) : (
                    searchedRes.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {arr.map((fullRecipe, index) => (
                                <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px", borderRadius: "8px" }}>
                                    <Link href={`/components/getOne/${fullRecipe.recipe.id}`}>{fullRecipe.recipe.name}</Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchedRes.map((fullres, index) => (
                                <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px", borderRadius: "8px" }}>
                                    <Link href={`/components/getOne/${fullres.recipe.id}`}>{fullres.recipe.name}</Link>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </>
    );
}