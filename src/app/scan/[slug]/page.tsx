import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { notFound } from 'next/navigation'
import ScanClient from './ScanClient'

export default async function ScanPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const { data: pro } = await supabase
    .from("pros")
    .select("id, slug, nom, categorie, adresse, tel, plan")
    .eq("slug", params.slug)
    .eq("actif", true)
    .single()
  return <ScanClient pro={pro} />
}
