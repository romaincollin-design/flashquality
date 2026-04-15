import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import StatsClient from './StatsClient'
import { getStatsMock } from '@/lib/admin/mock'

export default async function AdminStatsPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminEmail = process.env.ADMIN_EMAIL || ''
  if (!adminEmail || user.email !== adminEmail) redirect('/dashboard')

  // V1 : mock agr\u00e9g\u00e9 c\u00f4t\u00e9 client.
  // V2 : fetch r\u00e9el clients/depenses/xp_events/reviews ici et passer \u00e0 StatsClient.
  const data = getStatsMock()

  return <StatsClient data={data} />
}
