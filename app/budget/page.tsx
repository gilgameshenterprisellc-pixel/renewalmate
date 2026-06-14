import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BudgetClient from './BudgetClient'

export default async function BudgetPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: subscriptions }, { data: budgets }] = await Promise.all([
    supabase.from('subscriptions').select('amount, billing_cycle, category'),
    supabase.from('budget_categories').select('*'),
  ])

  return (
    <BudgetClient
      initialSubscriptions={subscriptions ?? []}
      initialBudgets={budgets ?? []}
      userEmail={user.email ?? ''}
    />
  )
}
