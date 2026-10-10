'use server'

import { auth, ADMIN_EMAIL } from '@/lib/auth'
import { db } from '@/lib/db'
import { agenda, clases, menuEscolar, noticias } from '@/lib/db/schema'
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
