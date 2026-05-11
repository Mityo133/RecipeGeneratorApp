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
        <>
            {loading ? (
                <h1>Loading....</h1>
            ) : recipe != null ? (
                recipe.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 p-6">
                        {recipe.map((fullRes) => (
                            <div
                                key={fullRes.recipe.id}
                                className="border rounded h-72 w-52 bg-gray-500 p-4"
                            >
                                <div className="w-full h-40 relative overflow-hidden rounded">
                                    <Link href={`/components/getOne/${fullRes.recipe.id}`}>
                                    <Image
                                        src={fullRes.recipe.imageURL}
                                        fill
                                        className="object-cover"
                                        alt={fullRes.recipe.name}
                                    />
                                    </Link>
                                </div>
                                <br></br>
                                <button className='round-boton'><Link href={`/components/getOne/${fullRes.recipe.id}`}>

                                    {fullRes.recipe.name}
                                </Link></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>There is no recipe</>
                )
            ) : (
                <h1>Loading!!</h1>
            )}
        </>
    );
}