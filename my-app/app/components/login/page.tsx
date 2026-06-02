'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginUser, ForgotPassword } from "@/app/interfaces/utilities/fetching";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await LoginUser(email, password);
      if (res.err) {
        setErrorMsg(res.message || "Invalid authentication credentials.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess(false);

    try {
      const res = await ForgotPassword(forgotEmail);
      if (res.error) {
        setForgotError(res.error || "Failed to trigger recovery email.");
      } else {
        setForgotSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setForgotError("An unexpected connection error occurred.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-cyan-500/[0.05] blur-[80px] pointer-events-none" />

      <motion.div
        key={showForgot ? "forgot" : "login"}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="glass-panel w-full max-w-md rounded-2xl p-8 md:p-10 relative overflow-hidden z-10"
      >
        {/* Top neon border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] text-cyan-400 mb-2">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {showForgot ? "Reset Password" : "Welcome back"}
          </h1>
          <p className="text-slate-500 text-sm">
            {showForgot
              ? "Enter your email to receive a recovery link."
              : "Sign in to your culinary workspace."}
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {!showForgot && errorMsg && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/[0.18] text-rose-400 text-xs"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {showForgot && forgotError && (
            <motion.div
              key="forgot-error"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/[0.18] text-rose-400 text-xs"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{forgotError}</span>
            </motion.div>
          )}

          {showForgot && forgotSuccess && (
            <motion.div
              key="forgot-success"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/[0.18] text-emerald-400 text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>Recovery email sent. Check your inbox for instructions.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        {!showForgot ? (
          <div className="space-y-5">
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
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  type="email"
                  required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm"
                  placeholder="chef@aurachef.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setForgotEmail(email);
                    setForgotError("");
                    setForgotSuccess(false);
                  }}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 pointer-events-none" />
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  type="password"
                  required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-3.5 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold text-sm tracking-tight shadow-xl hover:bg-zinc-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 pointer-events-none" />
                <input
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  type="email"
                  required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm"
                  placeholder="chef@aurachef.com"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleForgotPassword}
              disabled={forgotLoading || !forgotEmail.trim()}
              className="w-full py-3.5 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold text-sm tracking-tight shadow-xl hover:bg-zinc-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              type="button"
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setErrorMsg("");
              }}
              className="w-full text-slate-500 hover:text-slate-300 text-xs font-medium hover:underline transition-all cursor-pointer text-center block"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-white/[0.05] text-center">
          <p className="text-slate-600 text-xs">
            Don&apos;t have a workspace?{" "}
            <Link
              href="/components/register"
              className="text-slate-400 hover:text-white font-semibold transition-colors ml-0.5 underline underline-offset-2 decoration-white/20 hover:decoration-white/60"
            >
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
