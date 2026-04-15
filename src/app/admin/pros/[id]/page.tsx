import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ProEditor from './ProEditor'

export default async function AdminProPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(n: string) { return cookieStore.get(n)?.value }, set() {}, remove() {} } }
  )
  const { data: pro } = await supabase.from('pros').select('*').eq('id', params.id).single()
  if (!pro) notFound()
  const { data: offres } = await supabase.from('offres').select('*').eq('pro_id', params.id)
  return <ProEditor pro={pro} offres={offres || []} />
}
