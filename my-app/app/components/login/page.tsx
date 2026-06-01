'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginUser, ForgotPassword } from "@/app/interfaces/utilities/fetching";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Password recovery states
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
      {/* Soft ambient background glows */}
      <div className="absolute top-[25%] left-[25%] w-[300px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[25%] w-[250px] h-[250px] bg-indigo-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="w-full max-w-md rounded-3xl bg-zinc-900/30 border border-white/[0.06] backdrop-blur-md p-8 md:p-10 shadow-2xl relative overflow-hidden z-10"
      >
        {/* Spot top border light highlight */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-cyan-400 mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {showForgot ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-zinc-500 text-sm">
            {showForgot 
              ? "Enter your email address to receive a recovery link." 
              : "Sign in to your premium culinary workspace."}
          </p>
        </div>

        {/* Dynamic Alerts */}
        {!showForgot && errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {showForgot && forgotError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{forgotError}</span>
          </motion.div>
        )}

        {showForgot && forgotSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Recovery email sent! Please check your inbox for instructions.</span>
          </motion.div>
        )}

        {!showForgot ? (
          <div className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
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
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-all cursor-pointer normal-case"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-4 py-3.5 text-white text-sm outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-4 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold tracking-tight shadow-xl hover:bg-zinc-200 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email input field for Forgot Password */}
            <div className="space-y-2">
              <label htmlFor="forgot-email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-black/30 pl-11 pr-4 py-3.5 text-white text-sm outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300"
                  placeholder="chef@aurachef.com"
                />
              </div>
            </div>

            {/* Submit Recovery Action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleForgotPassword}
              disabled={forgotLoading || !forgotEmail.trim()}
              className="w-full py-4 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold tracking-tight shadow-xl hover:bg-zinc-200 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              type="button"
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                  <span>Sending recovery link...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Back to sign in trigger */}
            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setErrorMsg("");
              }}
              className="w-full text-zinc-500 hover:text-white text-xs font-semibold hover:underline transition-all cursor-pointer text-center block pt-2"
            >
              Back to Sign In
            </button>
          </div>
        )}

        <div className="mt-8 text-center pt-4 border-t border-white/[0.04]">

<p className="text-zinc-500 text-xs">
  Don't have a workspace?{" "}
  <Link
    href="/components/register"
    className="bg-gradient-to-r from-cyan-400 to-cyan-300 text-transparent bg-clip-text hover:from-cyan-300 hover:to-cyan-200 transition-all font-semibold ml-0.5"
  >
    Register Account
  </Link>
</p>
        </div>
      </motion.div>
    </div>
  );
}
