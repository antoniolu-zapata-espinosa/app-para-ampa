'use client'

import { useState } from 'react'
import { asociarPadreAClase, crearAgenda, crearMenu, crearNoticia } from '@/app/actions/admin'

type ClassOption = { id: string; nombre: string; etapa: string; cursoEscolar: string }

function FormCard({ title, children, action }: { title: string; children: React.ReactNode; action: (data: FormData) => Promise<void> }) {
  const [message, setMessage] = useState('')
  const [isPending, setIsPending] = useState(false)
  async function handleSubmit(data: FormData) {
    setIsPending(true)
    setMessage('')
    try {
      await action(data)
      setMessage('Guardado correctamente')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar')
    } finally {
      setIsPending(false)
    }
  }
  return <form action={handleSubmit} className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-[0_8px_25px_rgba(33,61,59,0.06)]">
    <h2 className="font-serif text-xl font-semibold text-[#245a56]">{title}</h2>
    <div className="mt-4 flex flex-col gap-3">{children}</div>
    <button type="submit" disabled={isPending} className="mt-5 rounded-full bg-[#174c4e] px-4 py-2 text-xs font-bold text-white disabled:cursor-wait disabled:opacity-60">{isPending ? 'Guardando…' : 'Guardar dato'}</button>
    {message && <p className="mt-3 text-xs font-semibold text-[#23645f]" role="status">{message}</p>}
  </form>
}

const inputClass = 'rounded-2xl border border-[#d8e5df] bg-[#fbfcfa] px-3 py-2 text-sm outline-none focus:border-[#4c8473]'

export function AdminForms({ classes }: { classes: ClassOption[] }) {
  return <section id="asociaciones" aria-labelledby="asociaciones-title" className="mt-8 scroll-mt-6 grid gap-4 lg:grid-cols-2">
    <div className="lg:col-span-2">
      <h2 id="asociaciones-title" className="font-serif text-2xl font-semibold text-[#245a56]">Gestión de asociaciones</h2>
      <p className="mt-2 text-sm text-[#6d8981]">Selecciona el curso estable del colegio y vincula cada familia con su hijo. No es necesario crear las clases cada año.</p>
    </div>
    <FormCard title="Asociar padre o madre a una clase" action={asociarPadreAClase}>
      <input className={inputClass} name="email" type="email" placeholder="Correo de la cuenta del padre o madre" required aria-label="Correo del padre o madre" />
      <input className={inputClass} name="nombre" placeholder="Nombre del alumno" required aria-label="Nombre del alumno" />
      <input className={inputClass} name="apellidos" placeholder="Apellidos del alumno" required aria-label="Apellidos del alumno" />
      <select className={inputClass} name="claseId" required aria-label="Clase">
        <option value="">Selecciona una clase</option>
        {classes.map((item) => <option key={item.id} value={item.id} data-name={item.nombre}>{item.nombre} · {item.etapa}</option>)}
      </select>
      <select className={inputClass} name="parentesco" defaultValue="tutor" aria-label="Parentesco">
        <option value="tutor">Tutor/a</option><option value="padre">Padre</option><option value="madre">Madre</option>
      </select>
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
