export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateInsights } from '@/lib/gemini'

const CYCLE_LABEL: Record<string, string> = {
  weekly: '/week',
  monthly: '/month',
  yearly: '/year',
  one_time: 'one-time',
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: insight } = await admin
    .from('ai_insights')
    .select('content, generated_at')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ insight: insight ?? null })
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'AI insights are not configured yet' }, { status: 503 })
  }

  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('user_settings')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()

  if (settings?.plan !== 'plus') {
    return NextResponse.json({ error: 'AI insights are a RenewalMate Plus feature' }, { status: 403 })
  }

  const { data: existing } = await admin
    .from('ai_insights')
    .select('content, generated_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    const elapsed = Date.now() - new Date(existing.generated_at).getTime()
    if (elapsed < COOLDOWN_MS) {
      const hoursLeft = Math.ceil((COOLDOWN_MS - elapsed) / (60 * 60 * 1000))
      return NextResponse.json(
        { error: `You can generate new insights again in about ${hoursLeft}h.` },
        { status: 429 }
      )
    }
  }

  const { data: subs } = await admin
    .from('subscriptions')
    .select('name, amount, billing_cycle, category, next_renewal_date, is_trial, trial_ends_at')
    .eq('user_id', user.id)

  if (!subs || subs.length === 0) {
    return NextResponse.json({ error: 'Add some subscriptions or bills first.' }, { status: 400 })
  }

  const lines = subs.map(
    (s) => `- ${s.name}: $${s.amount}${CYCLE_LABEL[s.billing_cycle] || ''}, category: ${s.category}, next renewal: ${s.next_renewal_date}${s.is_trial ? ` (trial ends ${s.trial_ends_at})` : ''}`
  )

  const prompt = `You are a friendly personal finance assistant inside RenewalMate, an app that tracks subscriptions, bills, and recurring expenses. Here is the user's current list of tracked items:

${lines.join('\n')}

Write 3-5 short, specific, actionable insights to help this person save money or avoid surprise charges. Focus on: duplicate or overlapping services, expensive subscriptions relative to their category, upcoming renewals or trials worth cancelling, and any opportunities to switch to a cheaper billing cycle (e.g. yearly vs monthly). Use plain language, no markdown headers, just a short numbered list. Keep the whole response under 150 words.`

  let content: string
  try {
    content = await generateInsights(prompt)
  } catch {
    return NextResponse.json({ error: 'Something went wrong generating insights. Please try again later.' }, { status: 500 })
  }

  const generatedAt = new Date().toISOString()
  await admin
    .from('ai_insights')
    .upsert({ user_id: user.id, content, generated_at: generatedAt })

  return NextResponse.json({ insight: { content, generated_at: generatedAt } })
}
