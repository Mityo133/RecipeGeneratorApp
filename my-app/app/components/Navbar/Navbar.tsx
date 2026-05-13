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
    <nav className="p-4 mb-4 flex gap-4 border-b items-center bg-gray-900/55/1 backdrop-blur-lg shadow-md border-b border-gray-800/50 rounded-xl">
      <Link
        href="/"
        className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      >
        Home
      </Link>
      <Link
        href="/components/getAll"
        className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      >
        GetAllRecipes
      </Link>
      <Link
        href="/components/send"
        className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
      >
        SendRecipe
      </Link>
      {user ? (
        <>
          <Link
            href="/components/favfoods"
            className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none">Favorite Foods</Link>
        </>
      ) : (<>
      </>)}
      <div className="ml-auto flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-300 font-medium bg-gray-800/50 px-3 py-1 rounded-lg">{user.email}</span>
            <button
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-red-400 focus:outline-none"
              onClick={() => { supabase.auth.signOut() }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/components/register"
              className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              Register
            </Link>
            <Link
              href="/components/login"
              className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg p-3 shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
