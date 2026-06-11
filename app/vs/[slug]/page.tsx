'use client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

const VS_DATA: Record<string, {
  name: string
  price: string
  tagline: string
  bankSync: boolean
  free: boolean
  mobileOnly: boolean
  dead: boolean
  rows: { feature: string; them: string; us: string }[]
  verdict: string
}> = {
  'rocket-money': {
    name: 'Rocket Money',
    price: '$6–$12/month',
    tagline: 'Charges you money to tell you where your money is going.',
    bankSync: true, free: false, mobileOnly: false, dead: false,
    rows: [
      { feature: 'Price', them: '$6–$12/month', us: 'Free forever' },
      { feature: 'Free tier', them: 'Limited — tracking only', us: 'Full features, always' },
      { feature: 'Bank account sync', them: 'Required', us: 'Never — manual entry, your data stays yours' },
      { feature: 'Bill negotiation', them: 'Yes (takes a cut)', us: 'Not needed — you see everything yourself' },
      { feature: 'Subscription alerts', them: 'Premium only', us: 'Free' },
      { feature: 'No credit card required', them: 'No', us: 'Yes' },
      { feature: 'Privacy first', them: 'Needs bank credentials', us: 'Manual entry only' },
    ],
    verdict: 'Rocket Money is the most well-known subscription tracker — and the most expensive. You pay $12/month to track the money you\'re already losing. RenewalMate gives you the same core visibility for free, without ever touching your bank login.',
  },
  'monarch-money': {
    name: 'Monarch Money',
    price: '$14.99/month',
    tagline: 'A full personal finance suite with a full personal finance price tag.',
    bankSync: true, free: false, mobileOnly: false, dead: false,
    rows: [
      { feature: 'Price', them: '$14.99/month ($99.99/yr)', us: 'Free forever' },
      { feature: 'Free trial', them: '7 days', us: 'Free — no trial, no clock' },
      { feature: 'Bank sync required', them: 'Yes', us: 'No — manual entry' },
      { feature: 'Subscription detection', them: 'Automatic via bank', us: 'Manual — you control what\'s tracked' },
      { feature: 'Investment tracking', them: 'Yes', us: 'Not our focus — we do bills' },
      { feature: 'No credit card needed', them: 'No', us: 'Yes' },
      { feature: 'Household sharing', them: 'Yes (paid)', us: 'Coming soon (free)' },
    ],
    verdict: 'Monarch Money is a great product — for people who want a full financial operating system and are willing to pay $180/year for it. If you just want to stop getting surprised by bills, RenewalMate does that for $0.',
  },
  'ynab': {
    name: 'YNAB',
    price: '$14.99/month',
    tagline: 'You need a budget — but you don\'t need to pay $180/year to make one.',
    bankSync: true, free: false, mobileOnly: false, dead: false,
    rows: [
      { feature: 'Price', them: '$14.99/month ($109/yr)', us: 'Free forever' },
      { feature: 'Free trial', them: '34 days', us: 'No trial — just free' },
      { feature: 'Method', them: 'Zero-based envelope budgeting', us: 'Subscription & bill tracking' },
      { feature: 'Learning curve', them: 'Steep — requires a mindset shift', us: 'None — add your bills and go' },
      { feature: 'Bank sync', them: 'Required', us: 'Never' },
      { feature: 'Best for', them: 'Serious budgeters who want full control', us: 'Anyone who wants to stop forgetting bills' },
      { feature: 'No credit card needed', them: 'No', us: 'Yes' },
    ],
    verdict: 'YNAB is the gold standard for zero-based budgeting and it earns that reputation. But it\'s a system — it requires commitment and costs $180/year. RenewalMate is for people who just want to see their recurring expenses clearly, with no learning curve and no subscription.',
  },
  'copilot': {
    name: 'Copilot',
    price: '$13/month',
    tagline: 'Beautiful, smart, iOS-only, and expensive.',
    bankSync: true, free: false, mobileOnly: true, dead: false,
    rows: [
      { feature: 'Price', them: '$13/month ($95/yr)', us: 'Free forever' },
      { feature: 'Platform', them: 'iOS only — no Android, no web', us: 'Web-based — any device, any browser' },
      { feature: 'Free tier', them: 'None after trial', us: 'Full features, always free' },
      { feature: 'Bank sync', them: 'Required', us: 'Never required' },
      { feature: 'Design quality', them: 'Excellent', us: 'Clean and functional' },
      { feature: 'No credit card needed', them: 'No', us: 'Yes' },
      { feature: 'Android support', them: 'No', us: 'Yes (web)' },
    ],
    verdict: 'Copilot has the best design in the category — genuinely beautiful. But it\'s iOS-only, requires a bank connection, and costs $95/year. If you\'re on Android or don\'t want to share bank credentials, RenewalMate is your free alternative.',
  },
  'pocketguard': {
    name: 'PocketGuard',
    price: '$12.99/month',
    tagline: 'Guards your pocket by charging your pocket $12.99 a month.',
    bankSync: true, free: false, mobileOnly: false, dead: false,
    rows: [
      { feature: 'Price', them: '$12.99/month ($74.99/yr)', us: 'Free forever' },
      { feature: 'Free tier', them: 'Very limited', us: 'Full features, always free' },
      { feature: 'Bank sync', them: 'Required', us: 'Never' },
      { feature: '"In My Pocket" feature', them: 'Yes — shows spendable cash', us: 'We focus on recurring bills only' },
      { feature: 'Subscription tracking', them: 'Yes', us: 'Yes — our core feature' },
      { feature: 'No credit card needed', them: 'No', us: 'Yes' },
    ],
    verdict: 'PocketGuard does the job but charges $12.99/month for features that should be free. RenewalMate covers the subscription tracking use case for $0.',
  },
  'simplifi': {
    name: 'Simplifi by Quicken',
    price: '$6.99/month',
    tagline: 'Cheaper than the rest — still not free.',
    bankSync: true, free: false, mobileOnly: false, dead: false,
    rows: [
      { feature: 'Price', them: '$6.99/month ($83.88/yr)', us: 'Free forever' },
      { feature: 'Free tier', them: 'None', us: 'Yes — everything is free' },
      { feature: 'Bank sync', them: 'Required', us: 'Never' },
      { feature: 'Spending plan', them: 'Yes', us: 'Focused on recurring bills' },
      { feature: 'Subscription watchlist', them: 'Yes', us: 'Yes — our core feature' },
      { feature: 'Made by', them: 'Quicken (legacy fintech brand)', us: 'Gilgamesh Enterprise — independent, bootstrapped' },
      { feature: 'No credit card needed', them: 'No', us: 'Yes' },
    ],
    verdict: 'Simplifi is the most affordable paid option at $7/month. But there\'s no free tier, and it still requires bank access. RenewalMate is $7/month cheaper — because it\'s free.',
  },
  'mint': {
    name: 'Mint',
    price: 'Shut down',
    tagline: 'Mint is gone. Here\'s what to use instead.',
    bankSync: false, free: false, mobileOnly: false, dead: true,
    rows: [
      { feature: 'Status', them: 'Shut down January 2024', us: 'Live and actively maintained' },
      { feature: 'Price', them: 'Was free (with ads)', us: 'Free — no ads, no tricks' },
      { feature: 'Subscription tracking', them: 'Had it', us: 'Yes — core feature' },
      { feature: 'Bill alerts', them: 'Had it', us: 'Yes' },
      { feature: 'Your data', them: 'Gone', us: 'Yours — manual entry, stays private' },
      { feature: 'Bank sync', them: 'Required (was)', us: 'Never required' },
      { feature: 'Future', them: 'None', us: 'Actively building' },
    ],
    verdict: 'Mint shut down in January 2024. Millions of users were left scrambling for a free alternative. RenewalMate fills that gap — free bill and subscription tracking, no bank sync required, no ads, no agenda.',
  },
  'lowermysubs': {
    name: 'LowerMySubs',
    price: 'Free (limited)',
    tagline: 'Free but limited. We\'re free and complete.',
    bankSync: false, free: true, mobileOnly: false, dead: false,
    rows: [
      { feature: 'Price', them: 'Free', us: 'Free' },
      { feature: 'Full dashboard', them: 'Limited', us: 'Full dashboard — overdue, due soon, on track' },
      { feature: 'Manual entry', them: 'Yes', us: 'Yes' },
      { feature: 'Bill reduction guides', them: 'Yes — 50+ services', us: 'Coming soon' },
      { feature: 'Renewal alerts', them: 'Basic', us: 'Yes' },
      { feature: 'Platform', them: 'Web', us: 'Web (mobile-optimized)' },
      { feature: 'Actively developed', them: 'Unclear', us: 'Yes — bootstrapped, building in public' },
    ],
    verdict: 'LowerMySubs is genuinely free and a solid tool. RenewalMate aims to be more complete — full dashboard, better alerts, and active development by someone building in public.',
  },
  'tilla': {
    name: 'Tilla',
    price: '$2.99 one-time',
    tagline: 'The cheapest paid option. RenewalMate is still cheaper.',
    bankSync: false, free: false, mobileOnly: true, dead: false,
    rows: [
      { feature: 'Price', them: '$2.99 one-time premium unlock', us: 'Free forever — no unlock needed' },
      { feature: 'Platform', them: 'Mobile app (iOS/Android)', us: 'Web — any device, no install' },
      { feature: 'Bank sync', them: 'No', us: 'No — both privacy-first' },
      { feature: 'Dashboard', them: 'Simple subscription list', us: 'Full expense dashboard' },
      { feature: 'Bill tracking (utilities, insurance)', them: 'Subscription focus', us: 'All recurring expenses' },
      { feature: 'No account required', them: 'App download required', us: 'Browser-based — no install' },
    ],
    verdict: 'Tilla is a clean, indie-built subscription tracker. It\'s $2.99 which is fair. RenewalMate tracks everything — subscriptions, utilities, insurance, bills — for $0 in your browser.',
  },
}

