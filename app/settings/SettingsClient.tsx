'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppNavDark from '@/components/AppNavDark'
import { fontVariables, displayFont as display } from '@/lib/fonts'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { usePlaidLink } from 'react-plaid-link'

export default function SettingsClient({
  userEmail,
  initialDigestEnabled,
  plan,
  plaidEnabled,
}: {
  userEmail: string
  initialDigestEnabled: boolean
  plan: 'free' | 'plus' | 'family'
  plaidEnabled: boolean
}) {
  const [digestEnabled, setDigestEnabled] = useState(initialDigestEnabled)
  const [savingDigest, setSavingDigest] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)
  const [billingError, setBillingError] = useState<string | null>(null)
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null)
  const [plaidLoading, setPlaidLoading] = useState(false)
  const [plaidError, setPlaidError] = useState<string | null>(null)
  const [bankConnected, setBankConnected] = useState(plaidEnabled)
  const [syncResult, setSyncResult] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const upgradedParam = searchParams.get('upgraded')
  const justUpgraded = upgradedParam === '1' || upgradedParam === 'plus' || upgradedParam === 'family'
  const justUpgradedTier = upgradedParam === 'family' ? 'Family' : 'Plus'
  const push = usePushNotifications()

  const onPlaidSuccess = useCallback(async (publicToken: string) => {
    setPlaidLoading(true)
    setPlaidError(null)
    try {
      const res = await fetch('/api/plaid/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken }),
      })
      const json = await res.json()
      if (!res.ok) {
        setPlaidError(json.error || 'Something went wrong connecting your bank.')
        return
      }
      setBankConnected(true)
      setPlaidLinkToken(null)
    } catch {
      setPlaidError('Something went wrong connecting your bank.')
    } finally {
      setPlaidLoading(false)
    }
  }, [])

  const { open: openPlaidLink, ready: plaidReady } = usePlaidLink({
    token: plaidLinkToken ?? '',
    onSuccess: onPlaidSuccess,
  })

  useEffect(() => {
    if (plaidLinkToken && plaidReady) {
      openPlaidLink()
      setPlaidLoading(false)
    }
  }, [plaidLinkToken, plaidReady, openPlaidLink])

  async function handleConnectBank() {
    setPlaidLoading(true)
    setPlaidError(null)
    try {
      const res = await fetch('/api/plaid/link-token', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setPlaidError(json.error || 'Something went wrong. Please try again.')
        setPlaidLoading(false)
        return
      }
      setPlaidLinkToken(json.link_token)
    } catch {
      setPlaidError('Something went wrong. Please try again.')
      setPlaidLoading(false)
    }
  }

  async function handleSyncBank() {
    setPlaidLoading(true)
    setPlaidError(null)
    setSyncResult(null)
    try {
      const res = await fetch('/api/plaid/sync', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setPlaidError(json.error || 'Something went wrong. Please try again.')
        return
      }
      setSyncResult(`Synced — ${json.created} new, ${json.updated} updated.`)
      router.refresh()
    } catch {
      setPlaidError('Something went wrong. Please try again.')
    } finally {
      setPlaidLoading(false)
    }
  }

  async function handleDisconnectBank() {
    setPlaidLoading(true)
    setPlaidError(null)
    try {
      const res = await fetch('/api/plaid/disconnect', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setPlaidError(json.error || 'Something went wrong. Please try again.')
        return
      }
      setBankConnected(false)
      setSyncResult(null)
    } catch {
      setPlaidError('Something went wrong. Please try again.')
    } finally {
      setPlaidLoading(false)
    }
  }

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

  async function handleBilling(tier: 'plus' | 'family' = 'plus') {
    setBillingLoading(true)
    setBillingError(null)
    try {
      const isPaid = plan === 'plus' || plan === 'family'
      const endpoint = isPaid ? '/api/stripe/portal' : '/api/stripe/checkout'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isPaid ? undefined : JSON.stringify({ tier }),
      })
      const json = await res.json()
      if (!res.ok) {
        setBillingError(json.error || 'Something went wrong. Please try again.')
        setBillingLoading(false)
        return
      }
      window.location.href = json.url
    } catch {
      setBillingError('Something went wrong. Please try again.')
      setBillingLoading(false)
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
    <div className={`${fontVariables} min-h-screen bg-void text-ink-body font-[family-name:var(--font-body)] antialiased`}>
      <AppNavDark userEmail={userEmail} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className={`${display} font-semibold text-xl text-ink-high mb-1`}>Settings</h1>
        <p className="text-sm text-ink-muted mb-6">Manage your account, notifications, and data.</p>

        <div className="bg-panel border border-edge rounded-2xl p-5 mb-4">
          <h2 className={`${display} font-semibold text-sm text-ink-high mb-3`}>Account</h2>
          <div className="text-sm text-ink-body">{userEmail}</div>
        </div>

        <div className="bg-panel border border-edge rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className={`${display} font-semibold text-sm text-ink-high`}>
              RenewalMate {plan === 'family' ? 'Family' : 'Plus'}
            </h2>
            {(plan === 'plus' || plan === 'family') && (
              <span className="text-xs font-bold text-jade-bright bg-jade/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          {justUpgraded && (
            <p className="text-xs font-bold text-jade-bright mb-2">
              You&apos;re on RenewalMate {justUpgradedTier}. Thanks for the support!
            </p>
          )}
          <p className="text-xs text-ink-muted mb-3">
            {plan === 'family'
              ? 'You have access to bank sync, AI insights, and shared household tracking. Manage your subscription or update payment details below.'
              : plan === 'plus'
              ? 'You have access to bank sync and AI insights. Manage your subscription or update payment details below.'
              : 'Connect your bank for automatic subscription tracking and unlock AI-powered spending insights — or go Family to share bills with your household.'}
          </p>
          {billingError && <p className="text-xs text-rm-red-bright font-bold mb-2">{billingError}</p>}
          {plan === 'free' ? (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBilling('plus')}
                disabled={billingLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] disabled:opacity-60"
              >
                {billingLoading ? 'Loading...' : 'Upgrade to Plus — $10/mo'}
              </button>
              <button
                onClick={() => handleBilling('family')}
                disabled={billingLoading}
                className="px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-ink-high hover:border-violet/50 transition-colors disabled:opacity-60"
              >
                {billingLoading ? 'Loading...' : 'Upgrade to Family — $25/mo'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleBilling()}
              disabled={billingLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-[#A472F0] text-white text-sm font-bold shadow-[0_8px_24px_-8px_rgba(139,92,246,0.55)] disabled:opacity-60"
            >
              {billingLoading ? 'Loading...' : 'Manage billing'}
            </button>
          )}

          {(plan === 'plus' || plan === 'family') && (
            <div className="mt-4 pt-4 border-t border-edge">
              <div className="text-sm font-bold text-ink-high mb-1">Bank sync</div>
              <p className="text-xs text-ink-muted mb-3">
                {bankConnected
                  ? 'Your bank is connected. Sync to detect recurring charges automatically.'
                  : 'Connect a bank account so RenewalMate can detect recurring subscriptions for you. Optional — manual tracking always works too.'}
              </p>
              {plaidError && <p className="text-xs text-rm-red-bright font-bold mb-2">{plaidError}</p>}
              {syncResult && <p className="text-xs text-jade-bright font-bold mb-2">{syncResult}</p>}
              <div className="flex gap-2 flex-wrap">
                {!bankConnected ? (
                  <button
                    onClick={handleConnectBank}
                    disabled={plaidLoading}
                    className="px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-ink-high hover:border-violet/50 transition-colors disabled:opacity-60"
                  >
                    {plaidLoading ? 'Loading...' : 'Connect bank account'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSyncBank}
                      disabled={plaidLoading}
                      className="px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-ink-high hover:border-violet/50 transition-colors disabled:opacity-60"
                    >
                      {plaidLoading ? 'Syncing...' : 'Sync now'}
                    </button>
                    <button
                      onClick={handleDisconnectBank}
                      disabled={plaidLoading}
                      className="px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-rm-red-bright hover:bg-rm-red/10 transition-colors disabled:opacity-60"
                    >
                      Disconnect bank
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-panel border border-edge rounded-2xl p-5 mb-4">
          <h2 className={`${display} font-semibold text-sm text-ink-high mb-3`}>Notifications</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-bold text-ink-high">Weekly digest email</div>
              <div className="text-xs text-ink-muted">A weekly summary of your upcoming renewals and spend.</div>
            </div>
            <button
              onClick={toggleDigest}
              disabled={savingDigest}
              role="switch"
              aria-checked={digestEnabled}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${digestEnabled ? 'bg-violet' : 'bg-edge-lit'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${digestEnabled ? 'translate-x-5' : ''}`}
              />
            </button>
          </label>
        </div>

        {push.isSupported && (
          <div className="bg-panel border border-edge rounded-2xl p-5 mb-4">
            <h2 className={`${display} font-semibold text-sm text-ink-high mb-3`}>Push notifications</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-bold text-ink-high">Browser notifications</div>
                <div className="text-xs text-ink-muted">
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
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-40 ${push.isSubscribed ? 'bg-violet' : 'bg-edge-lit'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${push.isSubscribed ? 'translate-x-5' : ''}`}
                />
              </button>
            </label>
          </div>
        )}

        <div className="bg-panel border border-edge rounded-2xl p-5 mb-4">
          <h2 className={`${display} font-semibold text-sm text-ink-high mb-1`}>Your data</h2>
          <p className="text-xs text-ink-muted mb-3">
            Download everything we have about you — subscriptions, budgets, net worth, goals, and history — as a JSON file. No restrictions, no waiting.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-ink-high hover:border-violet/50 transition-colors disabled:opacity-60"
          >
            {exporting ? 'Preparing export...' : 'Export my data (JSON)'}
          </button>
        </div>

        <div className="bg-panel border border-rm-red/25 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-rm-red-bright mb-1">Delete account</h2>
          <p className="text-xs text-ink-muted mb-3">
            Permanently deletes your account and all associated data immediately. No request needed, no waiting period. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-lg bg-rm-red text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Delete my account
          </button>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-panel border border-edge rounded-2xl p-6 max-w-md w-full">
            <h2 className={`${display} font-semibold text-lg text-rm-red-bright mb-2`}>Delete your account?</h2>
            <p className="text-sm text-ink-muted mb-4">
              This will immediately and permanently delete your account, subscriptions, budgets, net worth, goals, and all other data. This action cannot be undone.
            </p>
            <p className="text-xs font-bold text-ink-muted mb-2">
              Type <span className="text-rm-red-bright">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-void border border-rm-red/30 text-ink-high text-sm focus:outline-none focus:ring-2 focus:ring-rm-red/40 focus:border-rm-red mb-2"
              placeholder="DELETE"
            />
            {deleteError && <p className="text-xs text-rm-red-bright font-bold mb-2">{deleteError}</p>}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setConfirmText('')
                  setDeleteError(null)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-edge-lit text-sm font-bold text-ink-muted hover:text-ink-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-rm-red text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
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
