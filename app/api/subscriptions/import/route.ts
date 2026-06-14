import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_ITEM_TYPES = ['subscription', 'bill', 'license', 'one_time']
const VALID_CYCLES = ['weekly', 'monthly', 'yearly', 'one_time']

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const items = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    return NextResponse.json({ error: 'No items to import' }, { status: 400 })
  }
  if (items.length > 500) {
    return NextResponse.json({ error: 'Max 500 rows per import' }, { status: 400 })
  }

  const rows = []
  for (const item of items) {
    const name = String(item.name ?? '').trim()
    const next_renewal_date = String(item.next_renewal_date ?? '').trim()
    if (!name || !next_renewal_date) continue

    const item_type = VALID_ITEM_TYPES.includes(item.item_type) ? item.item_type : 'subscription'
    const billing_cycle = VALID_CYCLES.includes(item.billing_cycle) ? item.billing_cycle : 'monthly'
    const amount = isNaN(parseFloat(item.amount)) ? 0 : parseFloat(item.amount)

    rows.push({
      user_id: user.id,
      name,
      amount,
      billing_cycle,
      next_renewal_date,
      category: item.category ? String(item.category).trim() : 'other',
      cancel_url: item.cancel_url ? String(item.cancel_url).trim() : null,
      notes: item.notes ? String(item.notes).trim() : null,
      item_type,
      is_trial: false,
      trial_ends_at: null,
    })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'No valid rows found. Each row needs a name and next_renewal_date.' }, { status: 400 })
  }

  const { data, error } = await supabase.from('subscriptions').insert(rows).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ imported: data.length, items: data })
}
