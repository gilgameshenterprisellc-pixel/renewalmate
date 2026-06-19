'use client'
import { useState } from 'react'
import Link from 'next/link'

const FEATURES = [
  { icon: '🔔', title: 'Renewal Alerts', desc: 'Get notified before anything renews. Never get surprised by a charge again.' },
  { icon: '📊', title: 'Full Dashboard', desc: 'See every subscription, bill, and recurring cost in one place. Overdue, due soon, on track.' },
  { icon: '💸', title: 'Spot the Waste', desc: 'Instantly see what you\'re paying for but not using. Cancel what doesn\'t serve you.' },
  { icon: '🗂️', title: 'Every Category', desc: 'Entertainment, utilities, insurance, software, gym — all organized automatically.' },
  { icon: '🔒', title: 'No Bank Sync Required', desc: 'Manual entry by default. Your bank credentials never leave your hands unless you opt in. Privacy first.' },
  { icon: '✅', title: 'Free Forever', desc: 'Manual tracking is free forever — no credit card, no catch. The only paid tier (RenewalMate Plus) covers features that cost us money to run, like bank sync and AI insights.' },
]

const PAIN_POINTS = [
  { stat: '$273', label: 'avg. wasted per month on forgotten subscriptions' },
  { stat: '84%', label: 'of people underestimate what they spend on subscriptions' },
  { stat: '2 min', label: 'to set up your full expense dashboard' },
]

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
    <div className="min-h-screen bg-[#f8faf9]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-[#1a2e22] tracking-tight">RenewalMate</span>
          </div>
          <div className="hidden sm:flex items-center gap-7 text-sm text-gray-500">
            <a href="#features" className="hover:text-[#1e7a4a] transition-colors">Features</a>
            <a href="#how" className="hover:text-[#1e7a4a] transition-colors">How It Works</a>
            <a href="#mission" className="hover:text-[#1e7a4a] transition-colors">Mission</a>
          </div>
          <Link href="/signup" className="px-5 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#1e7a4a]/6 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#1e7a4a]/10 text-[#1e7a4a] text-xs font-bold px-4 py-1.5 rounded-full mb-6 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e7a4a] animate-pulse" />
            Free to track. Always.
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#1a2e22] mb-5 fade-up-2 leading-[1.05]">
            Stop bleeding money<br />
            <span className="text-[#1e7a4a]">on bills you forgot.</span>
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 fade-up-3">
            The average person wastes <strong className="text-[#1a2e22]">$273/month</strong> on subscriptions and recurring expenses they don't track.
            RenewalMate shows you exactly where your money is going — in one free dashboard.
          </p>

          <div className="fade-up-3 mb-12">
            <Link href="/signup" className="inline-block px-8 py-3.5 bg-[#1e7a4a] text-white text-sm font-black rounded-full hover:bg-[#166038] transition-colors shadow-lg shadow-[#1e7a4a]/20">
              Get Started Free →
            </Link>
            <p className="text-gray-400 text-xs mt-3">No bank sync required. No credit card. Free to track, forever.</p>
          </div>

          {/* STATS */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 fade-up-3">
            {PAIN_POINTS.map(p => (
              <div key={p.stat} className="text-center">
                <p className="text-3xl font-black text-[#1e7a4a]">{p.stat}</p>
                <p className="text-xs text-gray-400 max-w-[140px] mx-auto leading-relaxed mt-1">{p.label}</p>
              </div>
            ))}
          </div>

          {/* DASHBOARD MOCKUP */}
          <div className="float max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-5 text-left mb-12">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-sm text-[#1a2e22]">My Expense Dashboard</p>
              <span className="text-[10px] font-bold text-[#1e7a4a] bg-[#1e7a4a]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e7a4a] animate-pulse" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { n: '2', label: 'Overdue', color: 'text-red-500' },
                { n: '5', label: 'Due Soon', color: 'text-amber-500' },
                { n: '12', label: 'On Track', color: 'text-[#1e7a4a]' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.n}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
            {[
              { name: 'Netflix', cat: 'Entertainment', amt: '$22.99', status: 'Overdue', sc: 'bg-red-100 text-red-600' },
              { name: 'Electric Bill', cat: 'Utilities', amt: '$94.00', status: 'Due in 3d', sc: 'bg-amber-100 text-amber-600' },
              { name: 'Spotify Family', cat: 'Entertainment', amt: '$16.99', status: 'Tracked', sc: 'bg-green-100 text-green-600' },
              { name: 'Car Insurance', cat: 'Insurance', amt: '$147.00', status: 'Due in 12d', sc: 'bg-amber-100 text-amber-600' },
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-bold text-[#1a2e22]">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.cat}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-[#1a2e22]">{item.amt}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.sc}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNUP CTA */}
      <section id="signup" className="py-16 px-6 bg-[#1e7a4a]">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-green-200 text-xs font-bold tracking-[0.3em] uppercase mb-3">It's Live</p>
          <h2 className="text-3xl font-black text-white mb-3">Be first in the door.</h2>
          <p className="text-green-100 text-sm leading-relaxed mb-8">
            RenewalMate is live, and manual tracking is free forever. Create your account and
            start tracking your bills and subscriptions in under 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 bg-[#1a2e22] text-white text-sm font-black rounded-full hover:bg-black transition-colors"
          >
            Create Free Account →
          </Link>
          <p className="text-green-200/60 text-xs mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-white underline hover:no-underline">
              Log in
            </Link>
          </p>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-green-100 text-xs mb-4">Want product updates instead? Drop your email.</p>
            {submitted ? (
              <p className="text-white text-sm font-bold">🎉 You're on the list.</p>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 rounded-full bg-white text-[#1a2e22] placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-white/20 text-white text-sm font-black rounded-full hover:bg-white/30 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Joining...' : 'Notify Me'}
                </button>
              </form>
            )}
            {submitError && (
              <p className="text-red-200 text-sm mt-3">{submitError}</p>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">What You Get</p>
            <h2 className="text-4xl font-black text-[#1a2e22] tracking-tight">Everything you need.<br />Nothing you don't.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#1e7a4a]/20 hover:shadow-sm transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-black text-[#1a2e22] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">Simple by Design</p>
            <h2 className="text-4xl font-black text-[#1a2e22] tracking-tight">Up in 2 minutes.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Add your bills', desc: 'Type in your subscriptions, utilities, insurance — anything recurring. Takes 2 minutes.' },
              { step: '02', title: 'See the full picture', desc: 'Your dashboard shows what\'s overdue, what\'s coming up, and what you\'re actually spending.' },
              { step: '03', title: 'Stop the bleed', desc: 'Spot subscriptions you forgot about. Cancel what you don\'t use. Keep more of your money.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#1e7a4a]/10 text-[#1e7a4a] font-black text-lg flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-black text-[#1a2e22] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">Why We Built This</p>
          <h2 className="text-4xl font-black text-[#1a2e22] tracking-tight mb-6">No paywall. No catch.</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            RocketMoney charges $12/month to tell you what you're already spending.
            Monarch Money is $14.99/month. We think that's backwards.
            A tool that helps you save money should not cost you money.
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            RenewalMate is part of <a href="https://www.gilgameshenterprise.com" className="text-[#1e7a4a] font-semibold hover:underline">Gilgamesh Enterprise</a> — a company built on one principle:
            if it doesn't cost us anything to run, it's free for you. Period.
          </p>
          <div className="bg-[#f0faf5] border border-[#1e7a4a]/20 rounded-2xl p-6">
            <p className="text-[#1a2e22] font-bold">&ldquo;Power to the people. Tear down gatekeeping walls. Build the door.&rdquo;</p>
            <p className="text-gray-400 text-sm mt-2">— Joshua Bostic, Founder</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-xs">R</span>
            </div>
            <span className="text-xs text-gray-400 font-semibold">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          </div>
          <div className="flex gap-5 text-xs text-gray-400">
            <a href="https://www.gilgameshenterprise.com" className="hover:text-[#1e7a4a] transition-colors">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-[#1e7a4a] transition-colors">SocialMate</a>
            <a href="mailto:gilgameshenterprisellc@gmail.com" className="hover:text-[#1e7a4a] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
