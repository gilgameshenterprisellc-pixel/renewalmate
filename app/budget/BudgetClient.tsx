'use client'
import { useState, useMemo } from 'react'
import AppNav from '@/components/AppNav'

interface SubRow {
  amount: number
  billing_cycle: 'weekly' | 'monthly' | 'yearly' | 'one_time'
  category: string
}

interface Budget {
  id: string
  category: string
  monthly_cap: number
}

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  entertainment: { label: 'Entertainment', icon: '🎬' },
  utilities: { label: 'Utilities', icon: '⚡' },
  insurance: { label: 'Insurance', icon: '🛡️' },
  software: { label: 'Software', icon: '💻' },
  fitness: { label: 'Gym & Fitness', icon: '💪' },
  other: { label: 'Other', icon: '📦' },
}

function toMonthly(amount: number, cycle: string) {
  if (cycle === 'weekly') return amount * 4.33
  if (cycle === 'yearly') return amount / 12
  if (cycle === 'one_time') return 0
  return amount
}

export default function BudgetClient({
  initialSubscriptions,
  initialBudgets,
  userEmail,
}: {
  initialSubscriptions: SubRow[]
  initialBudgets: Budget[]
  userEmail: string
}) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const spendByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const s of initialSubscriptions) {
      const monthly = toMonthly(Number(s.amount), s.billing_cycle)
      map[s.category] = (map[s.category] ?? 0) + monthly
    }
    return map
  }, [initialSubscriptions])

  const totalSpend = Object.values(spendByCategory).reduce((a, b) => a + b, 0)
  const totalCap = budgets.reduce((sum, b) => sum + Number(b.monthly_cap), 0)

  function capFor(category: string) {
    const b = budgets.find((b) => b.category === category)
    return b ? Number(b.monthly_cap) : 0
  }

  async function saveCap(category: string) {
    const raw = editValues[category]
    if (raw === undefined) return
    const monthly_cap = parseFloat(raw) || 0
    setSaving(category)
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, monthly_cap }),
      })
      const json = await res.json()
      if (res.ok) {
        setBudgets((prev) => {
          const exists = prev.find((b) => b.category === category)
          if (exists) return prev.map((b) => (b.category === category ? json.budget : b))
          return [...prev, json.budget]
        })
        setEditValues((prev) => {
          const next = { ...prev }
          delete next[category]
          return next
        })
      }
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <AppNav userEmail={userEmail} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-xl font-black text-[#1a2e22] mb-1">Budget</h1>
        <p className="text-sm text-gray-500 mb-6">Set a monthly cap per category and see how your recurring spend stacks up.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Total monthly spend</div>
            <div className="text-2xl font-black text-[#1a2e22]">${totalSpend.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Total monthly budget</div>
            <div className="text-2xl font-black text-[#1a2e22]">${totalCap.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const spend = spendByCategory[key] ?? 0
            const cap = capFor(key)
            const pct = cap > 0 ? Math.min(100, (spend / cap) * 100) : 0
            const over = cap > 0 && spend > cap
            const editing = editValues[key] !== undefined

            return (
              <div key={key} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1e7a4a]/10 flex items-center justify-center text-lg shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <div className="font-bold text-[#1a2e22] text-sm">{cat.label}</div>
                      <div className="text-xs text-gray-400">${spend.toFixed(2)} / mo spend</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editing ? (
                      <>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          autoFocus
                          value={editValues[key]}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                          placeholder="0.00"
                        />
                        <button
                          onClick={() => saveCap(key)}
                          disabled={saving === key}
                          className="px-3 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-lg hover:bg-[#166038] transition-colors disabled:opacity-60"
                        >
                          {saving === key ? '...' : 'Save'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditValues((prev) => ({ ...prev, [key]: String(cap || '') }))}
                        className="text-xs font-bold text-gray-400 hover:text-[#1e7a4a] transition-colors"
                      >
                        {cap > 0 ? `Cap: $${cap.toFixed(2)}` : 'Set cap'}
                      </button>
                    )}
                  </div>
                </div>
                {cap > 0 && (
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-[#1e7a4a]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
                {over && <div className="text-xs text-red-500 font-bold mt-1">Over budget by ${(spend - cap).toFixed(2)}/mo</div>}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
