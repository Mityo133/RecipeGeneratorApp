'use client'
import { useState, useEffect } from 'react'
import { supabase } from "@/app/interfaces/utilities/fetching"
import { Favorite_Food, FullRecipe } from "@/app/interfaces/obj"
import { ExtracRecipeByFavoriteId, GetRecipeById } from '@/app/interfaces/utilities/fetching';
import Image from 'next/image'
import Link from "next/link";
export default function FavoriteFood() {
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState<FullRecipe[] | null>();
    useEffect(() => {
        const getFoods = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const info: Favorite_Food = await ExtracRecipeByFavoriteId(user.id);
                    const arr: FullRecipe[] = [];
                    if (info.recipe_id) {
                        if (info.recipe_id.length > 0) {
                            for (let i: number = 0; i < info?.recipe_id.length; i++) {
                                const res: FullRecipe = await GetRecipeById(info?.recipe_id[i]);
                                arr.push(res);
                            }
                            setRecipe(arr);
                            setLoading(false);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
                setRecipe([]);
                setLoading(false);
            }
        }

        getFoods();
    }, []);
    return (
        <>{loading ? (
    <h1 className="text-center text-lg font-medium text-gray-500 my-4">
        Loading....
    </h1>
) : recipe != null ? (
    recipe.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {recipe.map((fullRes) => (
                <div
                    key={fullRes.recipe.id}
                    className="rounded-lg bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                    <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
                        <Link 
                            href={`/components/getOne/${fullRes.recipe.id}`}
                            className="block"
                        >
                            <Image
                                src={fullRes.recipe.imageURL}
                                fill
                                alt={fullRes.recipe.name}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>
                        
                    </div>
                    <div className="p-4">
                        <button className='w-full block text-center rounded-md bg-blue-600 text-white font-medium py-2 hover:bg-blue-700 transition-colors duration-200'>
                            <Link 
                                href={`/components/getOne/${fullRes.recipe.id}`}
                                className="block"
                            >
                                {fullRes.recipe.name}
                            </Link>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-400">
                There is no recipe
            </h2>
        </div>
    )
) : (
    <h1 className="text-center text-lg font-medium text-yellow-500 my-4">
        Loading!!
    </h1>
)}

        </>
    );
}