'use client'
import { useState } from 'react'
import Link from 'next/link'
import EmberField from '@/components/EmberField'
import { fontVariables, displayFont as display, monoFont as mono } from '@/lib/fonts'

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5 stroke-jade-bright fill-none" strokeWidth={2.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

const FEATURES = [
  {
    title: 'Renewal Alerts',
    desc: 'Get notified before anything renews. Never get surprised by a charge again.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a5 5 0 0 0-5 5v3.5c0 .9-.4 1.7-1 2.3L5 15h14l-1-1.2c-.6-.6-1-1.4-1-2.3V8a5 5 0 0 0-5-5zM9.5 18a2.5 2.5 0 0 0 5 0" />
    ),
  },
  {
    title: 'Full Dashboard',
    desc: 'See every subscription, bill, and recurring cost in one place. Overdue, due soon, on track.',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    title: 'Spot the Waste',
    desc: "Instantly see what you're paying for but not using. Cancel what doesn't serve you.",
    icon: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <line strokeLinecap="round" x1="15.3" y1="15.3" x2="20" y2="20" />
      </>
    ),
  },
  {
    title: 'Every Category',
    desc: 'Entertainment, utilities, insurance, software, gym — all organized automatically.',
    icon: (
      <>
        <path strokeLinejoin="round" d="M3 11.5V5a2 2 0 0 1 2-2h6.5a2 2 0 0 1 1.4.6l8 8a2 2 0 0 1 0 2.8l-6.5 6.5a2 2 0 0 1-2.8 0l-8-8A2 2 0 0 1 3 11.5z" />
        <circle cx="7.5" cy="7.5" r="1.15" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    title: 'No Bank Sync Required',
    desc: 'Manual entry by default. Your bank credentials never leave your hands unless you opt in.',
    icon: <path strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  },
  {
    title: 'Free Forever',
    desc: 'Manual tracking is free forever. The only paid tier covers what actually costs us money to run.',
    icon: <path strokeLinecap="round" d="M7 15a4 4 0 1 1 0-6c1.8 0 3.2 1.3 5 3s3.2 3 5 3a4 4 0 1 0 0-6c-1.8 0-3.2 1.3-5 3s-3.2 3-5 3z" />,
  },
]

const STEPS = [
  { n: '01', title: 'Add your bills', desc: 'Type in your subscriptions, utilities, insurance — anything recurring. Takes 2 minutes.' },
  { n: '02', title: 'See the full picture', desc: "Your dashboard shows what's overdue, what's coming up, and what you're actually spending." },
  { n: '03', title: 'Stop the bleed', desc: "Spot subscriptions you forgot about. Cancel what you don't use. Keep more of your money." },
]

const LEDGER_ROWS = [
  { name: 'Netflix', cat: 'Entertainment', amt: '$22.99', status: 'Overdue', tone: 'overdue' as const },
  { name: 'Electric Bill', cat: 'Utilities', amt: '$94.00', status: 'Due in 3d', tone: 'soon' as const },
  { name: 'Spotify Family', cat: 'Entertainment', amt: '$16.99', status: 'Tracked', tone: 'ok' as const },
  { name: 'Car Insurance', cat: 'Insurance', amt: '$147.00', status: 'Due in 12d', tone: 'soon' as const },
]

