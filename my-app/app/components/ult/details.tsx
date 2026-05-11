'use client'
import { useEffect,useState } from "react";

import { GetRecipeById } from "@/app/interfaces/utilities/fetching";
import { FullRecipe } from "@/app/interfaces/obj";
import Card from "./card"

export default function Details({id}:{id:string}){
const[recipe,setData] = useState<FullRecipe>();
const[loading,SetLoading] = useState(true);
useEffect(()=>{
    const fetchRecipe = async () => {
        try {
            const result:FullRecipe = await GetRecipeById(id);
            setData(result);
        } catch(error) {
            console.error(error);
        } finally {
            SetLoading(false);
        }
    };
    fetchRecipe();
},[id]);
return<>
{loading ? (
    <h1>Wait for the recipe to generate!</h1>
):(
    <div>
        {recipe ? (
                <Card data={recipe} />
                ) : (
                    <p className=''>No recipe yet...</p>
                )}
    </div>
)}

</>
}