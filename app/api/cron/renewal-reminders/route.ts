import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const REMINDER_WINDOW_DAYS = 3

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const today = new Date()
  const windowEnd = new Date(today)
  windowEnd.setDate(windowEnd.getDate() + REMINDER_WINDOW_DAYS)

  const todayStr = today.toISOString().slice(0, 10)
  const windowEndStr = windowEnd.toISOString().slice(0, 10)

  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('id, user_id, name, amount, billing_cycle, next_renewal_date, cancel_url, reminder_sent_for_date')
    .gte('next_renewal_date', todayStr)
    .lte('next_renewal_date', windowEndStr)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const due = (subs ?? []).filter(s => s.reminder_sent_for_date !== s.next_renewal_date)

  if (due.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No reminders due' })
  }

  const byUser = new Map<string, typeof due>()
  for (const sub of due) {
    const list = byUser.get(sub.user_id) ?? []
    list.push(sub)
    byUser.set(sub.user_id, list)
  }

  let sent = 0
  const errors: string[] = []

  for (const [userId, userSubs] of Array.from(byUser.entries())) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError || !userData?.user?.email) {
      errors.push(`No email for user ${userId}`)
      continue
    }

    const rows = userSubs
      .sort((a, b) => a.next_renewal_date.localeCompare(b.next_renewal_date))
      .map(s => `
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:10px 0;font-weight:700;color:#1a2e22">${s.name}</td>
          <td style="padding:10px 0;color:#1e7a4a;font-weight:700">$${Number(s.amount).toFixed(2)}</td>
          <td style="padding:10px 0;color:#666">${formatDate(s.next_renewal_date)}</td>
          <td style="padding:10px 0">${s.cancel_url ? `<a href="${s.cancel_url}" style="color:#1e7a4a">Cancel</a>` : ''}</td>
        </tr>
      `)
      .join('')

    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a2e22">Upcoming renewals</h2>
        <p style="color:#666">These are renewing in the next ${REMINDER_WINDOW_DAYS} days. Cancel now if you don't need them.</p>
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:14px">
          <thead>
            <tr style="border-bottom:2px solid #1e7a4a">
              <th style="padding:8px 0;color:#1a2e22">Name</th>
              <th style="padding:8px 0;color:#1a2e22">Amount</th>
              <th style="padding:8px 0;color:#1a2e22">Renews</th>
              <th style="padding:8px 0;color:#1a2e22"></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">
          You're getting this because you have renewals tracked in RenewalMate.
          <a href="https://www.renewalmate.com/dashboard" style="color:#1e7a4a">View dashboard</a>
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
          subject: userSubs.length === 1
            ? `${userSubs[0].name} renews soon`
            : `${userSubs.length} renewals coming up`,
          html,
        }),
      })

      if (!res.ok) {
        errors.push(`Resend failed for ${userData.user.email}: ${await res.text()}`)
        continue
      }

      for (const s of userSubs) {
        await supabase
          .from('subscriptions')
          .update({ reminder_sent_for_date: s.next_renewal_date })
          .eq('id', s.id)
      }

      sent++
    } catch (e) {
      errors.push(`Error sending to ${userData.user.email}: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  return NextResponse.json({ sent, usersChecked: byUser.size, errors })
}
