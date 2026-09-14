import Link from 'next/link'
import type { Metadata } from 'next'
import { fontVariables, displayFont as display } from '@/lib/fonts'

export const metadata: Metadata = {
  title: "Gilgamesh's Guides — Free Business Playbooks",
  description: "Free guides on starting a business, building credit, marketing on zero budget, vibe coding, and creator monetization. Written by Joshua Bostic of Gilgamesh Enterprise.",
}

const GUIDES = [
  {
    vol: 'Vol. 1', title: 'Starting a Business From Scratch',
    desc: 'LLC formation, EIN, first customer, co-founder splits, and building through hard times.',
    href: 'https://socialmate.studio/guides/starting-a-business', tag: 'Business',
  },
  {
    vol: 'Vol. 2', title: 'Marketing on Zero Budget',
    desc: 'Content flywheels, community-first distribution, building in public with no ad spend.',
    href: 'https://socialmate.studio/guides/marketing-zero-budget', tag: 'Marketing',
  },
  {
    vol: 'Vol. 3', title: 'Business Credit & Legal',
    desc: 'DUNS, PAYDEX, net-30 vendors, tax deductions, LLC vs S-Corp, banking, and insurance.',
    href: 'https://socialmate.studio/guides/business-credit-legal', tag: 'Finance & Legal',
  },
  {
    vol: 'Vol. 4', title: 'Vibe Coding With AI',
    desc: 'Build real software with AI — stack, workflow, prompting, debugging, shipping.',
    href: 'https://socialmate.studio/guides/vibe-coding-with-ai', tag: 'Technology',
  },
  {
    vol: 'Vol. 5', title: 'Creator Monetization',
    desc: 'Tip jars, fan subscriptions, digital products, brand deals, affiliate marketing, and a $5K/month roadmap.',
    href: 'https://socialmate.studio/guides/creator-monetization', tag: 'Monetization',
  },
  {
    vol: 'Vol. 6', title: 'Your First 30 Days on Social Media',
    desc: 'The One-Platform Rule, profile setup, your first 10 posts, and getting your first 100 followers for free.',
    href: 'https://socialmate.studio/guides/first-30-days-social-media', tag: 'Social Media',
  },
  {
    vol: 'Vol. 7', title: 'Build Your Brand from Zero',
    desc: 'Finding your niche, telling your story, a free visual identity, and turning your brand into opportunity.',
    href: 'https://socialmate.studio/guides/build-your-brand-from-zero', tag: 'Personal Brand',
  },
  {
    vol: 'Vol. 8', title: 'From Side Hustle to Full-Time Creator',
    desc: 'Building while you work, your first $500 online, the creator revenue stack, and the bridge income strategy.',
    href: 'https://socialmate.studio/guides/side-hustle-to-full-time-creator', tag: 'Full-Time Creator',
  },
  {
    vol: 'Vol. 9', title: "The Content Creator's Business Guide",
    desc: 'LLCs, taxes, contracts, pricing your work, tools worth the cost, and brand deal negotiation.',
    href: 'https://socialmate.studio/guides/content-creator-business', tag: 'Business',
  },
  {
    vol: 'Vol. 10', title: 'AI Tools for Creators: The Complete 2026 Handbook',
    desc: 'The full AI stack for 2026 — ideation, writing, visuals, video, scheduling, and analytics.',
    href: 'https://socialmate.studio/guides/ai-tools-for-creators-2026', tag: 'AI Tools',
  },
]

export default function GuidesPage() {
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
          <div className="hidden sm:flex gap-5 text-sm items-center">
            <Link href="/guides" className="text-violet-bright font-semibold">Guides</Link>
            <Link href="/blog" className="text-ink-muted hover:text-violet-bright transition-colors">Blog</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
          </div>
          <Link href="/signup" className="sm:hidden px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-3">From Gilgamesh Enterprise</p>
          <h1 className={`${display} font-semibold text-5xl text-ink-high mb-4`}>Free Guides</h1>
          <p className="text-ink-body text-lg max-w-2xl mx-auto">
            Everything Joshua Bostic learned building from nothing — business, credit, marketing, AI, and money.
            Free forever. No email required.
          </p>
        </div>

        <div className="space-y-5">
          {GUIDES.map(g => (
            <a key={g.vol} href={g.href} target="_blank" rel="noopener noreferrer"
              className="block bg-panel border border-edge rounded-2xl p-7 hover:border-violet/40 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-violet-bright">{g.vol}</span>
                    <span className="text-xs font-bold text-ink-muted bg-panel-raised px-2 py-0.5 rounded-full">{g.tag}</span>
                  </div>
                  <h2 className="text-xl font-bold text-ink-high mb-2 group-hover:text-violet-bright transition-colors">{g.title}</h2>
                  <p className="text-ink-muted text-sm leading-relaxed">{g.desc}</p>
                </div>
                <span className="text-violet-bright text-lg flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 bg-panel-raised border border-violet/20 rounded-2xl p-7 text-center">
          <p className={`${display} font-semibold text-ink-high mb-1`}>Free. Always.</p>
          <p className="text-ink-muted text-sm">Knowledge shouldn&apos;t cost money. Share these if they help you.</p>
          <p className="text-xs text-ink-faint mt-2">Published by <a href="https://www.gilgameshenterprise.com" className="text-violet-bright hover:text-violet">Gilgamesh Enterprise</a></p>
        </div>
      </div>

      <footer className="border-t border-edge py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-ink-muted">
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-violet-bright transition-colors">SocialMate</a>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
