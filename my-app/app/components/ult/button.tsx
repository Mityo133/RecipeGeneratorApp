'use client'
//import { User } from "@supabase/supabase-js"
import { supabase } from "@/app/interfaces/utilities/fetching";
import { useState,useEffect } from "react";
import { redirect, RedirectType } from 'next/navigation'
import { AddFavoriteFood,GetTheUsersMeals,RemoveFavoriteFood } from '@/app/interfaces/utilities/fetching'


export default function Button({ mealId }: { mealId: string }) {
    const[favorited,setFavorited] = useState<boolean>(false);
    
    
    useEffect(()=>{
        try{
            const CheckForUsersFood  = async()=>{
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const value:boolean = await GetTheUsersMeals(user.id,mealId)
                    console.log("value",value);
                    setFavorited(value);
                }
            };
            CheckForUsersFood();
        }catch(error){
            console.error("Error checking favorite status:", error);
        }
    },[]);
    if(favorited){
        console.log("favorited",favorited);
        return (
        <button className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded"
            onClick={async () => {
                 const { data: { user } } = await supabase.auth.getUser();
                 if(user){
                    const result = await RemoveFavoriteFood(user.id, mealId);
                    setFavorited(false);
                    console.log("it have been removed the recipe!", result);
                 }
            }}>
            Unfavorit
        </button>
        );
    }
    return (
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={async () => {
                const getUser = async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    //setUser(user);
                    if (user) {
                        await AddFavoriteFood(user.id, mealId);
                        console.log("it have been added the recipe!");
                        setFavorited(true);
                    }
                };
                getUser();
                
            }}>
            Add Favorite Food
        </button>
    );
}