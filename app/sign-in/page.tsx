'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const result = await authClient.signIn.email({ email, password })
    if (result.error) { setError('Correo o contraseña incorrectos'); return }
    router.push('/admin'); router.refresh()
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-5"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_12px_35px_rgba(33,61,59,0.1)]"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4c8473]">AMPA CEIP Reino de Murcia</p><h1 className="mt-2 font-serif text-3xl font-semibold text-[#174c4e]">Acceso administrador</h1><p className="mt-2 text-sm text-[#728187]">Entra desde tu portátil para gestionar clases y contenidos.</p><label className="mt-6 block text-sm font-semibold text-[#526268]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5e2dc] px-3 py-3 outline-none focus:border-[#4c8473]" /></label><label className="mt-4 block text-sm font-semibold text-[#526268]">Contraseña<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5e2dc] px-3 py-3 outline-none focus:border-[#4c8473]" /></label>{error && <p role="alert" className="mt-3 text-sm text-[#b65c45]">{error}</p>}<button className="mt-6 w-full rounded-xl bg-[#174c4e] py-3 font-bold text-white">Entrar al panel</button><p className="mt-5 text-center text-sm text-[#728187]">¿Aún no tienes contraseña? <Link href="/sign-up" className="font-bold text-[#23645f] underline underline-offset-4">Crear contraseña ahora</Link></p></form></main>
}
