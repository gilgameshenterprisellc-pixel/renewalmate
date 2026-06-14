import Link from 'next/link'

interface Testimonial {
  quote: string
  name: string
  context?: string
}

// Add real testimonials here as they come in.
const TESTIMONIALS: Testimonial[] = []

export default function WallOfLovePage() {
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
          <div className="hidden sm:flex items-center gap-5 text-sm">
            <Link href="/guides" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Guides</Link>
            <Link href="/blog" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Blog</Link>
            <Link href="/faq" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">FAQ</Link>
            <Link href="/wall-of-love" className="text-[#1e7a4a] font-semibold">Wall of Love</Link>
            <Link href="/#waitlist" className="px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
          </div>
          <Link href="/#waitlist" className="sm:hidden px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">Wall of Love</p>
          <h1 className="text-5xl font-black text-[#1a2e22] tracking-tight mb-4">From real people.</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            RenewalMate is brand new and built by one person. Every testimonial here is real —
            no stock quotes, no fake avatars.
          </p>
        </div>

        {TESTIMONIALS.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center mb-12">
            <p className="text-[#1a2e22] font-bold mb-2">No testimonials yet — be the first.</p>
            <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
              If RenewalMate helped you find a forgotten subscription, hit a savings goal, or just made your
              finances feel less chaotic, we'd love to hear it. Real stories from real users help others trust a tool
              built by one person.
            </p>
            <a
              href="mailto:gilgameshenterprisellc@gmail.com?subject=My RenewalMate story"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e7a4a] text-white font-bold rounded-full text-sm hover:bg-[#166038] transition-colors"
            >
              Share your story →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-[#1a2e22] text-sm leading-relaxed mb-3">"{t.quote}"</p>
                <p className="text-xs font-bold text-gray-400">— {t.name}{t.context ? `, ${t.context}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#1e7a4a]/8 border border-[#1e7a4a]/20 rounded-2xl p-8 text-center">
          <p className="text-[#1a2e22] font-bold mb-2">Want to be part of the story?</p>
          <p className="text-gray-500 text-sm mb-5">
            RenewalMate is free, manual-entry, and built to respect your privacy. Try it and tell us what you think.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e7a4a] text-white font-bold rounded-full text-sm hover:bg-[#166038] transition-colors">
            Get started free →
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link href="/wall-of-love" className="hover:text-[#1e7a4a]">Wall of Love</Link>
            <Link href="/cancel" className="hover:text-[#1e7a4a]">Cancel Directory</Link>
            <Link href="/faq" className="hover:text-[#1e7a4a]">FAQ</Link>
            <Link href="/blog" className="hover:text-[#1e7a4a]">Blog</Link>
            <Link href="/privacy" className="hover:text-[#1e7a4a]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
