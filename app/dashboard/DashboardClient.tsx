'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import AppNav from '@/components/AppNav'

interface Subscription {
  id: string
  name: string
  amount: number
  billing_cycle: 'weekly' | 'monthly' | 'yearly' | 'one_time'
  next_renewal_date: string
  category: string
  cancel_url: string | null
  notes: string | null
  item_type: 'subscription' | 'bill' | 'license' | 'one_time'
  is_trial: boolean
  trial_ends_at: string | null
}

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  entertainment: { label: 'Entertainment', icon: '🎬' },
  utilities: { label: 'Utilities', icon: '⚡' },
  insurance: { label: 'Insurance', icon: '🛡️' },
  software: { label: 'Software', icon: '💻' },
  fitness: { label: 'Gym & Fitness', icon: '💪' },
  other: { label: 'Other', icon: '📦' },
}

const ITEM_TYPES: Record<string, { label: string; icon: string }> = {
  subscription: { label: 'Subscription', icon: '🔁' },
  bill: { label: 'Bill', icon: '🧾' },
  license: { label: 'License / Renewal', icon: '📄' },
  one_time: { label: 'One-time expense', icon: '🏷️' },
}

const CYCLE_LABEL: Record<string, string> = {
  weekly: '/week',
  monthly: '/month',
  yearly: '/year',
  one_time: 'one-time',
}

function toMonthly(amount: number, cycle: string) {
  if (cycle === 'weekly') return amount * 4.33
  if (cycle === 'yearly') return amount / 12
  if (cycle === 'one_time') return 0
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
  billing_cycle: 'weekly' | 'monthly' | 'yearly' | 'one_time'
  next_renewal_date: string
  category: string
  cancel_url: string
  notes: string
  item_type: 'subscription' | 'bill' | 'license' | 'one_time'
  is_trial: boolean
  trial_ends_at: string
} = {
  name: '',
  amount: '',
  billing_cycle: 'monthly',
  next_renewal_date: '',
  category: 'other',
  cancel_url: '',
  notes: '',
  item_type: 'subscription',
  is_trial: false,
  trial_ends_at: '',
}

