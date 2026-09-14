import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-posts'
import type { Metadata } from 'next'
import BlogClient from './BlogClient'
import { fontVariables, displayFont as display } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Blog — RenewalMate',
  description: 'Subscription tracking tips, free Mint alternatives, how to cancel forgotten bills, and personal finance advice. No fluff.',
}

export default function BlogPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))
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
            <Link href="/blog" className="text-violet-bright font-semibold">Blog</Link>
            <Link href="/faq" className="text-ink-muted hover:text-violet-bright transition-colors">FAQ</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
          </div>
          <Link href="/signup" className="sm:hidden px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-14">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-3">The RenewalMate Blog</p>
          <h1 className={`${display} font-semibold text-5xl text-ink-high mb-4`}>Spend less. Know more.</h1>
          <p className="text-ink-body text-lg">Subscription tracking, free alternatives to paid apps, and personal finance tips with no agenda.</p>
        </div>
        <BlogClient posts={sorted} />
      </div>

      <footer className="border-t border-edge py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-ink-muted">
            <Link href="/faq" className="hover:text-violet-bright transition-colors">FAQ</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-violet-bright transition-colors">Gilgamesh Enterprise</a>
            <a href="https://socialmate.studio" className="hover:text-violet-bright transition-colors">SocialMate</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
