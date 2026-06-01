'use client'
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/interfaces/utilities/fetching";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, PlusCircle, Heart, LogIn, LogOut, UserCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Sparkles },
    { href: "/components/getAll", label: "Browse", icon: Compass },
    { href: "/components/send", label: "Generate", icon: PlusCircle },
    ...(user ? [{ href: "/components/favfoods", label: "Favorites", icon: Heart }] : []),
  ];

  if (loading) {
    return (
      <div className="w-full h-16 flex items-center justify-between px-2">
        <div className="h-6 w-32 bg-zinc-800 animate-pulse rounded-md" />
        <div className="flex gap-4">
          <div className="h-8 w-20 bg-zinc-800/40 animate-pulse rounded-md" />
          <div className="h-8 w-20 bg-zinc-800/40 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full h-16 flex items-center justify-between px-2">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            AuraChef
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 rounded-lg flex items-center gap-1.5"
                style={{
                  color: isActive || hoveredTab === link.href ? "#ffffff" : "#a1a1aa",
                }}
                onMouseEnter={() => setHoveredTab(link.href)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                <span>{link.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="navHighlight"
                    className="absolute inset-0 bg-white/[0.04] border border-white/[0.08] rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!isActive && hoveredTab === link.href && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-white/[0.02] rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1 text-[11px] font-medium text-zinc-300">
                <UserCheck className="w-3 h-3 text-cyan-400" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-500" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/components/register"
                className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
              >
                Register
              </Link>

              <Link
                href="/components/login"
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/5 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="md:hidden absolute top-16 left-0 right-0 w-full bg-[#030303]/95 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden z-40 px-4 py-6 space-y-6"
          >
            {/* Links Stack */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (

<Link
  key={link.href}
  href={link.href}
  onClick={() => setIsOpen(false)}
  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
      ? "bg-white/[0.04] border border-white/[0.06] text-white"
      : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
    }`}
>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth actions */}
            <div className="pt-4 border-t border-white/[0.05]">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-semibold text-zinc-300">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-semibold hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-zinc-500" />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/components/register"
                    onClick={() => setIsOpen(false)}
                    className="py-3 rounded-xl border border-white/[0.06] bg-zinc-950 hover:bg-zinc-900 text-zinc-300 font-semibold text-xs text-center flex items-center justify-center transition-all"
                  >
                    Register
                  </Link>
                  <Link
                    href="/components/login"
                    onClick={() => setIsOpen(false)}
                    className="py-3 rounded-xl bg-white text-black font-semibold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
