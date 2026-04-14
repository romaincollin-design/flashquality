import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'
 
export default async function AdminPage() {
  const cookieStore = cookies()
 
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {},
      },
    }
  )
 
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
 
  const adminEmail = process.env.ADMIN_EMAIL || ''
  if (!adminEmail || user.email !== adminEmail) redirect('/dashboard')
 
  const { data: pros } = await supabase
    .from('pros')
    .select('*')
    .order('created_at', { ascending: false })
 
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
 
  return (
    <AdminClient
      userEmail={user.email || ''}
      pros={pros || []}
      reviews={reviews || []}
    />
  )
}
