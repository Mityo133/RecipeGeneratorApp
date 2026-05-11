'use client'
import { useRouter } from "next/navigation";
import { supabase } from "../../interfaces/utilities/fetching"

export default function LogOut() {
    const router = useRouter();

    return <>
        <button onClick={async () => {
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if (error) {
                console.error("Sign out failed:", error.message);
            } else {
                console.log("Signed out successfully");
                router.push("/components/login");
            }

        }}>LogOut!</button>
    </>
}