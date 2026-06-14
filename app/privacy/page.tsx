import Link from 'next/link'

const PRINCIPLES = [
  {
    title: 'No bank connection, ever',
    body: 'RenewalMate is manual-entry only. You tell us what you pay and when. We never ask for your bank login, never connect to Plaid or any aggregator on the free tier, and never see your transaction history.',
  },
  {
    title: 'We don\'t sell your data',
    body: 'Not to advertisers, not to data brokers, not to anyone. We have no investors pushing us to monetize your information, and we never will. Your data pays for nothing but your own dashboard.',
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
    body: 'Your email (for login and optional alerts) and whatever you choose to type into the app. That\'s the entire list. No tracking pixels chasing you around the web, no behavioral profiling.',
  },
  {
    title: 'Free means free — not "free until we need your data"',
    body: 'RenewalMate\'s free tier is funded by keeping costs near zero, not by turning you into the product. If a future feature requires a cost-incurring service (like bank sync or AI), it will be clearly optional, clearly labeled, and never required to use the core app.',
  },
]

export default function PrivacyPage() {
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
            <Link href="/privacy" className="text-[#1e7a4a] font-semibold">Privacy</Link>
            <Link href="/#waitlist" className="px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
          </div>
          <Link href="/#waitlist" className="sm:hidden px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">Privacy</p>
          <h1 className="text-5xl font-black text-[#1a2e22] tracking-tight mb-4">Your data is yours.</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            We built RenewalMate because the existing tools ask too much for too little. Here's exactly what
            we collect, what we don't, and what you can do about it — no fine print required.
          </p>
        </div>

        <div className="space-y-4 mb-14">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-black text-[#1a2e22] mb-2">{p.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1e7a4a]/8 border border-[#1e7a4a]/20 rounded-2xl p-8 text-center">
          <p className="text-[#1a2e22] font-bold mb-2">Already have an account?</p>
          <p className="text-gray-500 text-sm mb-5">
            Export your data or delete your account anytime from Settings — no questions asked.
          </p>
          <Link href="/settings"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e7a4a] text-white font-bold rounded-full text-sm hover:bg-[#166038] transition-colors">
            Go to Settings →
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Questions about this policy? Email <a href="mailto:gilgameshenterprisellc@gmail.com" className="text-[#1e7a4a] hover:underline">gilgameshenterprisellc@gmail.com</a> — we read every message.
        </p>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link href="/faq" className="hover:text-[#1e7a4a]">FAQ</Link>
            <Link href="/blog" className="hover:text-[#1e7a4a]">Blog</Link>
            <Link href="/privacy" className="hover:text-[#1e7a4a]">Privacy</Link>
            <a href="https://www.gilgameshenterprise.com" className="hover:text-[#1e7a4a]">Gilgamesh Enterprise</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
