import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Delete all user-owned rows across every table (RLS-scoped tables, belt-and-suspenders
  // in case any table doesn't have ON DELETE CASCADE from auth.users)
  await Promise.all([
    admin.from('subscription_price_history').delete().eq('user_id', user.id),
    admin.from('subscriptions').delete().eq('user_id', user.id),
    admin.from('budget_categories').delete().eq('user_id', user.id),
    admin.from('net_worth_items').delete().eq('user_id', user.id),
    admin.from('goals').delete().eq('user_id', user.id),
    admin.from('push_subscriptions').delete().eq('user_id', user.id),
    admin.from('user_settings').delete().eq('user_id', user.id),
  ])

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
