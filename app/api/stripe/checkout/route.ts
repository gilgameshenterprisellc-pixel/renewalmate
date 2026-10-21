export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

const TIER_PRICE_ENV: Record<string, string> = {
  plus: 'STRIPE_PLUS_PRICE_ID',
  family: 'STRIPE_FAMILY_PRICE_ID',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let tier = 'plus'
  try {
    const body = await req.json()
    if (body?.tier && TIER_PRICE_ENV[body.tier]) tier = body.tier
  } catch {
    // no body / not JSON — default to plus
  }

  const priceId = process.env[TIER_PRICE_ENV[tier]]
  if (!priceId) {
    return NextResponse.json({ error: `${tier === 'family' ? 'Family' : 'Plus'} tier is not configured yet` }, { status: 503 })
  }

  const stripe = getStripe()
  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('user_settings')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  let customerId = settings?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    })
    customerId = customer.id

    await admin
      .from('user_settings')
      .upsert(
        { user_id: user.id, stripe_customer_id: customerId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.renewalmate.com'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/settings?upgraded=${tier}`,
    cancel_url: `${origin}/settings`,
    metadata: { user_id: user.id, tier },
    subscription_data: { metadata: { user_id: user.id, tier } },
  })

  return NextResponse.json({ url: session.url })
}
