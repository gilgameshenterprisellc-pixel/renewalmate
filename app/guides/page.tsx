import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div className="min-h-screen bg-[#f8faf9]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-[#1a2e22] tracking-tight">RenewalMate</span>
          </Link>
          <div className="flex gap-5 text-sm">
            <Link href="/guides" className="text-[#1e7a4a] font-semibold">Guides</Link>
            <Link href="/blog" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Blog</Link>
            <Link href="/#waitlist" className="px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">From Gilgamesh Enterprise</p>
          <h1 className="text-5xl font-black text-[#1a2e22] tracking-tight mb-4">Free Guides</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything Joshua Bostic learned building from nothing — business, credit, marketing, AI, and money.
            Free forever. No email required.
          </p>
        </div>

        <div className="space-y-5">
          {GUIDES.map(g => (
            <a key={g.vol} href={g.href} target="_blank" rel="noopener noreferrer"
              className="block bg-white border border-gray-100 rounded-2xl p-7 hover:border-[#1e7a4a]/30 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-[#1e7a4a]">{g.vol}</span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{g.tag}</span>
                  </div>
                  <h2 className="text-xl font-black text-[#1a2e22] mb-2 group-hover:text-[#1e7a4a] transition-colors">{g.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
                </div>
                <span className="text-[#1e7a4a] text-lg flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 bg-[#f0faf5] border border-[#1e7a4a]/20 rounded-2xl p-7 text-center">
          <p className="text-[#1a2e22] font-black mb-1">Free. Always.</p>
          <p className="text-gray-500 text-sm">Knowledge shouldn't cost money. Share these if they help you.</p>
          <p className="text-xs text-gray-400 mt-2">Published by <a href="https://www.gilgameshenterprise.com" className="text-[#1e7a4a] hover:underline">Gilgamesh Enterprise</a></p>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <a href="https://www.gilgameshenterprise.com" className="hover:text-[#1e7a4a]">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-[#1e7a4a]">SocialMate</a>
            <Link href="/blog" className="hover:text-[#1e7a4a]">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
