export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Derives plan from the subscription's actual price ID rather than trusting
  // client-set metadata, so an upgrade/downgrade via the billing portal (which
  // doesn't go through our checkout route) still lands on the right plan.
  function planForPriceId(priceId: string | undefined): 'plus' | 'family' {
    if (priceId && priceId === process.env.STRIPE_FAMILY_PRICE_ID) return 'family'
    return 'plus'
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      if (userId && session.customer && session.subscription) {
        const subscription = await getStripe().subscriptions.retrieve(session.subscription as string)
        const plan = planForPriceId(subscription.items.data[0]?.price.id)
        await admin
          .from('user_settings')
          .upsert(
            {
              user_id: userId,
              plan,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id
      if (userId) {
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'
        const plan = isActive ? planForPriceId(subscription.items.data[0]?.price.id) : 'free'
        await admin
          .from('user_settings')
          .update({
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id
      if (userId) {
        await admin
          .from('user_settings')
          .update({
            plan: 'free',
            plaid_enabled: false,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
