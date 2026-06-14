export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlaidClient } from '@/lib/plaid'
import { Products, CountryCode } from 'plaid'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
    return NextResponse.json({ error: 'Bank sync is not configured yet' }, { status: 503 })
  }

  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('user_settings')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()

  if (settings?.plan !== 'plus') {
    return NextResponse.json({ error: 'Bank sync is a RenewalMate Plus feature' }, { status: 403 })
  }

  const plaid = getPlaidClient()

  const response = await plaid.linkTokenCreate({
    user: { client_user_id: user.id },
    client_name: 'RenewalMate',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
  })

  return NextResponse.json({ link_token: response.data.link_token })
}
