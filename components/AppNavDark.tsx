'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { displayFont as display } from '@/lib/fonts'

const LINKS = [
  { href: '/dashboard', label: 'Bills & Subscriptions' },
  { href: '/budget', label: 'Budget' },
  { href: '/net-worth', label: 'Net Worth' },
  { href: '/goals', label: 'Goals' },
  { href: '/import', label: 'Import' },
  { href: '/settings', label: 'Settings' },
]

export default function AppNavDark({ userEmail }: { userEmail: string }) {
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
    <nav className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-edge">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-rm-amber flex items-center justify-center">
            <span className={`${display} font-semibold text-void text-sm`}>R</span>
          </div>
          <span className={`${display} font-semibold text-ink-high hidden sm:inline`}>RenewalMate</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${
                  active ? 'bg-violet/15 text-violet-bright' : 'text-ink-muted hover:text-violet-bright'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-faint hidden lg:inline">{userEmail}</span>
          <button onClick={handleLogout} className="text-xs font-bold text-ink-muted hover:text-violet-bright transition-colors hidden md:inline">
            Log out
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-edge-lit text-ink-high"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-edge px-6 py-3 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                  active ? 'bg-violet/15 text-violet-bright' : 'text-ink-muted hover:text-violet-bright'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-ink-muted hover:text-rm-red-bright transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  )
}
