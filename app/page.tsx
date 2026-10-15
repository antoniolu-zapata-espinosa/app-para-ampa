import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { obtenerHijosDeFamilia } from '@/app/actions/familia'
import HomeClient from '@/components/home-client'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  const children = session?.user ? await obtenerHijosDeFamilia(session.user.id) : []
  return <HomeClient children={children} />
}
