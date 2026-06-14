export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlaidClient } from '@/lib/plaid'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: items } = await admin
    .from('plaid_items')
    .select('*')
    .eq('user_id', user.id)

  if (items && items.length > 0) {
    const plaid = getPlaidClient()
    for (const item of items) {
      try {
        await plaid.itemRemove({ access_token: item.access_token })
      } catch {
        // item may already be removed on Plaid's side, continue cleanup
      }
    }
    await admin.from('plaid_items').delete().eq('user_id', user.id)
  }

  await admin
    .from('user_settings')
    .update({ plaid_enabled: false, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
