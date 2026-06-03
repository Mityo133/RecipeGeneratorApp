'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, AlertCircle, CheckCircle2, Lock } from 'lucide-react'
import { ResetPassword } from '@/app/interfaces/utilities/fetching'


function getHashTokens() {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  const params = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash)
  return {
    accessToken: params.get('access_token') || '',
    refreshToken: params.get('refresh_token') || '',
  }
}

function strengthScore(password: string) {
  const checks = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password) && /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  return checks.filter(Boolean).length
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [{ accessToken, refreshToken }] = useState(() => getHashTokens())


  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const hasTokens = useMemo(() => !!accessToken && !!refreshToken, [accessToken, refreshToken])
  const score = useMemo(() => strengthScore(newPassword), [newPassword])

  // Note: access_token/refresh_token should already be present in the URL hash on Supabase redirect.





  const handleSubmit = async () => {
    setMessage(null)

    if (!hasTokens) {
      setMessage({ type: 'error', text: 'Invalid or expired reset link. Request a new one.' })
      return
    }

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in both password fields.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    setLoading(true)
    try {
      const res = await ResetPassword(accessToken, refreshToken, newPassword)
      if ((res as any)?.error) {
        setMessage({ type: 'error', text: (res as any).error || 'Something went wrong.' })
        return
      }
      setMessage({ type: 'success', text: 'Password updated! Redirecting…' })
      setTimeout(() => router.push('/components/login'), 2000)
    } catch (e) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const bars = ['#f87171', '#fb923c', '#facc15', '#4ade80']
  const barFilled = (i: number) => i < score
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="glass-panel w-full max-w-md rounded-2xl p-6 md:p-10 relative overflow-hidden z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <Lock className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Reset Password</h1>
            <p className="text-slate-500 text-sm">Choose a strong new password for your account.</p>
          </div>
        </div>

        {message && (
          <div
            className={
              'mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-xs ' +
              (message.type === 'success'
                ? 'bg-emerald-500/[0.08] border border-emerald-500/[0.18] text-emerald-400'
                : 'bg-rose-500/[0.08] border border-rose-500/[0.18] text-rose-400')
            }
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
              New Password
            </label>
            <input
              className="glass-input w-full rounded-xl px-4 py-3 text-white text-sm"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
            />

            <div className="flex gap-1 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-[3px] flex-1 rounded bg-zinc-800"
                  style={{ background: barFilled(i) ? bars[score - 1] : undefined }}
                />
              ))}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{newPassword ? labels[score] : ''}</div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
              Confirm Password
            </label>
            <input
              className="glass-input w-full rounded-xl px-4 py-3 text-white text-sm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || !hasTokens}
            type="button"
            className="w-full py-3.5 rounded-xl bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold text-sm tracking-tight shadow-xl hover:bg-zinc-100 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating…</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>

          {!hasTokens && (
            <p className="text-xs text-rose-400/90">
              Invalid or expired reset link.
            </p>
          )}

          <button
            type="button"
            onClick={() => router.push('/components/login')}
            className="w-full text-slate-500 hover:text-slate-300 text-xs font-medium hover:underline transition-all cursor-pointer text-center block"
          >
            ← Back to login
          </button>
        </div>
      </motion.div>
    </div>
  )
}

