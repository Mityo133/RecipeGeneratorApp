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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

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
      <div className="w-full h-16 flex items-center justify-between">
        <div className="h-5 w-32 skeleton rounded-full" />
        <div className="flex gap-2">
          <div className="h-7 w-14 skeleton rounded-full" />
          <div className="h-7 w-14 skeleton rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full h-16 flex items-center justify-between relative z-50">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-50">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-all duration-300 group-hover:scale-[1.06]"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #22d3ee 100%)",
              boxShadow: "0 0 0 1px rgba(168,85,247,0.3), 0 4px 16px rgba(168,85,247,0.25)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/80 group-hover:text-white transition-colors duration-200">
            AuraChef
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-[13px] font-medium rounded-lg flex items-center gap-1.5 transition-colors duration-150 select-none"
                style={{
                  color: isActive ? "#f8fafc" : hoveredTab === link.href ? "#cbd5e1" : "#52525b",
                }}
                onMouseEnter={() => setHoveredTab(link.href)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{link.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                {!isActive && hoveredTab === link.href && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 rounded-lg bg-white/[0.035] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 border border-white/[0.06] bg-white/[0.03] rounded-full px-3 py-1.5 text-[11px] font-medium text-zinc-500">
                <UserCheck className="w-3 h-3 text-purple-400 flex-shrink-0" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-white hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/components/register"
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
              >
                Register
              </Link>
              <Link
                href="/components/login"
                className="gradient-btn px-4 py-1.5 text-xs font-semibold rounded-full text-white flex items-center gap-1.5"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign in</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="md:hidden absolute top-16 left-0 right-0 w-full glass-panel border-t-0 rounded-b-2xl overflow-hidden z-40 px-4 py-5 space-y-5"
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white/[0.06] border border-white/[0.08] text-white"
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-zinc-600"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-white/[0.05]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs font-medium text-zinc-500">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white font-medium text-sm hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/components/register"
                    onClick={() => setIsOpen(false)}
                    className="py-3 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-300 font-semibold text-sm text-center flex items-center justify-center transition-all"
                  >
                    Register
                  </Link>
                  <Link
                    href="/components/login"
                    onClick={() => setIsOpen(false)}
                    className="gradient-btn py-3 rounded-xl text-white font-semibold text-sm text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
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
