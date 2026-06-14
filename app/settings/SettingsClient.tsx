'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppNav from '@/components/AppNav'
import { usePushNotifications } from '@/hooks/usePushNotifications'

export default function SettingsClient({
  userEmail,
  initialDigestEnabled,
}: {
  userEmail: string
  initialDigestEnabled: boolean
}) {
  const [digestEnabled, setDigestEnabled] = useState(initialDigestEnabled)
  const [savingDigest, setSavingDigest] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()
  const push = usePushNotifications()

  async function toggleDigest() {
    const next = !digestEnabled
    setDigestEnabled(next)
    setSavingDigest(true)
    try {
      await fetch('/api/account/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekly_digest_enabled: next }),
      })
    } finally {
      setSavingDigest(false)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/account/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `renewalmate-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setDeleteError(json.error || 'Something went wrong. Please try again.')
        setDeleting(false)
        return
      }
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch {
      setDeleteError('Something went wrong. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <AppNav userEmail={userEmail} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-black text-[#1a2e22] mb-1">Settings</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your account, notifications, and data.</p>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <h2 className="text-sm font-black text-[#1a2e22] mb-3">Account</h2>
          <div className="text-sm text-gray-600">{userEmail}</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <h2 className="text-sm font-black text-[#1a2e22] mb-3">Notifications</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-bold text-[#1a2e22]">Weekly digest email</div>
              <div className="text-xs text-gray-400">A weekly summary of your upcoming renewals and spend.</div>
            </div>
            <button
              onClick={toggleDigest}
              disabled={savingDigest}
              role="switch"
              aria-checked={digestEnabled}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${digestEnabled ? 'bg-[#1e7a4a]' : 'bg-gray-200'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${digestEnabled ? 'translate-x-5' : ''}`}
              />
            </button>
          </label>
        </div>

        {push.isSupported && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
            <h2 className="text-sm font-black text-[#1a2e22] mb-3">Push notifications</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-bold text-[#1a2e22]">Browser notifications</div>
                <div className="text-xs text-gray-400">
                  {push.permission === 'denied'
                    ? 'Notifications are blocked in your browser settings.'
                    : 'Get a reminder right on your device before things renew.'}
                </div>
              </div>
              <button
                onClick={() => (push.isSubscribed ? push.unsubscribe() : push.subscribe())}
                disabled={push.isLoading || push.permission === 'denied'}
                role="switch"
                aria-checked={push.isSubscribed}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-40 ${push.isSubscribed ? 'bg-[#1e7a4a]' : 'bg-gray-200'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${push.isSubscribed ? 'translate-x-5' : ''}`}
                />
              </button>
            </label>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <h2 className="text-sm font-black text-[#1a2e22] mb-1">Your data</h2>
          <p className="text-xs text-gray-400 mb-3">
            Download everything we have about you — subscriptions, budgets, net worth, goals, and history — as a JSON file. No restrictions, no waiting.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-[#1a2e22] hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {exporting ? 'Preparing export...' : 'Export my data (JSON)'}
          </button>
        </div>

        <div className="bg-white border border-red-100 rounded-2xl p-5">
          <h2 className="text-sm font-black text-red-600 mb-1">Delete account</h2>
          <p className="text-xs text-gray-400 mb-3">
            Permanently deletes your account and all associated data immediately. No request needed, no waiting period. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
          >
            Delete my account
          </button>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-lg font-black text-red-600 mb-2">Delete your account?</h2>
            <p className="text-sm text-gray-500 mb-4">
              This will immediately and permanently delete your account, subscriptions, budgets, net worth, goals, and all other data. This action cannot be undone.
            </p>
            <p className="text-xs font-bold text-gray-500 mb-2">
              Type <span className="text-red-600">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 mb-2"
              placeholder="DELETE"
            />
            {deleteError && <p className="text-xs text-red-500 font-bold mb-2">{deleteError}</p>}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setConfirmText('')
                  setDeleteError(null)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                {deleting ? 'Deleting...' : 'Permanently delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