const BADGE_TONE = {
  overdue: 'bg-rm-red/15 text-rm-red-bright border border-rm-red/35',
  soon: 'bg-rm-amber/15 text-rm-amber-bright border border-rm-amber/35',
  ok: 'bg-jade/15 text-jade-bright border border-jade/35',
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error('server error')
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong — please try again or email renewalmate.updates@gmail.com.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased`}>
      <EmberField />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-void/85 backdrop-blur-md border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
              <span className={`${display} font-semibold text-void text-[1.05rem]`}>R</span>
            </div>
            <span className={`${display} font-semibold text-[1.15rem] text-ink-high`}>RenewalMate</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-ink-body hover:text-violet-bright transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-ink-body hover:text-violet-bright transition-colors">Pricing</a>
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-ink-body hover:text-violet-bright transition-colors py-2">
                Resources
                <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none transition-transform group-hover:rotate-180" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                <div className="min-w-[190px] bg-panel-raised border border-edge-lit rounded-xl p-2 shadow-2xl shadow-black/60">
                  <Link href="/guides" className="block px-3 py-2 rounded-lg text-[0.83rem] font-semibold text-ink-body hover:bg-panel hover:text-violet-bright">Guides</Link>
                  <Link href="/blog" className="block px-3 py-2 rounded-lg text-[0.83rem] font-semibold text-ink-body hover:bg-panel hover:text-violet-bright">Blog</Link>
                  <Link href="/faq" className="block px-3 py-2 rounded-lg text-[0.83rem] font-semibold text-ink-body hover:bg-panel hover:text-violet-bright">FAQ</Link>
                  <Link href="/grants" className="block px-3 py-2 rounded-lg text-[0.83rem] font-semibold text-ink-body hover:bg-panel hover:text-violet-bright">Grants</Link>
                  <Link href="/cancel" className="block px-3 py-2 rounded-lg text-[0.83rem] font-semibold text-ink-body hover:bg-panel hover:text-violet-bright">Cancellation Directory</Link>
                  <div className="h-px bg-edge my-1.5 mx-1" />
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-faint px-3 pt-1 pb-0.5">Mate Series</div>
                  <a href="https://socialmate.studio/studio-stax" target="_blank" rel="noopener" className="block px-3 py-2 rounded-lg text-[0.83rem] font-semibold text-rm-amber-bright hover:bg-panel">Studio Stax ↗</a>
                </div>
              </div>
            </div>
            <a href="#mission" className="text-sm font-semibold text-ink-body hover:text-violet-bright transition-colors">Mission</a>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold px-[22px] py-[11px] rounded-full shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(139,92,246,0.7)] hover:-translate-y-px transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative border-b border-edge pt-[88px] pb-20 px-6">
        <div className="relative z-[2] max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-panel-raised border border-edge-lit px-4 py-[7px] rounded-full text-[0.78rem] font-semibold text-jade-bright mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-jade shadow-[0_0_8px_var(--color-jade)]" />
            Free to track. Always.
          </span>

          <h1 className={`${display} font-semibold text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1.04] text-ink-high text-balance`}>
            Stop bleeding money<br />
            <span className="italic font-medium bg-gradient-to-r from-rm-amber-bright to-violet-bright bg-clip-text text-transparent">
              on bills you forgot.
            </span>
          </h1>

          <p className="max-w-[620px] mx-auto mt-6 text-[1.08rem] text-ink-body">
            The average person wastes <b className="text-ink-high">$273/month</b>{' '}
            on subscriptions and recurring expenses they don&apos;t track. RenewalMate shows you exactly where your money is going — in one free dashboard.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3.5">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold px-[22px] py-[11px] rounded-full shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(139,92,246,0.7)] hover:-translate-y-px transition-all"
            >
              Get Started Free →
            </Link>
            <span className="text-[0.8rem] text-ink-muted">No bank sync required. No credit card. Free to track, forever.</span>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[620px] mx-auto mt-14">
            {[
              { n: '$273', l: 'avg. wasted per month on forgotten subscriptions' },
              { n: '84%', l: 'of people underestimate what they spend' },
              { n: '2 min', l: 'to set up your full expense dashboard' },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className={`${mono} ${display} font-semibold text-[2rem] bg-gradient-to-r from-rm-amber-bright to-violet-bright bg-clip-text text-transparent`}>{s.n}</div>
                <div className="text-[0.78rem] text-ink-muted mt-1 max-w-[160px] mx-auto">{s.l}</div>
              </div>
            ))}
          </div>

          {/* LEDGER PREVIEW */}
          <div className="max-w-[560px] mx-auto mt-14 bg-panel border border-edge rounded-[20px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] overflow-hidden text-left">
            <div className="flex items-center justify-between px-6 py-5 border-b border-edge">
              <span className="font-bold text-[0.95rem] text-ink-high">My Expense Dashboard</span>
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold text-jade-bright bg-jade/12 border border-jade/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-jade shadow-[0_0_6px_var(--color-jade)]" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-px bg-edge">
              {[
                { n: '2', l: 'Overdue', c: 'text-rm-red-bright' },
                { n: '5', l: 'Due Soon', c: 'text-rm-amber-bright' },
                { n: '12', l: 'On Track', c: 'text-jade-bright' },
              ].map((t) => (
                <div key={t.l} className="bg-panel py-4 px-2 text-center">
                  <div className={`${mono} font-semibold text-[1.4rem] ${t.c}`}>{t.n}</div>
                  <div className="text-[0.68rem] text-ink-muted mt-0.5">{t.l}</div>
                </div>
              ))}
            </div>
            <div className="py-1.5">
              {LEDGER_ROWS.map((row) => (
                <div key={row.name} className="flex items-center justify-between px-6 py-3.5 border-t border-edge first:border-t-0">
                  <div>
                    <div className="font-bold text-[0.92rem] text-ink-high">{row.name}</div>
                    <div className="text-[0.75rem] text-ink-muted mt-px">{row.cat}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`${mono} font-semibold text-[0.95rem] text-ink-high`}>{row.amt}</span>
                    <span className={`text-[0.68rem] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${BADGE_TONE[row.tone]}`}>{row.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST / SIGNUP CTA */}
      <section id="signup" className="py-16 px-6 border-b border-edge">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-jade-bright text-[0.7rem] font-bold tracking-[0.3em] uppercase mb-3">It&apos;s Live</p>
          <h2 className={`${display} font-semibold text-[1.9rem] text-ink-high mb-3`}>Be first in the door.</h2>
          <p className="text-ink-body text-sm leading-relaxed mb-8">
            RenewalMate is live, and manual tracking is free forever. Create your account and start tracking your bills and subscriptions in under 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] hover:shadow-[0_10px_28px_-6px_rgba(139,92,246,0.7)] transition-all"
          >
            Create Free Account →
          </Link>
          <p className="text-ink-muted text-xs mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-ink-high underline hover:no-underline">Log in</Link>
          </p>

          <div className="mt-10 pt-8 border-t border-edge">
            <p className="text-ink-muted text-xs mb-4">Want product updates instead? Drop your email.</p>
            {submitted ? (
              <p className="text-ink-high text-sm font-bold">🎉 You&apos;re on the list.</p>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 rounded-full bg-panel border border-edge-lit text-ink-high placeholder-ink-faint text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet/50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-panel-raised border border-edge-lit text-ink-high text-sm font-bold rounded-full hover:border-violet/50 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Joining...' : 'Notify Me'}
                </button>
              </form>
            )}
            {submitError && <p className="text-rm-red-bright text-sm mt-3">{submitError}</p>}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-2.5">What You Get</p>
            <h2 className={`${display} font-semibold text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink-high`}>Everything you need. Nothing you don&apos;t.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-edge border border-edge rounded-[18px] overflow-hidden">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-panel p-7">
                <svg viewBox="0 0 24 24" className="w-[26px] h-[26px] stroke-violet-bright fill-none" strokeWidth={1.6}>{f.icon}</svg>
                <h3 className="font-bold text-[1.05rem] text-ink-high mt-4 mb-2">{f.title}</h3>
                <p className="text-[0.88rem] text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 border-y border-edge">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-2.5">Simple By Design</p>
            <h2 className={`${display} font-semibold text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink-high`}>Up in 2 minutes.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-9">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className={`${mono} w-[34px] h-[34px] rounded-[10px] border border-edge-lit flex items-center justify-center text-[0.8rem] font-semibold text-rm-amber-bright mb-[18px]`}>{s.n}</div>
                <h3 className="font-bold text-[1.05rem] text-ink-high mb-2">{s.title}</h3>
                <p className="text-[0.88rem] text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-2.5">Pricing</p>
            <h2 className={`${display} font-semibold text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink-high`}>Still cheaper than doing nothing.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[420px] md:max-w-none mx-auto">
            {/* FREE */}
            <div className="relative bg-panel border border-edge rounded-[20px] p-8 flex flex-col">
              <h3 className={`${display} text-[1.3rem] text-ink-high`}>Free</h3>
              <p className="text-[0.85rem] text-ink-muted mt-1.5 min-h-[2.3em]">Track everything by hand, forever.</p>
              <div className={`${mono} font-semibold text-[2.3rem] text-ink-high mt-5`}>$0<span className="font-[family-name:var(--font-body)] text-[0.9rem] text-ink-muted font-medium">/mo</span></div>
              <div className="text-[0.76rem] text-ink-muted mt-1">No credit card required</div>
              <ul className="flex flex-col gap-3 my-6 flex-1">
                {['Unlimited bills & subscriptions', 'Renewal alerts before anything charges', 'Budgets, goals & net worth tracking', 'Cancellation directory', 'CSV import'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.87rem] text-ink-body"><Check />{f}</li>
                ))}
              </ul>
              <Link href="/signup" className="w-full text-center py-3 rounded-xl font-bold text-[0.87rem] border border-edge-lit text-ink-high bg-panel-raised hover:border-violet/50 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* PLUS */}
            <div className="relative bg-panel-raised border border-violet rounded-[20px] p-8 flex flex-col shadow-[0_30px_60px_-24px_rgba(139,92,246,0.4)]">
              <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet to-[#A472F0] text-white text-[0.68rem] font-bold px-3.5 py-[5px] rounded-full whitespace-nowrap">Most Popular</span>
              <h3 className={`${display} text-[1.3rem] text-ink-high`}>Plus</h3>
              <p className="text-[0.85rem] text-ink-muted mt-1.5 min-h-[2.3em]">Let your bank do the typing.</p>
              <div className={`${mono} font-semibold text-[2.3rem] text-ink-high mt-5`}>$8<span className="font-[family-name:var(--font-body)] text-[0.9rem] text-ink-muted font-medium">/mo</span></div>
              <div className="text-[0.76rem] text-ink-muted mt-1">or $80/yr — 2 months free</div>
              <ul className="flex flex-col gap-3 my-6 flex-1">
                {['Everything in Free', 'Automatic bank sync (Plaid) — auto-detects charges', 'AI-powered spend insights', 'Priority push alerts', 'Cancel anytime'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.87rem] text-ink-body"><Check />{f}</li>
                ))}
              </ul>
              <Link href="/settings" className="w-full text-center py-3 rounded-xl font-bold text-[0.87rem] text-white bg-gradient-to-r from-violet to-[#A472F0] shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]">
                Upgrade to Plus
              </Link>
            </div>

            {/* FAMILY — proposed, not built */}
            <div className="relative bg-panel border border-edge rounded-[20px] p-8 flex flex-col opacity-70">
              <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-panel-raised border border-edge-lit text-ink-muted text-[0.68rem] font-bold px-3.5 py-[5px] rounded-full whitespace-nowrap">Proposed — Not Built Yet</span>
              <h3 className={`${display} text-[1.3rem] text-ink-high`}>Family</h3>
              <p className="text-[0.85rem] text-ink-muted mt-1.5 min-h-[2.3em]">One dashboard for the whole household.</p>
              <div className={`${mono} font-semibold text-[2.3rem] text-ink-high mt-5`}>$15<span className="font-[family-name:var(--font-body)] text-[0.9rem] text-ink-muted font-medium">/mo</span></div>
              <div className="text-[0.76rem] text-ink-muted mt-1">or $150/yr — 2 months free</div>
              <ul className="flex flex-col gap-3 my-6 flex-1">
                {['Everything in Plus', 'Shared bills across household members', 'Combined net worth view', 'Shared family goals'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.87rem] text-ink-body">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5 stroke-ink-faint fill-none" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full text-center py-3 rounded-xl font-bold text-[0.87rem] border border-edge-lit text-ink-muted bg-panel-raised cursor-not-allowed">
                Join the Waitlist
              </button>
            </div>
          </div>

          <p className="text-center text-[0.85rem] text-ink-muted mt-10">
            RocketMoney charges $12/mo. Monarch is $14.99/mo. Plus is $8 — and Free still does more than either of their free tiers.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="py-24 px-6 border-y border-edge">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-2.5">Why We Built This</p>
          <h2 className={`${display} font-semibold text-[clamp(1.7rem,3.4vw,2.4rem)] text-ink-high mb-8`}>
            Free where it costs us nothing.<br />Fair where it doesn&apos;t.
          </h2>
          <p className="text-ink-body leading-relaxed">
            RocketMoney charges $12/month to tell you what you&apos;re already spending. Monarch Money is $14.99/month. We think that&apos;s backwards. A tool that helps you save money should not cost you money.
          </p>
          <p className="text-ink-body leading-relaxed mt-4">
            RenewalMate is part of{' '}
            <a href="https://www.gilgameshenterprise.com" className="text-ink-high font-semibold hover:text-violet-bright">Gilgamesh Enterprise</a>{' '}
            — a company built on one principle: if it doesn&apos;t cost us anything to run, it&apos;s free for you. Period.
          </p>
          <blockquote className="max-w-[560px] mx-auto mt-10 text-left border-l-[3px] border-rm-amber bg-panel-raised rounded-r-[14px] rounded-l-[4px] px-7 py-[22px]">
            <p className={`${display} italic text-[1.15rem] text-ink-high leading-relaxed`}>
              &ldquo;Power to the people. Tear down gatekeeping walls. Build the door.&rdquo;
            </p>
            <cite className="block not-italic text-[0.8rem] text-ink-muted mt-3">— Joshua Bostic, Founder</cite>
          </blockquote>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-edge pt-8">
          <div className="flex items-center gap-2.5 text-[0.85rem] text-ink-muted">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
              <span className={`${display} font-semibold text-void text-[0.8rem]`}>R</span>
            </div>
            © 2026 RenewalMate — Gilgamesh Enterprise LLC
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[0.85rem] text-ink-muted">
            <Link href="/guides" className="hover:text-violet-bright transition-colors">Guides</Link>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
            <span className="text-[0.64rem] font-bold uppercase tracking-wider text-ink-faint">Mate Series:</span>
            <a href="https://socialmate.studio" className="hover:text-violet-bright transition-colors">SocialMate</a>
            <a href="https://socialmate.studio/studio-stax" target="_blank" rel="noopener" className="hover:text-violet-bright transition-colors">Studio Stax</a>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
            <a href="mailto:gilgameshenterprisellc@gmail.com" className="hover:text-violet-bright transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
