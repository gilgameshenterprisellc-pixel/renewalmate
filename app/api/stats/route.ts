export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public, unauthenticated, aggregate-only counts for the landing page live
// counter. No PII returned — same exclusion rule as /admin so the numbers
// agree with each other and neither counts our own test accounts.
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export async function GET() {
  const admin = createAdminClient()
  const adminEmails = getAdminEmails()

  const { data: usersPage, error: usersError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (usersError) {
    return NextResponse.json({ users: 0, itemsTracked: 0 })
  }

  const realUserIds = (usersPage?.users ?? [])
    .filter((u) => !adminEmails.includes((u.email ?? '').toLowerCase()))
    .map((u) => u.id)

  if (realUserIds.length === 0) {
    return NextResponse.json({ users: 0, itemsTracked: 0 })
  }

  const { count, error: countError } = await admin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .in('user_id', realUserIds)

  if (countError) {
    return NextResponse.json({ users: realUserIds.length, itemsTracked: 0 })
  }

  return NextResponse.json({ users: realUserIds.length, itemsTracked: count ?? 0 })
}
