'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Subscription {
  id: string
  name: string
  amount: number
  billing_cycle: 'weekly' | 'monthly' | 'yearly'
  next_renewal_date: string
  category: string
  cancel_url: string | null
  notes: string | null
}

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  entertainment: { label: 'Entertainment', icon: '🎬' },
  utilities: { label: 'Utilities', icon: '⚡' },
  insurance: { label: 'Insurance', icon: '🛡️' },
  software: { label: 'Software', icon: '💻' },
  fitness: { label: 'Gym & Fitness', icon: '💪' },
  other: { label: 'Other', icon: '📦' },
}

const CYCLE_LABEL: Record<string, string> = {
  weekly: '/week',
  monthly: '/month',
  yearly: '/year',
}

function toMonthly(amount: number, cycle: string) {
  if (cycle === 'weekly') return amount * 4.33
  if (cycle === 'yearly') return amount / 12
  return amount
}

function daysUntil(dateStr: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const emptyForm: {
  name: string
  amount: string
  billing_cycle: 'weekly' | 'monthly' | 'yearly'
  next_renewal_date: string
  category: string
  cancel_url: string
  notes: string
} = {
  name: '',
  amount: '',
  billing_cycle: 'monthly',
  next_renewal_date: '',
  category: 'other',
  cancel_url: '',
  notes: '',
}

export default function DashboardClient({
  initialSubscriptions,
  userEmail,
}: {
  initialSubscriptions: Subscription[]
  userEmail: string
}) {
  const router = useRouter()
  const [subs, setSubs] = useState<Subscription[]>(initialSubscriptions)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const stats = useMemo(() => {
    const monthlyTotal = subs.reduce((sum, s) => sum + toMonthly(Number(s.amount), s.billing_cycle), 0)
    const upcoming = subs.filter((s) => {
      const d = daysUntil(s.next_renewal_date)
      return d >= 0 && d <= 7
    })
    const overdue = subs.filter((s) => daysUntil(s.next_renewal_date) < 0)
    return { monthlyTotal, yearlyTotal: monthlyTotal * 12, upcoming, overdue }
  }, [subs])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(s: Subscription) {
    setForm({
      name: s.name,
      amount: String(s.amount),
      billing_cycle: s.billing_cycle,
      next_renewal_date: s.next_renewal_date,
      category: s.category,
      cancel_url: s.cancel_url ?? '',
      notes: s.notes ?? '',
    })
    setEditingId(s.id)
    setError('')
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      amount: parseFloat(form.amount) || 0,
      billing_cycle: form.billing_cycle,
      next_renewal_date: form.next_renewal_date,
      category: form.category,
      cancel_url: form.cancel_url.trim() || null,
      notes: form.notes.trim() || null,
    }

    try {
      const res = await fetch(editingId ? `/api/subscriptions/${editingId}` : '/api/subscriptions', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')

      if (editingId) {
        setSubs((prev) => prev.map((s) => (s.id === editingId ? json.subscription : s)))
      } else {
        setSubs((prev) => [...prev, json.subscription].sort((a, b) => a.next_renewal_date.localeCompare(b.next_renewal_date)))
      }
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this subscription?')) return
    const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' })
    if (res.ok) setSubs((prev) => prev.filter((s) => s.id !== id))
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e7a4a] flex items-center justify-center">
              <span className="text-white font-black text-sm">R</span>
            </div>
            <span className="font-black text-[#1a2e22] tracking-tight">RenewalMate</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:inline">{userEmail}</span>
            <button onClick={handleLogout} className="text-xs font-bold text-gray-500 hover:text-[#1e7a4a] transition-colors">
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Monthly total</div>
            <div className="text-2xl font-black text-[#1a2e22]">${stats.monthlyTotal.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Yearly total</div>
            <div className="text-2xl font-black text-[#1a2e22]">${stats.yearlyTotal.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Due in next 7 days</div>
            <div className="text-2xl font-black text-[#1a2e22]">{stats.upcoming.length}</div>
          </div>
        </div>

        {stats.overdue.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6 text-sm text-amber-800 font-medium">
            {stats.overdue.length} subscription{stats.overdue.length > 1 ? 's' : ''} past its renewal date, update or remove below.
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-[#1a2e22]">Your subscriptions</h1>
          <button
            onClick={openAdd}
            className="px-5 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors"
          >
            + Add subscription
          </button>
        </div>

        {/* LIST */}
        {subs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <div className="text-3xl mb-3">🗂️</div>
            <p className="text-gray-500 text-sm mb-4">No subscriptions yet. Add your first one to start tracking.</p>
            <button
              onClick={openAdd}
              className="px-5 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors"
            >
              + Add subscription
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {subs.map((s) => {
              const cat = CATEGORIES[s.category] ?? CATEGORIES.other
              const days = daysUntil(s.next_renewal_date)
              let dueLabel = `in ${days} days`
              let dueColor = 'text-gray-400'
              if (days < 0) {
                dueLabel = `${Math.abs(days)} days overdue`
                dueColor = 'text-red-500'
              } else if (days === 0) {
                dueLabel = 'today'
                dueColor = 'text-amber-600'
              } else if (days <= 7) {
                dueColor = 'text-amber-600'
              }

              return (
                <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1e7a4a]/10 flex items-center justify-center text-lg shrink-0">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1a2e22] text-sm truncate">{s.name}</div>
                    <div className="text-xs text-gray-400">{cat.label} · Renews {dueLabel.startsWith('in') || dueLabel === 'today' ? <span className={dueColor}>{dueLabel}</span> : <span className={dueColor}>{dueLabel}</span>}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-[#1a2e22] text-sm">${Number(s.amount).toFixed(2)}</div>
                    <div className="text-xs text-gray-400">{CYCLE_LABEL[s.billing_cycle]}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.cancel_url && (
                      <a
                        href={s.cancel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-gray-400 hover:text-[#1e7a4a] transition-colors"
                      >
                        Cancel ↗
                      </a>
                    )}
                    <button onClick={() => openEdit(s)} className="text-xs font-bold text-gray-400 hover:text-[#1e7a4a] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ADD/EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-6 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-black text-[#1a2e22] mb-4">
              {editingId ? 'Edit subscription' : 'Add subscription'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  placeholder="Netflix, Gym, Car insurance..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Amount</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Billing cycle</label>
                  <select
                    value={form.billing_cycle}
                    onChange={(e) => setForm({ ...form, billing_cycle: e.target.value as typeof form.billing_cycle })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Next renewal</label>
                  <input
                    required
                    type="date"
                    value={form.next_renewal_date}
                    onChange={(e) => setForm({ ...form, next_renewal_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  >
                    {Object.entries(CATEGORIES).map(([key, c]) => (
                      <option key={key} value={key}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Cancel link (optional)</label>
                <input
                  type="url"
                  value={form.cancel_url}
                  onChange={(e) => setForm({ ...form, cancel_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  rows={2}
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add subscription'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-[#1a2e22] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
