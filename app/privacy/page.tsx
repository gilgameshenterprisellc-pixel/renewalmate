import Link from 'next/link'
import { fontVariables, displayFont as display } from '@/lib/fonts'

const PRINCIPLES = [
  {
    title: 'Manual entry by default — bank sync is optional, and never on the free plan',
    body: 'RenewalMate works fully with manual entry: you tell us what you pay and when, and we never see your transaction history. On RenewalMate Plus, you can optionally connect a bank account through Plaid to auto-detect recurring charges. It\'s opt-in, clearly labeled as a paid feature, and you can disconnect it anytime from Settings — which immediately revokes our access and deletes the stored connection.',
  },
  {
    title: 'We don\'t sell your data',
    body: 'Not to advertisers, not to data brokers, not to anyone. We have no investors pushing us to monetize your information, and we never will. Your data pays for nothing but your own dashboard — including any transaction data from an optional bank connection, which is used only to detect recurring charges and is never shared or sold.',
  },
  {
    title: 'You can leave with everything, anytime',
    body: 'One click in Settings exports a complete JSON file of every subscription, bill, budget, goal, and net worth entry you\'ve added. No request, no waiting, no support ticket. It\'s your data — take it whenever you want.',
  },
  {
    title: 'Full account deletion, no approval needed',
    body: 'Also in Settings: permanently delete your account and every piece of data tied to it, instantly. No "request deletion" form, no 30-day wait, no email back and forth. You decide, it happens.',
  },
  {
    title: 'We collect the minimum',
    body: 'Your email (for login and optional alerts) and whatever you choose to type into the app — plus, if you opt into bank sync on Plus, the transaction data needed to detect recurring charges. That\'s the entire list. No tracking pixels chasing you around the web, no behavioral profiling.',
  },
  {
    title: 'Paid features are optional, clearly labeled, and never required',
    body: 'RenewalMate\'s free tier is funded by keeping costs near zero, not by turning you into the product. Features that cost us money to run — like Plaid bank sync and AI-powered insights — are part of RenewalMate Plus, a paid, opt-in upgrade. The core app (manual tracking, budgets, goals, net worth, reminders, data export, account deletion) stays free, full-featured, and always will.',
  },
]

export default function PrivacyPage() {
  return (
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased`}>
      <nav className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
              <span className={`${display} font-semibold text-void text-sm`}>R</span>
            </div>
            <span className={`${display} font-semibold text-ink-high`}>RenewalMate</span>
          </Link>
          <div className="hidden sm:flex items-center gap-5 text-sm">
            <Link href="/guides" className="text-ink-muted hover:text-violet-bright transition-colors">Guides</Link>
            <Link href="/blog" className="text-ink-muted hover:text-violet-bright transition-colors">Blog</Link>
            <Link href="/faq" className="text-ink-muted hover:text-violet-bright transition-colors">FAQ</Link>
            <Link href="/privacy" className="text-violet-bright font-semibold">Privacy</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
          </div>
          <Link href="/signup" className="sm:hidden px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-3">Privacy</p>
          <h1 className={`${display} font-semibold text-5xl text-ink-high mb-4`}>Your data is yours.</h1>
          <p className="text-ink-body max-w-xl mx-auto">
            We built RenewalMate because the existing tools ask too much for too little. Here&apos;s exactly what
            we collect, what we don&apos;t, and what you can do about it — no fine print required.
          </p>
        </div>

        <div className="space-y-4 mb-14">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="bg-panel border border-edge rounded-2xl p-6">
              <h2 className={`${display} font-semibold text-ink-high mb-2`}>{p.title}</h2>
              <p className="text-ink-muted text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-panel-raised border border-violet/20 rounded-2xl p-8 text-center">
          <p className={`${display} font-semibold text-ink-high mb-2`}>Already have an account?</p>
          <p className="text-ink-muted text-sm mb-5">
            Export your data or delete your account anytime from Settings — no questions asked.
          </p>
          <Link href="/settings"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet to-[#A472F0] text-white font-bold rounded-full text-sm shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]">
            Go to Settings →
          </Link>
        </div>

        <p className="text-center text-xs text-ink-muted mt-10">
          Questions about this policy? Email <a href="mailto:gilgameshenterprisellc@gmail.com" className="text-violet-bright hover:text-violet">gilgameshenterprisellc@gmail.com</a> — we read every message.
        </p>
      </div>

      <footer className="border-t border-edge py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-ink-muted">
            <Link href="/faq" className="hover:text-violet-bright transition-colors">FAQ</Link>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-violet-bright transition-colors">Privacy</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
