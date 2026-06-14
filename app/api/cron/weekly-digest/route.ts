import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function toMonthly(amount: number, cycle: string) {
  if (cycle === 'weekly') return amount * 4.33
  if (cycle === 'yearly') return amount / 12
  if (cycle === 'one_time') return 0
  return amount
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('weekly_digest_enabled', true)

  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 })

  // Users with no row default to enabled — find all users who have at least one tracked item
  // and have NOT explicitly disabled the digest.
  const { data: allSubUsers, error: subUsersError } = await supabase
    .from('subscriptions')
    .select('user_id')

  if (subUsersError) return NextResponse.json({ error: subUsersError.message }, { status: 500 })

  const { data: disabledSettings } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('weekly_digest_enabled', false)

  const disabledIds = new Set((disabledSettings ?? []).map((s) => s.user_id))
  const enabledIds = new Set((settings ?? []).map((s) => s.user_id))
  const candidateIds = new Set<string>()

  for (const row of allSubUsers ?? []) {
    if (!disabledIds.has(row.user_id)) candidateIds.add(row.user_id)
  }
  for (const id of enabledIds) {
    if (!disabledIds.has(id)) candidateIds.add(id)
  }

  if (candidateIds.size === 0) {
    return NextResponse.json({ sent: 0, message: 'No users to send to' })
  }

  const now = new Date()
  const weekEnd = new Date(now)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const todayStr = now.toISOString().slice(0, 10)
  const weekEndStr = weekEnd.toISOString().slice(0, 10)

  let sent = 0
  const errors: string[] = []

  for (const userId of Array.from(candidateIds)) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError || !userData?.user?.email) {
      errors.push(`No email for user ${userId}`)
      continue
    }

    const { data: subs } = await supabase
      .from('subscriptions')
      .select('name, amount, billing_cycle, next_renewal_date, item_type')
      .eq('user_id', userId)

    if (!subs || subs.length === 0) continue

    const monthlyTotal = subs
      .filter((s) => s.item_type !== 'one_time')
      .reduce((sum, s) => sum + toMonthly(Number(s.amount), s.billing_cycle), 0)

    const upcoming = subs
      .filter((s) => s.next_renewal_date >= todayStr && s.next_renewal_date <= weekEndStr)
      .sort((a, b) => a.next_renewal_date.localeCompare(b.next_renewal_date))

    const rows = upcoming
      .map((s) => `
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:10px 0;font-weight:700;color:#1a2e22">${s.name}</td>
          <td style="padding:10px 0;color:#1e7a4a;font-weight:700">$${Number(s.amount).toFixed(2)}</td>
          <td style="padding:10px 0;color:#666">${formatDate(s.next_renewal_date)}</td>
        </tr>
      `)
      .join('')

    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a2e22">Your weekly RenewalMate digest</h2>
        <p style="color:#666">You're tracking <strong>${subs.length}</strong> item${subs.length === 1 ? '' : 's'}, totaling
          <strong style="color:#1e7a4a">$${monthlyTotal.toFixed(2)}/mo</strong>.</p>
        ${upcoming.length > 0 ? `
          <p style="color:#1a2e22;font-weight:700;margin-top:20px">Renewing in the next 7 days:</p>
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:14px">
            <thead>
              <tr style="border-bottom:2px solid #1e7a4a">
                <th style="padding:8px 0;color:#1a2e22">Name</th>
                <th style="padding:8px 0;color:#1a2e22">Amount</th>
                <th style="padding:8px 0;color:#1a2e22">Renews</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        ` : `<p style="color:#666">Nothing renewing in the next 7 days. 🎉</p>`}
        <p style="margin-top:24px;color:#999;font-size:12px">
          You're getting this because you have items tracked in RenewalMate.
          <a href="https://www.renewalmate.com/dashboard" style="color:#1e7a4a">View dashboard</a> ·
          <a href="https://www.renewalmate.com/settings" style="color:#1e7a4a">Manage notifications</a>
        </p>
      </div>
    `

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'RenewalMate <reminders@renewalmate.com>',
          to: userData.user.email,
          subject: 'Your weekly RenewalMate digest',
          html,
        }),
      })

      if (!res.ok) {
        errors.push(`Resend failed for ${userData.user.email}: ${await res.text()}`)
        continue
      }

      sent++
    } catch (e) {
      errors.push(`Error sending to ${userData.user.email}: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  return NextResponse.json({ sent, usersChecked: candidateIds.size, errors })
}
