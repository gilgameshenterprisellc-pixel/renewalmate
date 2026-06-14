import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('budget_categories')
    .select('*')
    .order('category', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ budgets: data })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { category, monthly_cap } = body

  if (!category) return NextResponse.json({ error: 'Category is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('budget_categories')
    .upsert(
      { user_id: user.id, category, monthly_cap: monthly_cap ?? 0, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,category' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ budget: data })
}
