import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import AdminNav from './AdminNav'

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin')

  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0 || !adminEmails.includes((user.email ?? '').toLowerCase())) {
    redirect('/dashboard')
  }

  const admin = createAdminClient()
  const errors: string[] = []

  const { data: usersPage, error: usersError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (usersError) errors.push(`Listing users: ${usersError.message}`)

  const realUsers = (usersPage?.users ?? []).filter(
    (u) => !adminEmails.includes((u.email ?? '').toLowerCase())
  )
  const userIds = realUsers.map((u) => u.id)
  const hasUsers = userIds.length > 0

  const { data: settingsRows, error: settingsError } = await admin
    .from('user_settings')
    .select('user_id, plan, stripe_customer_id, plaid_enabled, created_at')
  if (settingsError) errors.push(`Loading user_settings: ${settingsError.message}`)

  const settingsByUser = new Map(
    (settingsRows ?? []).map((row) => [row.user_id as string, row])
  )

  let subscriptionsCount = 0
  let subscriptionTypeCounts: Record<string, number> = {}
  let goalsCount = 0
  let netWorthCount = 0
  let budgetCount = 0
  let plaidConnectedUsers = 0
  let insightsCount = 0

  if (hasUsers) {
    const [
      subsCountRes,
      subsTypeRes,
      goalsRes,
      netWorthRes,
      budgetRes,
      plaidRes,
      insightsRes,
    ] = await Promise.all([
      admin.from('subscriptions').select('*', { count: 'exact', head: true }).in('user_id', userIds),
      admin.from('subscriptions').select('item_type').in('user_id', userIds),
      admin.from('goals').select('*', { count: 'exact', head: true }).in('user_id', userIds),
      admin.from('net_worth_items').select('*', { count: 'exact', head: true }).in('user_id', userIds),
      admin.from('budget_categories').select('*', { count: 'exact', head: true }).in('user_id', userIds),
      admin.from('plaid_items').select('user_id').in('user_id', userIds),
      admin.from('ai_insights').select('*', { count: 'exact', head: true }).in('user_id', userIds),
    ])

    if (subsCountRes.error) errors.push(`Counting subscriptions: ${subsCountRes.error.message}`)
    if (subsTypeRes.error) errors.push(`Loading subscription types: ${subsTypeRes.error.message}`)
    if (goalsRes.error) errors.push(`Counting goals: ${goalsRes.error.message}`)
    if (netWorthRes.error) errors.push(`Counting net worth items: ${netWorthRes.error.message}`)
    if (budgetRes.error) errors.push(`Counting budget categories: ${budgetRes.error.message}`)
    if (plaidRes.error) errors.push(`Loading Plaid items: ${plaidRes.error.message}`)
    if (insightsRes.error) errors.push(`Counting AI insights: ${insightsRes.error.message}`)

    subscriptionsCount = subsCountRes.count ?? 0
    goalsCount = goalsRes.count ?? 0
    netWorthCount = netWorthRes.count ?? 0
    budgetCount = budgetRes.count ?? 0
    insightsCount = insightsRes.count ?? 0
    plaidConnectedUsers = new Set((plaidRes.data ?? []).map((r) => r.user_id)).size

    subscriptionTypeCounts = (subsTypeRes.data ?? []).reduce((acc: Record<string, number>, row) => {
      const key = row.item_type ?? 'subscription'
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
  }

  const plusUsers = realUsers.filter((u) => settingsByUser.get(u.id)?.plan === 'plus')
  const familyUsers = realUsers.filter((u) => settingsByUser.get(u.id)?.plan === 'family')
  const paidUsers = [...plusUsers, ...familyUsers]
  const churnedUsers = realUsers.filter((u) => {
    const s = settingsByUser.get(u.id)
    return s?.stripe_customer_id && s?.plan !== 'plus' && s?.plan !== 'family'
  })

  const sevenDaysAgo = Date.now() - 7 * 86400000
  const newSignups7d = realUsers.filter((u) => new Date(u.created_at).getTime() >= sevenDaysAgo)

  let plusPriceCents: number | null = null
  let familyPriceCents: number | null = null
  let priceError: string | null = null
  try {
    if (plusUsers.length > 0 && process.env.STRIPE_PLUS_PRICE_ID) {
      const price = await getStripe().prices.retrieve(process.env.STRIPE_PLUS_PRICE_ID)
      plusPriceCents = price.unit_amount ?? null
    }
    if (familyUsers.length > 0 && process.env.STRIPE_FAMILY_PRICE_ID) {
      const price = await getStripe().prices.retrieve(process.env.STRIPE_FAMILY_PRICE_ID)
      familyPriceCents = price.unit_amount ?? null
    }
  } catch (e) {
    priceError = e instanceof Error ? e.message : 'Unknown Stripe error'
  }
  const plusMRR = plusPriceCents !== null ? (plusPriceCents * plusUsers.length) / 100 : 0
  const familyMRR = familyPriceCents !== null ? (familyPriceCents * familyUsers.length) / 100 : 0
  const estimatedMRR = paidUsers.length > 0 ? plusMRR + familyMRR : null

  const recentSignups = [...realUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12)

  const itemTypeLabels: Record<string, string> = {
    subscription: 'Subscriptions',
    bill: 'Bills',
    license: 'Licenses',
    one_time: 'One-time',
  }

  return (
    <div className="min-h-screen bg-[#0d0b0a]">
      <AdminNav userEmail={user.email ?? ''} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-black text-[#f5efe4] mb-1">Overview</h1>
        <p className="text-sm text-[#8f8570] mb-8">
          Real accounts only — {adminEmails.length} admin email{adminEmails.length === 1 ? '' : 's'}{' '}
          excluded from every number below.
        </p>

        {errors.length > 0 && (
          <div className="mb-8 rounded-lg border border-red-900/50 bg-red-950/30 px-5 py-4">
            <p className="text-sm font-bold text-red-400 mb-2">
              {errors.length} quer{errors.length === 1 ? 'y' : 'ies'} failed — numbers below may be incomplete:
            </p>
            <ul className="text-xs text-red-300/80 space-y-1 list-disc list-inside">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Top-line stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard label="Total Users" value={realUsers.length} />
          <StatCard label="New (7d)" value={newSignups7d.length} />
          <StatCard label="Plus Subscribers" value={plusUsers.length} accent />
          <StatCard label="Family Subscribers" value={familyUsers.length} accent />
          <StatCard
            label="Est. MRR"
            value={estimatedMRR !== null ? `$${estimatedMRR.toFixed(2)}` : '—'}
            accent
            note={
              priceError
                ? `Stripe price fetch failed: ${priceError}`
                : plusUsers.length > 0 && !process.env.STRIPE_PLUS_PRICE_ID
                  ? 'STRIPE_PLUS_PRICE_ID not set'
                  : familyUsers.length > 0 && !process.env.STRIPE_FAMILY_PRICE_ID
                    ? 'STRIPE_FAMILY_PRICE_ID not set'
                    : undefined
            }
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard label="Former Plus/Family (churned)" value={churnedUsers.length} />
          <StatCard label="Bank Sync Connected" value={plaidConnectedUsers} />
          <StatCard label="AI Insights Generated" value={insightsCount} />
        </div>

        {/* Product usage */}
        <h2 className="text-lg font-black text-[#f5efe4] mb-4">Product Usage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Bills & Subs Tracked" value={subscriptionsCount} />
          <StatCard label="Goals Created" value={goalsCount} />
          <StatCard label="Net Worth Items" value={netWorthCount} />
          <StatCard label="Budget Categories" value={budgetCount} />
        </div>

        {Object.keys(subscriptionTypeCounts).length > 0 && (
          <div className="mb-10 rounded-xl border border-[#2a241a] bg-[#17140f] px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8f8570] mb-3">
              Tracked Item Breakdown
            </p>
            <div className="flex flex-wrap gap-6">
              {Object.entries(subscriptionTypeCounts).map(([type, count]) => (
                <div key={type}>
                  <div className="text-xl font-black text-[#f5efe4]">{count}</div>
                  <div className="text-xs text-[#8f8570]">{itemTypeLabels[type] ?? type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent signups */}
        <h2 className="text-lg font-black text-[#f5efe4] mb-4">Recent Signups</h2>
        <div className="rounded-xl border border-[#2a241a] bg-[#17140f] overflow-hidden">
          {recentSignups.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[#8f8570] text-center">
              No real signups yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a241a] text-left">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#8f8570]">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#8f8570]">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#8f8570]">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((u) => {
                  const plan = settingsByUser.get(u.id)?.plan ?? 'free'
                  return (
                    <tr key={u.id} className="border-b border-[#2a241a] last:border-0">
                      <td className="px-6 py-3 text-[#cfc6b4]">{u.email}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            plan === 'plus' || plan === 'family'
                              ? 'bg-[#d4a017]/15 text-[#eac020] border border-[#d4a017]/30'
                              : 'bg-[#2a241a] text-[#8f8570]'
                          }`}
                        >
                          {plan === 'plus' ? 'Plus' : plan === 'family' ? 'Family' : 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[#8f8570]">{timeAgo(u.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
  note,
}: {
  label: string
  value: string | number
  accent?: boolean
  note?: string
}) {
  return (
    <div className="rounded-xl border border-[#2a241a] bg-[#17140f] px-5 py-4">
      <div className={`text-2xl font-black ${accent ? 'text-[#eac020]' : 'text-[#f5efe4]'}`}>
        {value}
      </div>
      <div className="text-xs text-[#8f8570] mt-1">{label}</div>
      {note && <div className="text-[10px] text-red-400/80 mt-1">{note}</div>}
    </div>
  )
}
