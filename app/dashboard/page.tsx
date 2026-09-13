import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscriptions, error: subsError } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_renewal_date', { ascending: true })
  if (subsError) console.error('dashboard: failed to load subscriptions', subsError)

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()
  if (settingsError) console.error('dashboard: failed to load user_settings', settingsError)

  return (
    <DashboardClient
      initialSubscriptions={subscriptions ?? []}
      userEmail={user.email ?? ''}
      plan={settings?.plan ?? 'free'}
    />
  )
}
