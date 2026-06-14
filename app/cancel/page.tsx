'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Service {
  name: string
  category: string
  method: 'link' | 'phone' | 'app' | 'in-person'
  detail: string
  url?: string
}

const SERVICES: Service[] = [
  { name: 'Netflix', category: 'Streaming', method: 'link', detail: 'Account → Cancel Membership. Access continues until the end of the billing period.', url: 'https://www.netflix.com/cancelplan' },
  { name: 'Hulu', category: 'Streaming', method: 'link', detail: 'Account → Your Subscription → Cancel.', url: 'https://www.hulu.com/account' },
  { name: 'Disney+', category: 'Streaming', method: 'link', detail: 'Account → Subscription → Cancel Subscription.', url: 'https://www.disneyplus.com/account/subscription' },
  { name: 'Max (HBO)', category: 'Streaming', method: 'link', detail: 'Settings → Subscription → Manage Subscription → Cancel.', url: 'https://help.max.com/' },
  { name: 'Amazon Prime', category: 'Streaming', method: 'link', detail: 'Your Account → Prime Membership → End Membership.', url: 'https://www.amazon.com/manageyourprime' },
  { name: 'Apple TV+', category: 'Streaming', method: 'app', detail: 'Settings app → [Your Name] → Subscriptions → Apple TV+ → Cancel.' },
  { name: 'Paramount+', category: 'Streaming', method: 'link', detail: 'Account → Subscription → Cancel Subscription.', url: 'https://www.paramountplus.com/account/' },
  { name: 'Peacock', category: 'Streaming', method: 'link', detail: 'Account → Plan → Cancel Peacock Premium.', url: 'https://www.peacocktv.com/plans' },
  { name: 'YouTube Premium', category: 'Streaming', method: 'link', detail: 'Membership page → Manage Membership → Deactivate.', url: 'https://www.youtube.com/paid_memberships' },
  { name: 'Spotify', category: 'Music', method: 'link', detail: 'Account → Your Plan → Cancel Premium.', url: 'https://www.spotify.com/account/subscription/' },
  { name: 'Apple Music', category: 'Music', method: 'app', detail: 'Settings app → [Your Name] → Subscriptions → Apple Music → Cancel.' },
  { name: 'YouTube Music', category: 'Music', method: 'link', detail: 'Membership page → Manage Membership → Deactivate.', url: 'https://www.youtube.com/paid_memberships' },
  { name: 'Tidal', category: 'Music', method: 'link', detail: 'Account Settings → Subscription → Cancel Subscription.', url: 'https://tidal.com/account' },
  { name: 'Audible', category: 'Books & Audio', method: 'link', detail: 'Account Details → Audible Membership → Cancel Membership.', url: 'https://www.audible.com/account/membership' },
  { name: 'Kindle Unlimited', category: 'Books & Audio', method: 'link', detail: 'Manage Your Content and Devices → Preferences → Manage your Kindle Unlimited membership → Cancel.', url: 'https://www.amazon.com/kindle-dbs/hz/subscribe/ku' },
  { name: 'PlayStation Plus', category: 'Gaming', method: 'link', detail: 'Account → Subscriptions → PlayStation Plus → Turn off Auto-Renew.', url: 'https://www.playstation.com/ps-plus/' },
  { name: 'Xbox Game Pass', category: 'Gaming', method: 'link', detail: 'Account → Services & subscriptions → Game Pass → Cancel.', url: 'https://account.microsoft.com/services' },
  { name: 'Nintendo Switch Online', category: 'Gaming', method: 'link', detail: 'Account Settings → Subscription → Auto-Renew → Turn off.', url: 'https://accounts.nintendo.com/' },
  { name: 'Discord Nitro', category: 'Gaming', method: 'app', detail: 'User Settings → Subscriptions → Cancel Subscription.' },
  { name: 'Adobe Creative Cloud', category: 'Software', method: 'link', detail: 'Account → Plans → Manage Plan → Cancel Plan. Annual plans charge an early-termination fee.', url: 'https://account.adobe.com/plans' },
  { name: 'Microsoft 365', category: 'Software', method: 'link', detail: 'Account → Services & subscriptions → Microsoft 365 → Cancel.', url: 'https://account.microsoft.com/services' },
  { name: 'Canva Pro', category: 'Software', method: 'link', detail: 'Account Settings → Billing & Plans → Cancel Plan.', url: 'https://www.canva.com/settings/billing' },
  { name: 'Dropbox', category: 'Software', method: 'link', detail: 'Account → Plan → Manage Plan → Cancel Plan.', url: 'https://www.dropbox.com/account/billing' },
  { name: 'Google One', category: 'Software', method: 'link', detail: 'Google One app or account page → Membership details → Cancel membership.', url: 'https://one.google.com/storage' },
  { name: 'iCloud+', category: 'Software', method: 'app', detail: 'Settings app → [Your Name] → iCloud → Manage Storage → Change Storage Plan → Downgrade.' },
  { name: 'LastPass', category: 'Software', method: 'link', detail: 'Account Settings → Subscription → Cancel Subscription.', url: 'https://lastpass.com/' },
  { name: 'Notion', category: 'Software', method: 'link', detail: 'Settings → Plans → Change plan → Downgrade to Free.', url: 'https://www.notion.so/' },
  { name: 'ChatGPT Plus', category: 'Software', method: 'link', detail: 'Settings → My Plan → Manage my subscription → Cancel Plan.', url: 'https://chat.openai.com/' },
  { name: 'Planet Fitness', category: 'Fitness', method: 'in-person', detail: 'Most locations require a written cancellation letter delivered in person or by certified mail — phone/email usually isn\'t accepted. Check your contract.' },
  { name: 'LA Fitness', category: 'Fitness', method: 'phone', detail: 'Call member services or send a certified letter to the address on your contract. Cancellations are notoriously hard — get written confirmation.' },
  { name: 'Equinox', category: 'Fitness', method: 'phone', detail: 'Call your home club or member services. Written notice may be required depending on contract terms.' },
  { name: 'Peloton App', category: 'Fitness', method: 'link', detail: 'Account → Subscriptions → Cancel Membership.', url: 'https://www.onepeloton.com/account' },
  { name: 'Strava', category: 'Fitness', method: 'link', detail: 'Settings → Subscription → Cancel Subscription.', url: 'https://www.strava.com/settings/subscription' },
  { name: 'ClassPass', category: 'Fitness', method: 'link', detail: 'Account → Membership → Cancel Membership (must cancel before renewal date).', url: 'https://classpass.com/account' },
  { name: 'New York Times', category: 'News', method: 'link', detail: 'Account → Subscriptions & Billing → Cancel Subscription.', url: 'https://myaccount.nytimes.com/seg/membercenter' },
  { name: 'Wall Street Journal', category: 'News', method: 'phone', detail: 'Customer center chat or call 1-800-JOURNAL. Online self-cancel is often disabled — be persistent.' },
  { name: 'Washington Post', category: 'News', method: 'link', detail: 'My Account → Subscriptions → Cancel.', url: 'https://www.washingtonpost.com/subscribe/account/' },
  { name: 'Amazon Subscribe & Save', category: 'Shopping', method: 'link', detail: 'Your Account → Subscribe & Save → Manage Subscriptions → Cancel.', url: 'https://www.amazon.com/ss/manage' },
  { name: 'Chewy Autoship', category: 'Shopping', method: 'link', detail: 'Account → Autoship → Edit/Cancel Order.', url: 'https://www.chewy.com/app/account/autoship' },
  { name: 'HelloFresh', category: 'Meal Kits', method: 'link', detail: 'Account Settings → Plan Settings → Deactivate Account. Must pause/cancel before the weekly cutoff.', url: 'https://www.hellofresh.com/' },
  { name: 'DoorDash DashPass', category: 'Delivery', method: 'app', detail: 'Account → DashPass → Cancel Membership.' },
  { name: 'Uber One', category: 'Delivery', method: 'app', detail: 'Account → Uber One → Manage Membership → End Membership.' },
  { name: 'Amazon Music Unlimited', category: 'Music', method: 'link', detail: 'Account → Manage Your Subscriptions → Cancel.', url: 'https://www.amazon.com/music/unlimited/settings' },
  { name: 'SiriusXM', category: 'Audio', method: 'phone', detail: 'Online cancellation is often hidden — call 1-866-635-2349. Be ready to decline retention offers.' },
  { name: 'Gym memberships (general)', category: 'Fitness', method: 'in-person', detail: 'Read your contract for the exact method required (written letter, certified mail, in-person). Keep a copy of everything you send and get confirmation.' },
]

