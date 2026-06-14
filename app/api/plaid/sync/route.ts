export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlaidClient } from '@/lib/plaid'
import type { Transaction } from 'plaid'

const DAY_MS = 24 * 60 * 60 * 1000

function classifyCycle(daysBetween: number): 'weekly' | 'monthly' | 'yearly' | null {
  if (daysBetween >= 5 && daysBetween <= 10) return 'weekly'
  if (daysBetween >= 25 && daysBetween <= 35) return 'monthly'
  if (daysBetween >= 350 && daysBetween <= 380) return 'yearly'
  return null
}

function nextDate(from: string, cycle: 'weekly' | 'monthly' | 'yearly'): string {
  const d = new Date(from)
  if (cycle === 'weekly') d.setDate(d.getDate() + 7)
  if (cycle === 'monthly') d.setMonth(d.getMonth() + 1)
  if (cycle === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('user_settings')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()

  if (settings?.plan !== 'plus') {
    return NextResponse.json({ error: 'Bank sync is a RenewalMate Plus feature' }, { status: 403 })
  }

  const { data: items } = await admin
    .from('plaid_items')
    .select('*')
    .eq('user_id', user.id)

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No connected banks found' }, { status: 404 })
  }

  const plaid = getPlaidClient()
  const allAdded: Transaction[] = []

  for (const item of items) {
    let cursor = item.cursor || undefined
    let hasMore = true

    while (hasMore) {
      const resp = await plaid.transactionsSync({
        access_token: item.access_token,
        cursor,
      })
      allAdded.push(...resp.data.added)
      cursor = resp.data.next_cursor
      hasMore = resp.data.has_more
    }

    await admin
      .from('plaid_items')
      .update({ cursor, updated_at: new Date().toISOString() })
      .eq('id', item.id)
  }

  // Group expense transactions (positive amount = money out) by merchant name + rounded amount
  const groups = new Map<string, Transaction[]>()
  for (const tx of allAdded) {
    if (tx.amount <= 0) continue
    const merchant = (tx.merchant_name || tx.name || 'Unknown').trim()
    const rounded = Math.round(tx.amount)
    const key = `${merchant.toLowerCase()}|${rounded}`
    const arr = groups.get(key) || []
    arr.push(tx)
    groups.set(key, arr)
  }

  const { data: existingSubs } = await admin
    .from('subscriptions')
    .select('id, name, plaid_transaction_id')
    .eq('user_id', user.id)

  let created = 0
  let updated = 0

  for (const [, txs] of groups) {
    if (txs.length < 2) continue

    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const latest = txs[txs.length - 1]
    const prev = txs[txs.length - 2]
    const daysBetween = Math.round(
      (new Date(latest.date).getTime() - new Date(prev.date).getTime()) / DAY_MS
    )
    const cycle = classifyCycle(daysBetween)
    if (!cycle) continue

    const merchant = (latest.merchant_name || latest.name || 'Unknown').trim()
    const amount = Math.abs(latest.amount)
    const renewalDate = nextDate(latest.date, cycle)

    const existing = existingSubs?.find(
      (s) => s.name.toLowerCase() === merchant.toLowerCase()
    )

    if (existing) {
      await admin
        .from('subscriptions')
        .update({
          amount,
          billing_cycle: cycle,
          next_renewal_date: renewalDate,
          plaid_transaction_id: latest.transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
      updated++
    } else {
      await admin.from('subscriptions').insert({
        user_id: user.id,
        name: merchant,
        amount,
        billing_cycle: cycle,
        next_renewal_date: renewalDate,
        category: 'other',
        item_type: 'subscription',
        is_trial: false,
        plaid_transaction_id: latest.transaction_id,
      })
      created++
    }
  }

  return NextResponse.json({ created, updated, transactions_seen: allAdded.length })
}
