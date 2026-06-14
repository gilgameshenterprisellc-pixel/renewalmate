'use client'
import { useState, useMemo } from 'react'
import AppNav from '@/components/AppNav'

interface NetWorthItem {
  id: string
  name: string
  item_type: 'asset' | 'debt'
  category: string
  value: number
  notes: string | null
}

const ASSET_CATEGORIES = ['cash', 'investments', 'retirement', 'real_estate', 'vehicle', 'other']
const DEBT_CATEGORIES = ['credit_card', 'student_loan', 'auto_loan', 'mortgage', 'personal_loan', 'other']

const CATEGORY_LABELS: Record<string, string> = {
  cash: 'Cash & Savings',
  investments: 'Investments',
  retirement: 'Retirement',
  real_estate: 'Real Estate',
  vehicle: 'Vehicle',
  credit_card: 'Credit Card',
  student_loan: 'Student Loan',
  auto_loan: 'Auto Loan',
  mortgage: 'Mortgage',
  personal_loan: 'Personal Loan',
  other: 'Other',
}

const emptyForm = {
  name: '',
  item_type: 'asset' as 'asset' | 'debt',
  category: 'cash',
  value: '',
  notes: '',
}

export default function NetWorthClient({
  initialItems,
  userEmail,
}: {
  initialItems: NetWorthItem[]
  userEmail: string
}) {
  const [items, setItems] = useState<NetWorthItem[]>(initialItems)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const assets = items.filter((i) => i.item_type === 'asset')
  const debts = items.filter((i) => i.item_type === 'debt')

  const totalAssets = useMemo(() => assets.reduce((sum, i) => sum + Number(i.value), 0), [assets])
  const totalDebts = useMemo(() => debts.reduce((sum, i) => sum + Number(i.value), 0), [debts])
  const netWorth = totalAssets - totalDebts

  function openAdd(type: 'asset' | 'debt') {
    setForm({ ...emptyForm, item_type: type, category: type === 'asset' ? 'cash' : 'credit_card' })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.value) return
    setSaving(true)
    try {
      const res = await fetch('/api/net-worth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          item_type: form.item_type,
          category: form.category,
          value: parseFloat(form.value),
          notes: form.notes || null,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setItems((prev) => [json.item, ...prev])
        setShowModal(false)
        setForm(emptyForm)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    await fetch(`/api/net-worth/${id}`, { method: 'DELETE' })
  }

  const categoriesFor = form.item_type === 'asset' ? ASSET_CATEGORIES : DEBT_CATEGORIES

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <AppNav userEmail={userEmail} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-xl font-black text-[#1a2e22] mb-1">Net Worth</h1>
        <p className="text-sm text-gray-500 mb-6">Track everything you own and owe in one place.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Total assets</div>
            <div className="text-2xl font-black text-[#1e7a4a]">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Total debts</div>
            <div className="text-2xl font-black text-red-500">${totalDebts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-gray-400 mb-1">Net worth</div>
            <div className={`text-2xl font-black ${netWorth >= 0 ? 'text-[#1a2e22]' : 'text-red-500'}`}>
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <Section title="Assets" items={assets} onAdd={() => openAdd('asset')} onDelete={handleDelete} positive />
        <Section title="Debts" items={debts} onAdd={() => openAdd('debt')} onDelete={handleDelete} positive={false} />
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-lg font-black text-[#1a2e22] mb-4">
              Add {form.item_type === 'asset' ? 'asset' : 'debt'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                <select
                  value={form.item_type}
                  onChange={(e) => {
                    const item_type = e.target.value as 'asset' | 'debt'
                    setForm((prev) => ({ ...prev, item_type, category: item_type === 'asset' ? 'cash' : 'credit_card' }))
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                >
                  <option value="asset">Asset</option>
                  <option value="debt">Debt</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={form.item_type === 'asset' ? 'e.g. Checking account' : 'e.g. Visa credit card'}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                >
                  {categoriesFor.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Value ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.value}
                  onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e7a4a]/30 focus:border-[#1e7a4a]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#1e7a4a] text-white text-sm font-bold hover:bg-[#166038] transition-colors disabled:opacity-60"
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

function Section({
  title,
  items,
  onAdd,
  onDelete,
  positive,
}: {
  title: string
  items: NetWorthItem[]
  onAdd: () => void
  onDelete: (id: string) => void
  positive: boolean
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-[#1a2e22]">{title}</h2>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-[#1e7a4a] text-white text-xs font-bold rounded-lg hover:bg-[#166038] transition-colors"
        >
          + Add {title === 'Assets' ? 'asset' : 'debt'}
        </button>
      </div>
      {items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-sm text-gray-400">
          No {title.toLowerCase()} added yet.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-[#1a2e22] text-sm">{item.name}</div>
                <div className="text-xs text-gray-400">{CATEGORY_LABELS[item.category] ?? item.category}{item.notes ? ` · ${item.notes}` : ''}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`font-black text-sm ${positive ? 'text-[#1e7a4a]' : 'text-red-500'}`}>
                  ${Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <button onClick={() => onDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors text-sm">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
