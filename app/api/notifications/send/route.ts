// Required environment variables:
//   NEXT_PUBLIC_VAPID_PUBLIC_KEY  — generate with: npx web-push generate-vapid-keys
//   VAPID_PRIVATE_KEY             — server-side only
//   VAPID_SUBJECT                 — e.g. mailto:hello@renewalmate.com

export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import webpush from 'web-push'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { user_id, title, body: msgBody, url, tag } = body

  if (!user_id || !title) {
    return NextResponse.json({ error: 'user_id and title are required' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: sub, error: fetchError } = await admin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth_key')
    .eq('user_id', user_id)
    .maybeSingle()

  if (fetchError) {
    console.error('Push send: fetch subscription error:', fetchError)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }

  if (!sub) {
    return NextResponse.json({ ok: false, reason: 'No subscription found for user' })
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:hello@renewalmate.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  const pushSubscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh,
      auth: sub.auth_key,
    },
  }

  const payload = JSON.stringify({ title, body: msgBody || '', url: url || '/dashboard', tag: tag || 'renewalmate' })

  try {
    await webpush.sendNotification(pushSubscription, payload)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const statusCode = (err as { statusCode?: number })?.statusCode
    if (statusCode === 410) {
      await admin
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint)
      return NextResponse.json({ ok: false, reason: 'Subscription expired and removed' })
    }
    console.error('Push send error:', err)
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 })
  }
}
