import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import ScanReview from './ScanReview'

export const dynamic = 'force-dynamic'

export default async function ScanPage({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: commerce } = await supabase
    .from('pros')
    .select('id,nom,slug,categorie')
    .eq('slug', params.slug)
    .single()
  if (!commerce) return notFound()
  return <ScanReview commerce={commerce} />
}
