import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, amount, billing_cycle, next_renewal_date, category, cancel_url, notes, item_type, is_trial, trial_ends_at } = body

  // If amount is changing, log the old value to price history before updating
  if (amount !== undefined) {
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('amount')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (existing && Number(existing.amount) !== Number(amount)) {
      await supabase.from('subscription_price_history').insert({
        subscription_id: id,
        user_id: user.id,
        old_amount: existing.amount,
        new_amount: amount,
      })
    }
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      ...(name !== undefined && { name }),
      ...(amount !== undefined && { amount }),
      ...(billing_cycle !== undefined && { billing_cycle }),
      ...(next_renewal_date !== undefined && { next_renewal_date }),
      ...(category !== undefined && { category }),
      ...(cancel_url !== undefined && { cancel_url }),
      ...(notes !== undefined && { notes }),
      ...(item_type !== undefined && { item_type }),
      ...(is_trial !== undefined && { is_trial }),
      ...(trial_ends_at !== undefined && { trial_ends_at }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ subscription: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