export default function DashboardClient({
  initialSubscriptions,
  userEmail,
  plan,
}: {
  initialSubscriptions: Subscription[]
  userEmail: string
  plan: 'free' | 'plus'
}) {
  const [subs, setSubs] = useState<Subscription[]>(initialSubscriptions)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'subscription' | 'bill' | 'license' | 'one_time'>('all')
  const [insight, setInsight] = useState<{ content: string; generated_at: string } | null>(null)
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightError, setInsightError] = useState<string | null>(null)

  useEffect(() => {
    if (plan !== 'plus') return
    fetch('/api/insights')
      .then((res) => res.json())
      .then((json) => setInsight(json.insight ?? null))
      .catch(() => {})
  }, [plan])

  async function handleGenerateInsights() {
    setInsightLoading(true)
    setInsightError(null)
    try {
      const res = await fetch('/api/insights', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setInsightError(json.error || 'Something went wrong. Please try again.')
        return
      }
      setInsight(json.insight)
    } catch {
      setInsightError('Something went wrong. Please try again.')
    } finally {
      setInsightLoading(false)
    }
  }

  const stats = useMemo(() => {
    const recurring = subs.filter((s) => s.billing_cycle !== 'one_time')
    const monthlyTotal = recurring.reduce((sum, s) => sum + toMonthly(Number(s.amount), s.billing_cycle), 0)
    const upcoming = subs.filter((s) => {
      const d = daysUntil(s.next_renewal_date)
      return d >= 0 && d <= 7
    })
    const overdue = subs.filter((s) => daysUntil(s.next_renewal_date) < 0)
    const trialsEndingSoon = subs.filter((s) => {
      if (!s.is_trial || !s.trial_ends_at) return false
      const d = daysUntil(s.trial_ends_at)
      return d >= 0 && d <= 2
    })
    return { monthlyTotal, yearlyTotal: monthlyTotal * 12, upcoming, overdue, trialsEndingSoon }
  }, [subs])

  const visibleSubs = useMemo(() => {
    if (filter === 'all') return subs
    return subs.filter((s) => s.item_type === filter)
  }, [subs, filter])

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
      item_type: s.item_type ?? 'subscription',
      is_trial: s.is_trial ?? false,
      trial_ends_at: s.trial_ends_at ?? '',
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
      item_type: form.item_type,
      is_trial: form.is_trial,
      trial_ends_at: form.is_trial ? (form.trial_ends_at || null) : null,
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
    if (!confirm('Remove this item?')) return
    const res = await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' })
    if (res.ok) setSubs((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <AppNav userEmail={userEmail} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Monthly total (recurring)</div>
            <div className="text-2xl font-black text-[#1a2e22]">${stats.monthlyTotal.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Yearly total (recurring)</div>
            <div className="text-2xl font-black text-[#1a2e22]">${stats.yearlyTotal.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Due in next 7 days</div>
            <div className="text-2xl font-black text-[#1a2e22]">{stats.upcoming.length}</div>
          </div>
        </div>

        {stats.overdue.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-3 text-sm text-amber-800 font-medium">
            {stats.overdue.length} item{stats.overdue.length > 1 ? 's' : ''} past its due date, update or remove below.
          </div>
        )}

        {stats.trialsEndingSoon.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 mb-6 text-sm text-orange-800 font-medium">
            ⏰ {stats.trialsEndingSoon.map((s) => s.name).join(', ')} — free trial ending within 2 days. Cancel now if you don&apos;t want to be charged.
          </div>
        )}

        {/* AI INSIGHTS */}
        {plan === 'plus' ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-black text-[#1a2e22]">AI Insights</h2>
              <button
                onClick={handleGenerateInsights}
                disabled={insightLoading}
                className="px-3 py-1.5 rounded-lg bg-[#1e7a4a] text-white text-xs font-bold hover:bg-[#166038] transition-colors disabled:opacity-60"
              >
                {insightLoading ? 'Thinking...' : insight ? 'Refresh insights' : 'Generate insights'}
              </button>
            </div>
            {insightError && <p className="text-xs text-red-500 font-bold mt-2">{insightError}</p>}
            {insight ? (
              <>
                <p className="text-sm text-gray-600 whitespace-pre-line mt-2">{insight.content}</p>
                <p className="text-xs text-gray-400 mt-3">
                  Generated {new Date(insight.generated_at).toLocaleString()}
                </p>
              </>
            ) : (
              !insightError && (
                <p className="text-xs text-gray-400 mt-2">
                  Get AI-powered tips on where you might be overspending or what to cancel.
                </p>
              )
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-black text-[#1a2e22] mb-1">AI Insights</h2>
            <p className="text-xs text-gray-400 mb-3">
              Get AI-powered tips on what to cancel, what&apos;s overlapping, and where you could save. Available on RenewalMate Plus.
            </p>
            <Link
              href="/settings"
              className="inline-block px-4 py-2 rounded-lg bg-[#1e7a4a] text-white text-sm font-bold hover:bg-[#166038] transition-colors"
            >
              Upgrade to Plus
            </Link>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-black text-[#1a2e22]">Bills & subscriptions</h1>
          <button
            onClick={openAdd}
            className="px-5 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors"
          >
            + Add item
          </button>
        </div>

        {/* FILTER TABS */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          {(['all', 'subscription', 'bill', 'license', 'one_time'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-[#1e7a4a] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:text-[#1e7a4a]'
              }`}
            >
              {f === 'all' ? 'All' : ITEM_TYPES[f].icon + ' ' + ITEM_TYPES[f].label}
            </button>
          ))}
        </div>

        {/* LIST */}
        {visibleSubs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <div className="text-3xl mb-3">🗂️</div>
            <p className="text-gray-500 text-sm mb-4">Nothing here yet. Add a subscription, bill, license, or one-time expense to start tracking.</p>
            <button
              onClick={openAdd}
              className="px-5 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-full hover:bg-[#166038] transition-colors"
            >
              + Add item
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleSubs.map((s) => {
              const cat = CATEGORIES[s.category] ?? CATEGORIES.other
              const itemType = ITEM_TYPES[s.item_type] ?? ITEM_TYPES.subscription
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
              const dueWord = s.billing_cycle === 'one_time' ? 'Due' : 'Renews'

              return (
                <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1e7a4a]/10 flex items-center justify-center text-lg shrink-0">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1a2e22] text-sm truncate flex items-center gap-2">
                      {s.name}
                      {s.is_trial && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Trial</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {itemType.icon} {itemType.label} · {cat.label} · {dueWord} <span className={dueColor}>{dueLabel}</span>
                    </div>
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-6 z-50 overflow-y-auto py-10" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-black text-[#1a2e22] mb-4">
              {editingId ? 'Edit item' : 'Add item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Type</label>
                <select
                  value={form.item_type}
                  onChange={(e) => setForm({ ...form, item_type: e.target.value as typeof form.item_type })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                >
                  {Object.entries(ITEM_TYPES).map(([key, t]) => (
                    <option key={key} value={key}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                  placeholder="Netflix, Gym, Car insurance, Driver's license..."
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
                    <option value="one_time">One-time</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{form.billing_cycle === 'one_time' ? 'Due date' : 'Next renewal'}</label>
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

              {form.item_type === 'subscription' && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                  <input
                    type="checkbox"
                    id="is_trial"
                    checked={form.is_trial}
                    onChange={(e) => setForm({ ...form, is_trial: e.target.checked })}
                    className="w-4 h-4 accent-[#1e7a4a]"
                  />
                  <label htmlFor="is_trial" className="text-xs font-bold text-orange-800 flex-1">This is a free trial</label>
                  {form.is_trial && (
                    <input
                      type="date"
                      value={form.trial_ends_at}
                      onChange={(e) => setForm({ ...form, trial_ends_at: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-orange-200 text-xs focus:outline-none"
                    />
                  )}
                </div>
              )}

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
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add item'}
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
