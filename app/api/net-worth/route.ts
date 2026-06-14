import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('net_worth_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, item_type, category, value, notes } = body

  if (!name || !item_type || value === undefined) {
    return NextResponse.json({ error: 'name, item_type, and value are required' }, { status: 400 })
  }
  if (!['asset', 'debt'].includes(item_type)) {
    return NextResponse.json({ error: 'item_type must be asset or debt' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('net_worth_items')
    .insert({
      user_id: user.id,
      name,
      item_type,
      category: category || 'other',
      value,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}
