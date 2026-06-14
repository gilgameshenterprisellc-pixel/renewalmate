import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .order('next_renewal_date', { ascending: true })

  const { data: settings } = await supabase
    .from('user_settings')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <DashboardClient
      initialSubscriptions={subscriptions ?? []}
      userEmail={user.email ?? ''}
      plan={settings?.plan ?? 'free'}
    />
  )
}
