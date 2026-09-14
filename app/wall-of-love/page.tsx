import Link from 'next/link'
import { fontVariables, displayFont as display } from '@/lib/fonts'

interface Testimonial {
  quote: string
  name: string
  context?: string
}

// Add real testimonials here as they come in.
const TESTIMONIALS: Testimonial[] = []

export default function WallOfLovePage() {
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
            <Link href="/wall-of-love" className="text-violet-bright font-semibold">Wall of Love</Link>
            <Link href="/signup" className="px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
          </div>
          <Link href="/signup" className="sm:hidden px-4 py-1.5 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-full">Get Started</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-[0.7rem] font-bold tracking-[0.16em] uppercase text-ink-muted mb-3">Wall of Love</p>
          <h1 className={`${display} font-semibold text-5xl text-ink-high mb-4`}>From real people.</h1>
          <p className="text-ink-body max-w-xl mx-auto">
            RenewalMate is brand new and built by one person. Every testimonial here is real —
            no stock quotes, no fake avatars.
          </p>
        </div>

        {TESTIMONIALS.length === 0 ? (
          <div className="bg-panel border border-edge rounded-2xl p-10 text-center mb-12">
            <p className={`${display} font-semibold text-ink-high mb-2`}>No testimonials yet — be the first.</p>
            <p className="text-ink-muted text-sm mb-5 max-w-md mx-auto">
              If RenewalMate helped you find a forgotten subscription, hit a savings goal, or just made your
              finances feel less chaotic, we&apos;d love to hear it. Real stories from real users help others trust a tool
              built by one person.
            </p>
            <a
              href="mailto:gilgameshenterprisellc@gmail.com?subject=My RenewalMate story"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet to-[#A472F0] text-white font-bold rounded-full text-sm shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]"
            >
              Share your story →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-panel border border-edge rounded-2xl p-6">
                <p className="text-ink-high text-sm leading-relaxed mb-3">&quot;{t.quote}&quot;</p>
                <p className="text-xs font-bold text-ink-muted">— {t.name}{t.context ? `, ${t.context}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-panel-raised border border-violet/20 rounded-2xl p-8 text-center">
          <p className={`${display} font-semibold text-ink-high mb-2`}>Want to be part of the story?</p>
          <p className="text-ink-muted text-sm mb-5">
            RenewalMate is free, manual-entry, and built to respect your privacy. Try it and tell us what you think.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet to-[#A472F0] text-white font-bold rounded-full text-sm shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]">
            Get started free →
          </Link>
        </div>
      </div>

      <footer className="border-t border-edge py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-muted">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-ink-muted">
            <Link href="/wall-of-love" className="hover:text-violet-bright transition-colors">Wall of Love</Link>
            <Link href="/cancel" className="hover:text-violet-bright transition-colors">Cancel Directory</Link>
            <Link href="/faq" className="hover:text-violet-bright transition-colors">FAQ</Link>
            <Link href="/blog" className="hover:text-violet-bright transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-violet-bright transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
