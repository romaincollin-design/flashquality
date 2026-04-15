import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import ProsList from './ProsList'

export default async function AdminProsPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(n: string) { return cookieStore.get(n)?.value }, set() {}, remove() {} } }
  )
  const { data: pros } = await supabase.from('pros').select('*').order('created_at', { ascending: false })
  return <ProsList pros={pros || []} />
}
