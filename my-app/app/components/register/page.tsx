"use client"
import { useState } from 'react'
import { Registration } from '@/app/interfaces/utilities/fetching';
import { useRouter } from "next/navigation"
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Mail, Lock, Loader2, ArrowRight, UserPlus, AlertCircle } from "lucide-react";

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
      {/* Dynamic ambient spotlights */}
      <div className="absolute top-[25%] right-[25%] w-[300px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[25%] left-[25%] w-[250px] h-[250px] bg-indigo-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="w-full max-w-md rounded-3xl bg-zinc-900/30 border border-white/[0.06] backdrop-blur-md p-8 md:p-10 shadow-2xl relative overflow-hidden z-10"
      >
        {/* Glow spotlight line top boundary */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-cyan-400 mb-1">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-zinc-500 text-sm">Create a premium culinary co-pilot account.</p>
        </div>

        {/* Dynamic status/error messaging alerts */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Email input field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-4 py-3.5 text-white text-sm outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300"
                placeholder="chef@aurachef.com"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-4 py-3.5 text-white text-sm outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          {/* Submit action */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-4 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold tracking-tight shadow-xl hover:bg-zinc-200 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                <span>Registering Chef Profile...</span>
              </>
            ) : (
              <>
                <span>Register Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center pt-4 border-t border-white/[0.04]">
          <p className="text-zinc-500 text-xs">
            Already registered?{" "}
            <Link
              href="/components/login"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all font-semibold ml-0.5"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
