import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NetWorthClient from './NetWorthClient'

export default async function NetWorthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('net_worth_items')
    .select('*')
    .order('created_at', { ascending: false })

  return <NetWorthClient initialItems={items ?? []} userEmail={user.email ?? ''} />
}
