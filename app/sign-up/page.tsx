'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      if (result.error) {
        const errorCode = result.error.code ?? ''
        setError(
          errorCode === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
            ? 'Esta cuenta ya existe. Usa «Volver al acceso» para entrar con tu contraseña.'
            : 'No se pudo crear la cuenta. Comprueba que la contraseña tenga al menos 8 caracteres y vuelve a intentarlo.',
        )
        return
      }

      setSuccess('Cuenta creada. Entrando al panel…')
      router.push('/admin')
      router.refresh()
    } catch {
      setError('No se ha podido conectar con la base de datos. Vuelve a intentarlo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-5 py-8">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_12px_35px_rgba(33,61,59,0.1)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4c8473]">AMPA La Encina</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#174c4e]">Crear contraseña</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#728187]">Crea la cuenta administradora para acceder desde tu portátil. Usa el correo autorizado del AMPA.</p>
        <label className="mt-6 block text-sm font-semibold text-[#526268]">Nombre<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5e2dc] px-3 py-3 outline-none focus:border-[#4c8473]" /></label>
        <label className="mt-4 block text-sm font-semibold text-[#526268]">Correo electrónico<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5e2dc] px-3 py-3 outline-none focus:border-[#4c8473]" /></label>
        <label className="mt-4 block text-sm font-semibold text-[#526268]">Nueva contraseña<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d5e2dc] px-3 py-3 outline-none focus:border-[#4c8473]" /><span className="mt-2 block text-xs font-normal text-[#849297]">Mínimo 8 caracteres.</span></label>
        {error && <p role="alert" className="mt-3 text-sm text-[#b65c45]">{error}</p>}
        {success && <p role="status" className="mt-3 text-sm text-[#23645f]">{success}</p>}
        <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-[#174c4e] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Creando cuenta…' : 'Crear cuenta y entrar'}</button>
        <p className="mt-5 text-center text-sm text-[#728187]">¿Ya tienes contraseña? <Link href="/sign-in" className="font-bold text-[#23645f] underline underline-offset-4">Volver al acceso</Link></p>
      </form>
    </main>
  )
}
