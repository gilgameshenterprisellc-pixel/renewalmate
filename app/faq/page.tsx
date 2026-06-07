'use client'
import { useState } from 'react'
import Link from 'next/link'

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
        a: 'Yes. Free forever. No premium tier for the core features. No credit card required. We follow a simple rule: if it doesn\'t cost us anything to run, it\'s free for you.',
      },
      {
        q: 'Who built RenewalMate?',
        a: 'RenewalMate is a Gilgamesh Enterprise product, built by Joshua Bostic. Part of the "Mate series" - a family of free tools tackling real problems. SocialMate handles social media scheduling. RenewalMate handles recurring expenses. More to come.',
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
        a: 'No. Never. RenewalMate is manual entry only. You add your bills yourself. Your bank credentials never touch our servers. Privacy first - always.',
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
    <div className="min-h-screen bg-[#f8faf9]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-[#1a2e22] tracking-tight">RenewalMate</span>
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/guides" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Guides</Link>
            <Link href="/blog" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Blog</Link>
            <Link href="/faq" className="text-[#1e7a4a] font-semibold">FAQ</Link>
            <Link href="/#waitlist" className="px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">FAQ</p>
          <h1 className="text-5xl font-black text-[#1a2e22] tracking-tight mb-4">Questions answered.</h1>
          <p className="text-gray-500">Straight answers about how RenewalMate works and why it's free.</p>
        </div>

        <div className="space-y-10">
          {FAQS.map(section => (
            <div key={section.category}>
              <h2 className="text-xs font-bold text-[#1e7a4a] uppercase tracking-[0.2em] mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.questions.map((item, i) => {
                  const key = `${section.category}-${i}`
                  const isOpen = openItem === key
                  return (
                    <div key={key} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="font-bold text-[#1a2e22] text-sm">{item.q}</span>
                        <span className={`text-[#1e7a4a] text-lg shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#1e7a4a]/8 border border-[#1e7a4a]/20 rounded-2xl p-8 text-center">
          <p className="text-[#1a2e22] font-bold mb-2">Still have a question?</p>
          <p className="text-gray-500 text-sm mb-5">Reach out directly. We read every email.</p>
          <a href="mailto:gilgameshenterprisellc@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e7a4a] text-white font-bold rounded-full text-sm hover:bg-[#166038] transition-colors">
            Contact us →
          </a>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link href="/faq" className="hover:text-[#1e7a4a]">FAQ</Link>
            <Link href="/blog" className="hover:text-[#1e7a4a]">Blog</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-[#1e7a4a]">Gilgamesh Enterprise</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
