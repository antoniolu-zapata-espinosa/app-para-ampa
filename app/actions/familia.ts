'use server'

import { and, asc, desc, eq, isNull, or } from 'drizzle-orm'
import { db } from '@/lib/db'
import { agenda, clases, hijos, hijosUsuarios, menuEscolar, noticias } from '@/lib/db/schema'

export async function obtenerHijosDeFamilia(userId: string) {
  return db
    .select({
      id: hijos.id,
      nombre: hijos.nombre,
      apellidos: hijos.apellidos,
      claseId: hijosUsuarios.claseId,
      claseNombre: clases.nombre,
      etapa: clases.etapa,
    })
    .from(hijosUsuarios)
    .innerJoin(hijos, eq(hijosUsuarios.hijoId, hijos.id))
    .innerJoin(clases, eq(hijosUsuarios.claseId, clases.id))
    .where(eq(hijosUsuarios.userId, userId))
    .orderBy(asc(hijos.nombre), asc(hijos.apellidos))
}

export async function obtenerClases() {
  return db.select().from(clases).where(eq(clases.activa, true)).orderBy(asc(clases.nombre))
}

export async function obtenerContenidoDeFamilia(userId: string, claseId: string) {
  const pertenencia = await db.select({ id: hijosUsuarios.id }).from(hijosUsuarios).where(and(eq(hijosUsuarios.userId, userId), eq(hijosUsuarios.claseId, claseId))).limit(1)
  if (!pertenencia.length) throw new Error('No tienes acceso a esta clase')

  const [eventos, avisos, menu] = await Promise.all([
    db.select().from(agenda).where(or(eq(agenda.claseId, claseId), isNull(agenda.claseId))).orderBy(asc(agenda.fechaInicio)),
    db.select().from(noticias).where(and(eq(noticias.publicada, true), or(eq(noticias.claseId, claseId), isNull(noticias.claseId)))).orderBy(desc(noticias.fechaPublicacion)),
    db.select().from(menuEscolar).where(or(eq(menuEscolar.claseId, claseId), isNull(menuEscolar.claseId))).orderBy(asc(menuEscolar.fecha)),
  ])

  return { eventos, avisos, menu }
}
