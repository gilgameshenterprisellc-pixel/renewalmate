'use client'
import { useState } from 'react'
import Link from 'next/link'
import { fontVariables, displayFont as display } from '@/lib/fonts'

const FAQS = [
  {
    category: 'About RenewalMate',
    questions: [
      {
        q: 'What is RenewalMate?',
        a: 'RenewalMate is a free subscription and bill tracker. You manually enter your subscriptions, recurring bills, and expenses. RenewalMate shows you what is overdue, what is due soon, and what is on track - in one dashboard. No bank login required.',
      },
      {
        q: 'Is RenewalMate really free?',
        a: 'Mostly, yes. Manual tracking — subscriptions, bills, budgets, net worth, and goals — is free forever, no credit card required. We follow one rule: if a feature doesn\'t cost us anything to run, it\'s free for you, forever. The only paid tier, RenewalMate Plus, covers features that do cost us money to run (Plaid bank sync, AI-powered insights), and it\'s entirely optional.',
      },
      {
        q: 'Who built RenewalMate?',
        a: 'RenewalMate is a Gilgamesh Enterprise product, built by Joshua Bostic. Part of the "Mate series" - a family of tools tackling real problems. SocialMate handles social media scheduling. RenewalMate handles recurring expenses. More to come.',
      },
      {
        q: 'Who is this for?',
        a: 'Anyone who pays recurring bills. That is everyone. Specifically - people who have lost track of subscriptions (Netflix, Spotify, gym memberships, software, insurance) and want one place to see everything at a glance without connecting their bank account.',
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        q: 'Do I have to connect my bank account?',
        a: 'No. RenewalMate works fully manual entry by default - you add your bills yourself, and your bank credentials never touch our servers. If you want, RenewalMate Plus offers optional Plaid bank sync for automatic detection, but it is entirely opt-in and disconnectable anytime.',
      },
      {
        q: 'What does the dashboard show?',
        a: 'Three categories: Overdue (bills you missed), Due Soon (bills coming up), and On Track (bills with time to spare). Each entry shows the name, category, amount, and due date. You can see at a glance where your money is going.',
      },
      {
        q: 'Can I get renewal alerts?',
        a: 'Yes. RenewalMate will notify you before subscriptions renew so you can decide whether to keep them or cancel before you get charged again.',
      },
      {
        q: 'What categories are supported?',
        a: 'Entertainment, utilities, insurance, software, gym, subscriptions, housing, and more. Any recurring expense you pay belongs in RenewalMate.',
      },
    ],
  },
  {
    category: 'vs. Competitors',
    questions: [
      {
        q: 'How is this different from RocketMoney?',
        a: 'RocketMoney charges $12/month for features that should be free. It also requires you to connect your bank account. RenewalMate is free and manual-entry only. We think a tool that helps you save money should not cost you money.',
      },
      {
        q: 'How is this different from Monarch Money?',
        a: 'Monarch Money is $14.99/month and also requires bank connectivity. Great product - but expensive for a tracker. RenewalMate costs nothing and does not need your banking credentials.',
      },
      {
        q: 'I used Mint. Can I use RenewalMate instead?',
        a: 'Yes. Mint shut down in January 2024. RenewalMate covers the subscription and bill tracking portion of what Mint did - free, no bank connection required. Import your bills manually and you are set up in under 5 minutes.',
      },
      {
        q: 'What about YNAB?',
        a: 'YNAB ($14.99/month) is a full budgeting system. RenewalMate is specifically for tracking recurring bills and subscriptions - not full budgeting. Different tools for different needs. Both can coexist if you use YNAB for budgeting and RenewalMate for recurring expense visibility.',
      },
    ],
  },
  {
    category: 'Privacy & Data',
    questions: [
      {
        q: 'What data do you collect?',
        a: 'Only what you give us: your email (for account login and alerts) and the bills you manually enter. No bank data. No transaction history. No third-party data sharing.',
      },
      {
        q: 'Do you sell my data?',
        a: 'No. Never. We are a bootstrapped product with no investors pressuring us to monetize your personal information. Your data is yours.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

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
            <Link href="/faq" className="text-violet-bright font-semibold">FAQ</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
          </div>
          <Link href="/signup" className="sm:hidden px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-3">FAQ</p>
          <h1 className={`${display} font-semibold text-5xl text-ink-high mb-4`}>Questions answered.</h1>
          <p className="text-ink-body">Straight answers about how RenewalMate works and why it&apos;s free.</p>
        </div>

        <div className="space-y-10">
          {FAQS.map(section => (
            <div key={section.category}>
              <h2 className="text-xs font-bold text-violet-bright uppercase tracking-[0.2em] mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.questions.map((item, i) => {
                  const key = `${section.category}-${i}`
                  const isOpen = openItem === key
                  return (
                    <div key={key} className="bg-panel border border-edge rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="font-bold text-ink-high text-sm">{item.q}</span>
                        <span className={`text-violet-bright text-lg shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="text-ink-muted text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-panel-raised border border-violet/20 rounded-2xl p-8 text-center">
          <p className={`${display} font-semibold text-ink-high mb-2`}>Still have a question?</p>
          <p className="text-ink-muted text-sm mb-5">Reach out directly. We read every email.</p>
          <a href="mailto:gilgameshenterprisellc@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet to-[#A472F0] text-white font-bold rounded-full text-sm shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]">
            Contact us →
          </a>
        </div>
      </div>

      <footer className="border-t border-edge py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-ink-muted">
            <Link href="/faq" className="hover:text-violet-bright transition-colors">FAQ</Link>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
