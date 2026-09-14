'use client'
import { useState } from 'react'
import AppNavDark from '@/components/AppNavDark'
import { fontVariables, displayFont as display } from '@/lib/fonts'

interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string | null
}

const emptyForm = {
  name: '',
  target_amount: '',
  current_amount: '',
  target_date: '',
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-void border border-edge-lit text-ink-high placeholder-ink-faint text-sm focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet'
const labelCls = 'block text-xs font-bold text-ink-muted mb-1'

export default function GoalsClient({
  initialGoals,
  userEmail,
}: {
  initialGoals: Goal[]
  userEmail: string
}) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [editingProgress, setEditingProgress] = useState<string | null>(null)
  const [progressValue, setProgressValue] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.target_amount) return
    setSaving(true)
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          target_amount: parseFloat(form.target_amount),
          current_amount: form.current_amount ? parseFloat(form.current_amount) : 0,
          target_date: form.target_date || null,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setGoals((prev) => [json.goal, ...prev])
        setShowModal(false)
        setForm(emptyForm)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    await fetch(`/api/goals/${id}`, { method: 'DELETE' })
  }

  async function saveProgress(id: string) {
    const current_amount = parseFloat(progressValue) || 0
    const res = await fetch(`/api/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_amount }),
    })
    const json = await res.json()
    if (res.ok) {
      setGoals((prev) => prev.map((g) => (g.id === id ? json.goal : g)))
    }
    setEditingProgress(null)
  }

  return (
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased`}>
      <AppNavDark userEmail={userEmail} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-1">
          <h1 className={`${display} font-semibold text-xl text-ink-high`}>Goals</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold rounded-lg shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)]"
          >
            + Add goal
          </button>
        </div>
        <p className="text-sm text-ink-muted mb-6">Set savings or payoff targets and track your progress.</p>

        {goals.length === 0 ? (
          <div className="bg-panel border border-edge rounded-2xl p-10 text-center text-sm text-ink-muted">
            No goals yet. Add one to start tracking progress toward something that matters.
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const target = Number(goal.target_amount)
              const current = Number(goal.current_amount)
              const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0
              const done = current >= target

              return (
                <div key={goal.id} className="bg-panel border border-edge rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-ink-high text-sm">{goal.name}</div>
                      {goal.target_date && (
                        <div className="text-xs text-ink-muted">
                          Target date: {new Date(goal.target_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDelete(goal.id)} className="text-ink-faint hover:text-rm-red-bright transition-colors text-sm">
                      ✕
                    </button>
                  </div>

                  <div className="w-full h-2 rounded-full bg-edge overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${done ? 'bg-jade' : 'bg-violet'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="text-ink-muted">
                      ${current.toLocaleString(undefined, { minimumFractionDigits: 2 })} of ${target.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      {' '}({pct.toFixed(0)}%){done && ' 🎉'}
                    </div>
                    {editingProgress === goal.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          autoFocus
                          value={progressValue}
                          onChange={(e) => setProgressValue(e.target.value)}
                          className="w-24 px-2 py-1 rounded-lg bg-void border border-edge-lit text-ink-high text-xs focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
                        />
                        <button
                          onClick={() => saveProgress(goal.id)}
                          className="px-2 py-1 bg-gradient-to-r from-violet to-[#A472F0] text-white text-xs font-bold rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingProgress(goal.id)
                          setProgressValue(String(current))
                        }}
                        className="font-bold text-ink-muted hover:text-violet-bright transition-colors"
                      >
                        Update progress
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto py-10">
          <div className="bg-panel border border-edge rounded-2xl p-6 max-w-md w-full">
            <h2 className={`${display} font-semibold text-lg text-ink-high mb-4`}>Add goal</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelCls}>Goal name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Emergency fund"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Target amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.target_amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, target_amount: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Current amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.current_amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, current_amount: e.target.value }))}
                  placeholder="0.00"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Target date (optional)</label>
                <input
                  type="date"
                  value={form.target_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, target_date: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-ink-muted hover:text-ink-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