export default function VsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const data = VS_DATA[slug]
  if (!data) notFound()

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-[#1a2e22] tracking-tight">RenewalMate</span>
          </Link>
          <Link href="/#waitlist" className="px-5 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors">
            Get Early Access
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          {data.dead && (
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              ⚠️ {data.name} has shut down
            </div>
          )}
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">
            RenewalMate vs {data.name}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1a2e22] tracking-tight mb-4">
            RenewalMate vs {data.name}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{data.tagline}</p>
          {!data.dead && !data.free && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
              {data.name} costs <strong>{data.price}</strong>. RenewalMate is free.
            </div>
          )}
        </div>

        {/* QUICK BADGES */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {[
            { label: 'RenewalMate is Free', show: true, green: true },
            { label: `${data.name} requires bank sync`, show: data.bankSync, green: false },
            { label: `${data.name} is mobile only`, show: data.mobileOnly, green: false },
            { label: `${data.name} shut down`, show: data.dead, green: false },
          ].filter(b => b.show).map(b => (
            <span key={b.label} className={`text-xs font-bold px-4 py-1.5 rounded-full ${b.green ? 'bg-[#1e7a4a]/10 text-[#1e7a4a]' : 'bg-red-50 text-red-600'}`}>
              {b.label}
            </span>
          ))}
        </div>

        {/* COMPARISON TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto mb-12">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 px-6 py-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Feature</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{data.name}</p>
              <p className="text-xs font-bold text-[#1e7a4a] uppercase tracking-wider">RenewalMate</p>
            </div>
            {data.rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 ${i % 2 === 0 ? '' : 'bg-gray-50/50'} border-b border-gray-50 last:border-0`}>
                <p className="text-sm font-semibold text-gray-700">{row.feature}</p>
                <p className="text-sm text-gray-500">{row.them}</p>
                <p className="text-sm font-semibold text-[#1a2e22]">{row.us}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VERDICT */}
        <div className="bg-[#f0faf5] border border-[#1e7a4a]/20 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-black text-[#1a2e22] mb-3">The verdict</h2>
          <p className="text-gray-600 leading-relaxed">{data.verdict}</p>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#1e7a4a] rounded-2xl p-10">
          <h2 className="text-3xl font-black text-white mb-3">Try RenewalMate free.</h2>
          <p className="text-green-100 mb-6">No credit card. No bank sync. No paywall. Ever.</p>
          <Link href="/#waitlist" className="inline-block px-8 py-3 bg-white text-[#1e7a4a] font-black rounded-full hover:bg-gray-50 transition-colors">
            Get Early Access →
          </Link>
        </div>

        {/* OTHER COMPARISONS */}
        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">More comparisons</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(VS_DATA).filter(([s]) => s !== slug).map(([s, d]) => (
              <Link key={s} href={`/vs/${s}`} className="text-xs font-semibold text-[#1e7a4a] hover:underline bg-[#1e7a4a]/5 px-3 py-1.5 rounded-full">
                vs {d.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link href="/" className="hover:text-[#1e7a4a]">Home</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-[#1e7a4a]">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-[#1e7a4a]">SocialMate</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
