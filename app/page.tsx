import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { obtenerHijosDeFamilia } from '@/app/actions/familia'
import HomeClient from '@/components/home-client'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const children = await obtenerHijosDeFamilia(session.user.id)
  return <HomeClient children={children} />
}
