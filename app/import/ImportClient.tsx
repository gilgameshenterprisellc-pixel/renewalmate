'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppNav from '@/components/AppNav'

interface Row {
  name: string
  amount: string
  billing_cycle: string
  next_renewal_date: string
  category: string
  item_type: string
  cancel_url: string
  notes: string
}

const TEMPLATE_HEADERS = ['name', 'amount', 'billing_cycle', 'next_renewal_date', 'category', 'item_type', 'cancel_url', 'notes']
const TEMPLATE_EXAMPLE = ['Netflix', '15.49', 'monthly', '2026-07-01', 'entertainment', 'subscription', 'https://netflix.com/cancel', '']

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        row.push(field)
        field = ''
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && next === '\n') i++
        row.push(field)
        rows.push(row)
        row = []
        field = ''
      } else {
        field += char
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

export default function ImportClient({ userEmail }: { userEmail: string }) {
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function downloadTemplate() {
    const csv = [TEMPLATE_HEADERS.join(','), TEMPLATE_EXAMPLE.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'renewalmate-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setResult(null)

    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      const parsed = parseCSV(text)
      if (parsed.length < 2) {
        setError('CSV must have a header row and at least one data row.')
        setRows([])
        return
      }

      const headers = parsed[0].map((h) => h.trim().toLowerCase())
      const nameIdx = headers.indexOf('name')
      const dateIdx = headers.indexOf('next_renewal_date')

      if (nameIdx === -1 || dateIdx === -1) {
        setError('CSV must include "name" and "next_renewal_date" columns.')
        setRows([])
        return
      }

      const dataRows: Row[] = parsed.slice(1).map((cols) => {
        const get = (key: string) => {
          const idx = headers.indexOf(key)
          return idx >= 0 ? (cols[idx] ?? '').trim() : ''
        }
        return {
          name: get('name'),
          amount: get('amount') || '0',
          billing_cycle: get('billing_cycle') || 'monthly',
          next_renewal_date: get('next_renewal_date'),
          category: get('category') || 'other',
          item_type: get('item_type') || 'subscription',
          cancel_url: get('cancel_url'),
          notes: get('notes'),
        }
      }).filter((r) => r.name && r.next_renewal_date)

      if (dataRows.length === 0) {
        setError('No valid rows found. Each row needs a name and next_renewal_date.')
        setRows([])
        return
      }

      setRows(dataRows)
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    setImporting(true)
    setError(null)
    try {
      const res = await fetch('/api/subscriptions/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: rows }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Import failed')
      } else {
        setResult({ imported: json.imported })
        setRows([])
        if (fileRef.current) fileRef.current.value = ''
      }
    } catch {
      setError('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <AppNav userEmail={userEmail} />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-black text-[#1a2e22] mb-1">Import</h1>
        <p className="text-sm text-gray-500 mb-6">
          Bulk-add subscriptions, bills, licenses, or one-time expenses from a CSV file.
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-black text-[#1a2e22] mb-2">1. Get the template</h2>
          <p className="text-xs text-gray-500 mb-3">
            Columns: <code className="bg-gray-100 px-1 py-0.5 rounded">name</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">amount</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">billing_cycle</code> (weekly/monthly/yearly/one_time), <code className="bg-gray-100 px-1 py-0.5 rounded">next_renewal_date</code> (YYYY-MM-DD), <code className="bg-gray-100 px-1 py-0.5 rounded">category</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">item_type</code> (subscription/bill/license/one_time), <code className="bg-gray-100 px-1 py-0.5 rounded">cancel_url</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">notes</code>.
            Only <strong>name</strong> and <strong>next_renewal_date</strong> are required.
          </p>
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-[#1a2e22] hover:bg-gray-50 transition-colors"
          >
            Download CSV template
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-black text-[#1a2e22] mb-2">2. Upload your CSV</h2>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="text-sm"
          />
          {error && <p className="text-xs text-red-500 font-bold mt-2">{error}</p>}
          {result && (
            <p className="text-xs text-[#1e7a4a] font-bold mt-2">
              ✓ Imported {result.imported} item{result.imported === 1 ? '' : 's'}.{' '}
              <button onClick={() => router.push('/dashboard')} className="underline">View dashboard</button>
            </p>
          )}
        </div>

        {rows.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="text-sm font-black text-[#1a2e22] mb-3">3. Preview ({rows.length} row{rows.length === 1 ? '' : 's'})</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Cycle</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((r, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 pr-4 font-bold text-[#1a2e22]">{r.name}</td>
                      <td className="py-2 pr-4">${r.amount}</td>
                      <td className="py-2 pr-4">{r.billing_cycle}</td>
                      <td className="py-2 pr-4">{r.next_renewal_date}</td>
                      <td className="py-2 pr-4">{r.category}</td>
                      <td className="py-2 pr-4">{r.item_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 20 && (
                <p className="text-xs text-gray-400 mt-2">...and {rows.length - 20} more row{rows.length - 20 === 1 ? '' : 's'}</p>
              )}
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-4 py-2 bg-[#1e7a4a] text-white text-sm font-bold rounded-lg hover:bg-[#166038] transition-colors disabled:opacity-60"
            >
              {importing ? 'Importing...' : `Import ${rows.length} item${rows.length === 1 ? '' : 's'}`}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
