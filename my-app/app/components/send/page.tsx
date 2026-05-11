"use client"
import { useEffect, useState } from 'react'
import { SendRecipe } from '../../interfaces/utilities/fetching'
import { FullRecipe } from '../../interfaces/obj'
import { useRouter } from "next/navigation";
import { supabase } from "../../interfaces/utilities/fetching"
import Card from '../ult/card'

export default function Send() {
    const router = useRouter();
    const [promt, setPromt] = useState("");
    const [recipe, setRecipe] = useState<FullRecipe>();
    const [load, setLoad] = useState(false);
    useEffect(()=>{
        const check = (async ()=>{
            const{data:{user}} = await supabase.auth.getUser();
            if (!user) {
                router.push("/components/login"); // Redirect if not logged in
                return;
            }
        });
        check();
    },[router])
    return (
        <>
            {load ? (
                <h1>Wait for the recipe to generate!</h1>
            ) : (
                <div className="p-6">
                    {/* 🔥 GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LEFT COLUMN (FORM) */}
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">Send Recipe</h1>
                            
                            <textarea
                                value={promt}
                                onChange={(e) => setPromt(e.target.value)}
                                className="w-full border p-2 rounded h-40"
                            />
                            <button
                                onClick={async () => {
                                    setLoad(true);
                                    const res = await SendRecipe(promt);
                                    setRecipe(res);
                                    console.log(res);
                                    setLoad(false);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                        {/* RIGHT COLUMN (RESULT) */}
                        <div className="border rounded p-4">
                            {recipe ? (
                                <Card data={recipe} />
                            ) : (
                                <p className=''>No recipe yet...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}