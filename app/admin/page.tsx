import { auth, ADMIN_EMAIL } from '@/lib/auth'
import { AdminForms } from '@/components/admin-forms'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { clases } from '@/lib/db/schema'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in?redirect=/admin')
  if (session.user.email.toLowerCase() !== ADMIN_EMAIL) redirect('/')
  const classOptions = await db.select({ id: clases.id, nombre: clases.nombre, etapa: clases.etapa, cursoEscolar: clases.cursoEscolar }).from(clases)

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-6 py-10 text-[#263238]">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4c8473]">AMPA CEIP Reino de Murcia</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h1 className="font-serif text-4xl font-semibold text-[#174c4e]">Panel de administración</h1><p className="mt-2 text-sm text-[#728187]">Añade y organiza la información que verá cada familia.</p></div>
          <span className="rounded-full bg-[#d9eee4] px-3 py-2 text-xs font-semibold text-[#23645f]">Administrador autorizado</span>
        </div>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Clases', 'Crea cursos y asigna familias'],
            ['Agenda', 'Publica eventos por clase'],
            ['Noticias', 'Comparte avisos importantes'],
            ['Menú escolar', 'Añade los menús diarios'],
          ].map(([title, description]) => <article key={title} className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-[0_8px_25px_rgba(33,61,59,0.06)]"><h2 className="font-serif text-xl font-semibold text-[#245a56]">{title}</h2><p className="mt-2 text-sm leading-relaxed text-[#7b898e]">{description}</p><button className="mt-5 rounded-full bg-[#174c4e] px-4 py-2 text-xs font-bold text-white">Añadir</button></article>)}
        </section>
        <section className="mt-8 rounded-3xl border border-[#d9e7df] bg-[#eaf4ef] p-6"><h2 className="font-serif text-2xl font-semibold text-[#245a56]">Familias y clases</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6d8981]">Desde aquí podrás crear las clases, registrar hijos y asociarlos a sus padres, madres o tutores. La aplicación mostrará a cada familia únicamente la agenda y los avisos de sus clases.</p><a href="#asociaciones" className="mt-5 inline-flex rounded-full border border-[#9fc8b8] bg-white px-4 py-2 text-xs font-bold text-[#23645f] transition-colors hover:bg-[#d9eee4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23645f]">Gestionar asociaciones</a></section>
        <AdminForms classes={classOptions} />
      </div>
    </main>
  )
}
