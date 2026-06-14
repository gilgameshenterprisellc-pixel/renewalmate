import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <SettingsClient
      userEmail={user.email ?? ''}
      initialDigestEnabled={settings?.weekly_digest_enabled ?? true}
    />
  )
}
