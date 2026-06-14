export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('user_settings')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settings?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.renewalmate.com'

  const session = await getStripe().billingPortal.sessions.create({
    customer: settings.stripe_customer_id,
    return_url: `${origin}/settings`,
  })

  return NextResponse.json({ url: session.url })
}
