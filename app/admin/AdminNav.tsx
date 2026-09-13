'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0d0b0a]/95 backdrop-blur-md border-b border-[#2a241a]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d4a017] flex items-center justify-center">
            <span className="text-[#0d0b0a] font-black text-sm">R</span>
          </div>
          <span className="font-black text-[#f5efe4] tracking-tight">
            RenewalMate <span className="text-[#d4a017]">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8f8570] hidden sm:inline">{userEmail}</span>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-[#cfc6b4] hover:text-[#eac020] transition-colors"
          >
            Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-[#8f8570] hover:text-[#eac020] transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
