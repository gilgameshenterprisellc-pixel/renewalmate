'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import EmberField from '@/components/EmberField'
import { fontVariables, displayFont as display } from '@/lib/fonts'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
  }

  return (
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased flex items-center justify-center px-6 py-16`}>
      <EmberField />
      <div className="relative z-[2] w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
            <span className={`${display} font-semibold text-void text-sm`}>R</span>
          </div>
          <span className={`${display} font-semibold text-ink-high text-lg`}>RenewalMate</span>
        </Link>

        <div className="bg-panel border border-edge rounded-2xl p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
          {done ? (
            <div className="text-center">
              <div className="text-3xl mb-3">📬</div>
              <h1 className={`${display} font-semibold text-lg text-ink-high mb-2`}>Check your email</h1>
              <p className="text-sm text-ink-muted">
                We sent a confirmation link to <span className="font-bold text-ink-high">{email}</span>. Click it to finish setting up your account.
              </p>
            </div>
          ) : (
            <>
              <h1 className={`${display} font-semibold text-2xl text-ink-high mb-1`}>Create your account</h1>
              <p className="text-sm text-ink-muted mb-6">Free to track, forever. No credit card.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-void border border-edge-lit text-ink-high placeholder-ink-faint text-sm focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-void border border-edge-lit text-ink-high placeholder-ink-faint text-sm focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
                    placeholder="At least 6 characters"
                  />
                </div>

                {error && <p className="text-xs text-rm-red-bright font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold rounded-full shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(139,92,246,0.7)] transition-shadow disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-xs text-ink-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-bright font-bold hover:text-violet">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
