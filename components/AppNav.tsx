'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const LINKS = [
  { href: '/dashboard', label: 'Bills & Subscriptions' },
  { href: '/budget', label: 'Budget' },
  { href: '/net-worth', label: 'Net Worth' },
  { href: '/goals', label: 'Goals' },
  { href: '/import', label: 'Import' },
  { href: '/settings', label: 'Settings' },
]

export default function AppNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
            <span className="text-white font-black text-sm">R</span>
          </div>
          <span className="font-black text-[#1a2e22] tracking-tight hidden sm:inline">RenewalMate</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${
                  active ? 'bg-[#1e7a4a]/10 text-[#1e7a4a]' : 'text-gray-500 hover:text-[#1e7a4a]'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden lg:inline">{userEmail}</span>
          <button onClick={handleLogout} className="text-xs font-bold text-gray-500 hover:text-[#1e7a4a] transition-colors hidden md:inline">
            Log out
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-[#1a2e22]"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-3 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                  active ? 'bg-[#1e7a4a]/10 text-[#1e7a4a]' : 'text-gray-500 hover:text-[#1e7a4a]'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  )
}
