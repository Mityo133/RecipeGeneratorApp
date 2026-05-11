'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/interfaces/utilities/fetching";
import { User } from "@supabase/supabase-js";
export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <nav className="p-4 border-b">Loading...</nav>;

  return (
    <nav className="p-4 mb-4 flex gap-4 border-b items-center bg-gray-900/55">
      <Link
        href="/"
        className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2"
      >
        Home
      </Link>
      <Link
        href="/components/getAll"
        className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2"
      >
        GetAllRecipes
      </Link>
      <Link
        href="/components/send"
        className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2"
      >
        SendRecipe
      </Link>
      {user ? (
        <>
          <Link
            href="/components/favfoods"
            className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2">Favorite Foods</Link>
        </>
      ) : (<>
      </>)}
      <div className="ml-auto flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-shadow-amber-50">{user.email}</span>
            <button
              className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2"
              onClick={() => { supabase.auth.signOut() }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/components/register"
              className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2"
            >
              Register
            </Link>
            <Link
              href="/components/login"
              className="bg-cyan-400 hover:bg-purple-700 text-white rounded-lg p-2"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}