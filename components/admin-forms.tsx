'use client'

import { useState } from 'react'
import { crearAgenda, crearClase, crearMenu, crearNoticia } from '@/app/actions/admin'

function FormCard({ title, children, action }: { title: string; children: React.ReactNode; action: (data: FormData) => Promise<void> }) {
  const [message, setMessage] = useState('')
  return <form action={async (data) => { try { await action(data); setMessage('Guardado correctamente'); (document.activeElement as HTMLElement)?.blur() } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo guardar') } }} className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-[0_8px_25px_rgba(33,61,59,0.06)]">
    <h2 className="font-serif text-xl font-semibold text-[#245a56]">{title}</h2>
    <div className="mt-4 flex flex-col gap-3">{children}</div>
    <button type="submit" className="mt-5 rounded-full bg-[#174c4e] px-4 py-2 text-xs font-bold text-white">Guardar dato</button>
    {message && <p className="mt-3 text-xs font-semibold text-[#23645f]" role="status">{message}</p>}
  </form>
}

const inputClass = 'rounded-2xl border border-[#d8e5df] bg-[#fbfcfa] px-3 py-2 text-sm outline-none focus:border-[#4c8473]'

export function AdminForms() {
  return <section className="mt-8 grid gap-4 lg:grid-cols-2">
    <FormCard title="Añadir clase" action={crearClase}>
      <input className={inputClass} name="nombre" placeholder="Ej. 3º Primaria A" required aria-label="Nombre de la clase" />
      <input className={inputClass} name="etapa" placeholder="Ej. Primaria" required aria-label="Etapa" />
      <input className={inputClass} name="cursoEscolar" placeholder="Ej. 2026-2027" required aria-label="Curso escolar" />
    </FormCard>
    <FormCard title="Añadir agenda" action={crearAgenda}>
      <input className={inputClass} name="titulo" placeholder="Título del evento" required aria-label="Título" />
      <input className={inputClass} name="fechaInicio" type="datetime-local" required aria-label="Fecha y hora" />
      <input className={inputClass} name="claseId" placeholder="ID de clase (opcional; vacío = todo el colegio)" aria-label="ID de clase" />
    </FormCard>
    <FormCard title="Añadir noticia" action={crearNoticia}>
      <input className={inputClass} name="titulo" placeholder="Título de la noticia" required aria-label="Título" />
      <textarea className={inputClass} name="contenido" placeholder="Contenido" required aria-label="Contenido" rows={4} />
      <input className={inputClass} name="claseId" placeholder="ID de clase (opcional)" aria-label="ID de clase" />
    </FormCard>
    <FormCard title="Añadir menú escolar" action={crearMenu}>
      <input className={inputClass} name="fecha" type="date" required aria-label="Fecha" />
      <input className={inputClass} name="platoPrincipal" placeholder="Plato principal" required aria-label="Plato principal" />
      <input className={inputClass} name="claseId" placeholder="ID de clase (opcional)" aria-label="ID de clase" />
    </FormCard>
  </section>
}
