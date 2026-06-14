export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await createAdminClient()
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('Push unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