const CATEGORIES = ['All', ...Array.from(new Set(SERVICES.map((s) => s.category)))]

const METHOD_LABEL: Record<Service['method'], string> = {
  link: 'Cancel online',
  phone: 'Call to cancel',
  app: 'Cancel in app',
  'in-person': 'Written/in-person',
}

const METHOD_COLOR: Record<Service['method'], string> = {
  link: 'bg-[#1e7a4a]/10 text-[#1e7a4a]',
  app: 'bg-blue-50 text-blue-600',
  phone: 'bg-amber-50 text-amber-600',
  'in-person': 'bg-red-50 text-red-600',
}

export default function CancelDirectoryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = SERVICES.filter((s) => {
    const matchesCategory = category === 'All' || s.category === category
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
            <Link href="/cancel" className="text-[#1e7a4a] font-semibold">Cancel Directory</Link>
            <Link href="/guides" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Guides</Link>
            <Link href="/blog" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">Blog</Link>
            <Link href="/faq" className="text-gray-500 hover:text-[#1e7a4a] transition-colors">FAQ</Link>
            <Link href="/#waitlist" className="px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
          </div>
          <Link href="/#waitlist" className="sm:hidden px-4 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-full">Get Access</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-[#1e7a4a] text-xs font-bold tracking-[0.3em] uppercase mb-3">Cancellation Directory</p>
          <h1 className="text-5xl font-black text-[#1a2e22] tracking-tight mb-4">How to actually cancel.</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Companies bury the cancel button on purpose. Here's the real path for {SERVICES.length}+ popular subscriptions —
            no dark patterns, no retention maze.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search a service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-sm text-gray-400">
            No services match "{search}". Know how to cancel it? Email us and we'll add it.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s) => (
              <div key={s.name} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="font-bold text-[#1a2e22] text-sm">{s.name}</div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${METHOD_COLOR[s.method]}`}>
                    {METHOD_LABEL[s.method]}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-2">{s.detail}</p>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#1e7a4a] hover:underline">
                    Go to {s.name} account settings →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 bg-[#1e7a4a]/8 border border-[#1e7a4a]/20 rounded-2xl p-8 text-center">
          <p className="text-[#1a2e22] font-bold mb-2">Track every subscription you cancel</p>
          <p className="text-gray-500 text-sm mb-5">
            Add a Cancel URL to any item in RenewalMate so you always have the cancellation page one click away.
          </p>
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e7a4a] text-white font-bold rounded-full text-sm hover:bg-[#166038] transition-colors">
            Go to dashboard →
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Cancellation steps change without notice. Always confirm in the company's official app or account settings.
          Missing a service or found outdated info? Email <a href="mailto:gilgameshenterprisellc@gmail.com" className="text-[#1e7a4a] hover:underline">gilgameshenterprisellc@gmail.com</a>.
        </p>
      </div>

      <footer className="border-t border-gray-100 py-8 px-6 bg-white mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© 2026 RenewalMate — Gilgamesh Enterprise LLC</span>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link href="/cancel" className="hover:text-[#1e7a4a]">Cancel Directory</Link>
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
