'use server'

import { auth, ADMIN_EMAIL } from '@/lib/auth'
import { db } from '@/lib/db'
import { agenda, clases, hijos, hijosUsuarios, menuEscolar, noticias } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.email.toLowerCase() !== ADMIN_EMAIL) throw new Error('No autorizado')
}

export async function crearClase(formData: FormData) {
  await requireAdmin()
  const nombre = String(formData.get('nombre') ?? '').trim()
  const etapa = String(formData.get('etapa') ?? '').trim()
  const cursoEscolar = String(formData.get('cursoEscolar') ?? '').trim()
  if (!nombre || !etapa || !cursoEscolar) throw new Error('Completa todos los campos de la clase')
  await db.insert(clases).values({ id: randomUUID(), nombre, etapa, cursoEscolar, activa: true })
  revalidatePath('/admin')
}

export async function asociarPadreAClase(formData: FormData) {
  await requireAdmin()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const nombre = String(formData.get('nombre') ?? '').trim()
  const apellidos = String(formData.get('apellidos') ?? '').trim()
  const claseId = String(formData.get('claseId') ?? '').trim()
  const parentesco = String(formData.get('parentesco') ?? 'tutor').trim()
  if (!email || !nombre || !apellidos || !claseId) throw new Error('Completa el correo, el alumno y la clase')

  const users = await db.execute<{ id: string }>(sql`SELECT "id" FROM "user" WHERE lower("email") = ${email} LIMIT 1`)
  const user = users.rows[0]
  if (!user) throw new Error('No existe una cuenta con ese correo. Crea primero la cuenta del padre o madre.')

  const existingChild = await db.select({ id: hijos.id }).from(hijos).where(sql`lower(${hijos.nombre}) = ${nombre.toLowerCase()} AND lower(${hijos.apellidos}) = ${apellidos.toLowerCase()}`).limit(1)
  const hijoId = existingChild[0]?.id ?? randomUUID()
  if (!existingChild[0]) await db.insert(hijos).values({ id: hijoId, nombre, apellidos })

  await db.insert(hijosUsuarios).values({ id: randomUUID(), userId: user.id, hijoId, claseId, parentesco }).onConflictDoNothing()
  revalidatePath('/admin')
}

export async function crearAgenda(formData: FormData) {
  await requireAdmin()
  const titulo = String(formData.get('titulo') ?? '').trim()
  const fechaInicio = String(formData.get('fechaInicio') ?? '')
  const claseId = String(formData.get('claseId') ?? '').trim() || null
  if (!titulo || !fechaInicio) throw new Error('Completa el título y la fecha')
  await db.insert(agenda).values({ id: randomUUID(), titulo, claseId, fechaInicio: new Date(fechaInicio) })
  revalidatePath('/admin')
}

export async function crearNoticia(formData: FormData) {
  await requireAdmin()
  const titulo = String(formData.get('titulo') ?? '').trim()
  const contenido = String(formData.get('contenido') ?? '').trim()
  const claseId = String(formData.get('claseId') ?? '').trim() || null
  if (!titulo || !contenido) throw new Error('Completa el título y el contenido')
  await db.insert(noticias).values({ id: randomUUID(), titulo, contenido, claseId, publicada: true })
  revalidatePath('/admin')
}

export async function crearMenu(formData: FormData) {
  await requireAdmin()
  const fecha = String(formData.get('fecha') ?? '')
  const platoPrincipal = String(formData.get('platoPrincipal') ?? '').trim()
  const claseId = String(formData.get('claseId') ?? '').trim() || null
  if (!fecha || !platoPrincipal) throw new Error('Completa la fecha y el plato principal')
  await db.insert(menuEscolar).values({ id: randomUUID(), fecha, platoPrincipal, claseId })
  revalidatePath('/admin')
}
