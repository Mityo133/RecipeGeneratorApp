"use client"
import { useState } from 'react'
import { Registration } from '@/app/interfaces/utilities/fetching';
import { useRouter } from "next/navigation"
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";

export interface UserRegistration {
  "email": string;
  "password": string;
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const user: UserRegistration = { email, password };
      await Registration(user.email, user.password);
      router.push("/components/login");
    } catch (err) {
      console.error(err);
      setErrorMsg("Registration failed. Please make sure email format is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-500/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-indigo-500/[0.05] blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="glass-panel w-full max-w-md rounded-2xl p-8 md:p-10 relative overflow-hidden z-10"
      >
        {/* Top neon border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-purple-400 mb-2">
            <UserPlus className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Create account</h1>
          <p className="text-slate-500 text-sm">Start your premium culinary journey.</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/[0.18] text-rose-400 text-xs"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 pointer-events-none" />
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm"
                placeholder="chef@aurachef.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 pointer-events-none" />
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-3.5 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold text-sm tracking-tight shadow-xl hover:bg-zinc-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-white/[0.05] text-center">
          <p className="text-slate-600 text-xs">
            Already have an account?{" "}
            <Link
              href="/components/login"
              className="text-slate-400 hover:text-white font-semibold transition-colors ml-0.5 underline underline-offset-2 decoration-white/20 hover:decoration-white/60"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
