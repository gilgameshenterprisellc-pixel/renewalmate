import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [subscriptions, priceHistory, budgets, netWorth, goals, settings] = await Promise.all([
    supabase.from('subscriptions').select('*'),
    supabase.from('subscription_price_history').select('*'),
    supabase.from('budget_categories').select('*'),
    supabase.from('net_worth_items').select('*'),
    supabase.from('goals').select('*'),
    supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    user: { id: user.id, email: user.email, created_at: user.created_at },
    subscriptions: subscriptions.data ?? [],
    subscription_price_history: priceHistory.data ?? [],
    budget_categories: budgets.data ?? [],
    net_worth_items: netWorth.data ?? [],
    goals: goals.data ?? [],
    user_settings: settings.data ?? null,
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="renewalmate-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
