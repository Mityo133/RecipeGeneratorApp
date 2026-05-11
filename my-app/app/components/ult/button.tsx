//import { User } from "@supabase/supabase-js"
import { supabase } from "@/app/interfaces/utilities/fetching";
//import { useState } from "react";
//import { redirect, RedirectType } from 'next/navigation'
import { AddFavoriteFood } from '@/app/interfaces/utilities/fetching'
export default function Button({ mealId }: { mealId: string }) {
    //const [users, setUser] = useState<User | null>(null);
    return <>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={async () => {
                const getUser = async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    //setUser(user);
                    if (user) {
                        await AddFavoriteFood(user.id, mealId);
                        console.log("it have been added the recipe!");
                    }
                };
                getUser();
                //redirect("/", RedirectType.push);
            }}>
            Add Favorite Food
        </button>
    </>
}