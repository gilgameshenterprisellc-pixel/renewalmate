export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { subscription } = body

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 })
  }

  const { error } = await createAdminClient()
    .from('push_subscriptions')
    .upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
      },
      { onConflict: 'endpoint' }
    )

  if (error) {
    console.error('Push subscribe error:', error)
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
