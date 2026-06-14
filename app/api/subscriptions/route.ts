import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_renewal_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ subscriptions: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, amount, billing_cycle, next_renewal_date, category, cancel_url, notes } = body

  if (!name || !next_renewal_date) {
    return NextResponse.json({ error: 'Name and next renewal date are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      name,
      amount: amount ?? 0,
      billing_cycle: billing_cycle ?? 'monthly',
      next_renewal_date,
      category: category ?? 'other',
      cancel_url: cancel_url ?? null,
      notes: notes ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ subscription: data })
}
