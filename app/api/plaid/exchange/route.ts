export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlaidClient } from '@/lib/plaid'
import { CountryCode } from 'plaid'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

  const body = await req.json()
  const publicToken = body.public_token
  if (!publicToken) {
    return NextResponse.json({ error: 'Missing public_token' }, { status: 400 })
  }

  const plaid = getPlaidClient()

  const exchange = await plaid.itemPublicTokenExchange({ public_token: publicToken })
  const accessToken = exchange.data.access_token
  const itemId = exchange.data.item_id

  let institutionName: string | null = null
  try {
    const itemResponse = await plaid.itemGet({ access_token: accessToken })
    const institutionId = itemResponse.data.item.institution_id
    if (institutionId) {
      const inst = await plaid.institutionsGetById({
        institution_id: institutionId,
        country_codes: [CountryCode.Us],
      })
      institutionName = inst.data.institution.name
    }
  } catch {
    institutionName = null
  }

  await admin.from('plaid_items').insert({
    user_id: user.id,
    item_id: itemId,
    access_token: accessToken,
    institution_name: institutionName,
  })

  await admin
    .from('user_settings')
    .update({ plaid_enabled: true, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return NextResponse.json({ success: true, institution_name: institutionName })
}
