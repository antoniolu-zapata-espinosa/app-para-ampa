'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  Heart,
  Home,
  Menu,
  MessageCircle,
  Newspaper,
  School,
  Sparkles,
  Users,
  Utensils,
} from 'lucide-react'

const sections = [
  { id: 'agenda', label: 'Agenda', icon: CalendarDays, tone: 'mint' },
  { id: 'noticias', label: 'Noticias', icon: Newspaper, tone: 'peach' },
  { id: 'colegio', label: 'Colegio', icon: School, tone: 'lavender' },
  { id: 'menu', label: 'Menú', icon: Utensils, tone: 'yellow' },
]

const events = [
  { day: '18', month: 'OCT', title: 'Asamblea general de familias', meta: '18:00 · Salón de actos', color: 'coral' },
  { day: '21', month: 'OCT', title: 'Taller de primeros auxilios', meta: '16:30 · Aula multiusos', color: 'blue' },
]

const news = [
  { tag: 'AMPA', title: '¡Ya está aquí la fiesta de otoño!', text: 'Apunta la fecha y ven a disfrutar de una tarde en familia.', date: '12 oct', icon: Sparkles, tone: 'peach' },
  { tag: 'Comunidad', title: 'Nueva biblioteca viajera', text: 'Un rincón para compartir historias y descubrir nuevas lecturas.', date: '08 oct', icon: Heart, tone: 'mint' },
]

type FamilyChild = {
  id: string
  nombre: string
  apellidos: string
  claseId: string
  claseNombre: string
  etapa: string
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function HomeClient({ children }: { children: FamilyChild[] }) {
  const [active, setActive] = useState('inicio')
  const [notice, setNotice] = useState('')
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? '')
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? children[0]
  const selectedClass = selectedChild ? `${selectedChild.claseNombre} · ${selectedChild.etapa}` : 'Sin clase asignada'
  const classes = children.length ? children : [{ id: 'none', nombre: 'Sin alumno asociado', apellidos: '', claseId: '', claseNombre: 'Sin clase asignada', etapa: '' }]

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#263238]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#f7f7f4] shadow-[0_0_40px_rgba(29,48,52,0.08)]">
        <header className="bg-[#174c4e] px-6 pb-7 pt-7 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-14 items-center justify-center overflow-hidden rounded-[17px] bg-white shadow-sm">
                <img src="/logo-reino-murcia.png" alt="CEIP Colegio Bilingüe Reino de Murcia" className="size-full object-contain" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#b8d9ce]">AMPA</p>
                <h1 className="font-serif text-[22px] leading-tight">CEIP Reino de Murcia</h1>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/sign-up" className="rounded-full bg-[#f3c78c] px-3 py-2 text-[10px] font-bold text-[#174c4e] transition hover:bg-[#f8d9aa]">
                Acceso AMPA
              </Link>
              <button aria-label="Ver notificaciones" onClick={() => showNotice('No tienes notificaciones nuevas')} className="relative rounded-full p-2 transition hover:bg-white/10">
                <Bell className="size-5" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#f3c78c] ring-2 ring-[#174c4e]" />
              </button>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-[#b8d9ce]">{getGreeting()}</p>
            <h2 className="mt-1 font-serif text-[30px] leading-tight tracking-[-0.02em]">Todo lo que pasa<br />en nuestro cole.</h2>
          </div>
        </header>

        <div className="px-5 pb-28 pt-5">
          <section className="rounded-[22px] border border-[#d9e7df] bg-[#eaf4ef] p-4 shadow-[0_5px_18px_rgba(33,61,59,0.04)]" aria-labelledby="class-selector-title">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4c8473]">Tu familia</p>
                <h2 id="class-selector-title" className="mt-1 font-serif text-[19px] font-semibold text-[#245a56]">Contenido de mi clase</h2>
              </div>
              <GraduationCap className="size-6 text-[#4c8473]" />
            </div>
            <label htmlFor="child-select" className="sr-only">Selecciona el alumno</label>
            <select id="child-select" value={selectedChildId} onChange={(event) => { setSelectedChildId(event.target.value); const child = children.find((item) => item.id === event.target.value); if (child) showNotice(`Mostrando la clase de ${child.nombre}`) }} className="mt-3 w-full appearance-none rounded-[14px] border border-[#c5ddd1] bg-white px-3.5 py-3 text-sm font-semibold text-[#315d59] outline-none transition focus:border-[#4c8473] focus:ring-2 focus:ring-[#b9d9ca]">
              {classes.map((child) => <option key={child.id} value={child.id}>{child.nombre} {child.apellidos} · {child.claseNombre}</option>)}
            </select>
            <p className="mt-2 text-[11px] text-[#6d8981]">{children.length > 1 ? 'Selecciona qué hijo quieres consultar.' : 'Verás aquí la agenda, avisos y menú de su clase.'}</p>
          </section>

          <section className="mt-8" aria-label="Accesos rápidos">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-[20px] font-semibold">Explora</h2>
              <span className="text-xs font-medium text-[#728187]">Accesos rápidos</span>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {sections.map(({ id, label, icon: Icon, tone }) => (
                <button key={id} onClick={() => { setActive(id); showNotice(`${label}: sección seleccionada`) }} className="group flex flex-col items-center gap-2 text-center">
                  <span className={`flex size-[61px] items-center justify-center rounded-[20px] transition group-hover:-translate-y-0.5 ${tone === 'mint' ? 'bg-[#d9eee4] text-[#23645f]' : tone === 'peach' ? 'bg-[#fbe0ce] text-[#b65c45]' : tone === 'lavender' ? 'bg-[#e4e1f3] text-[#655a92]' : 'bg-[#f7e9b9] text-[#98762d]'}`}>
                    <Icon className="size-[23px]" strokeWidth={1.8} />
                  </span>
                  <span className="text-[11px] font-semibold text-[#526268]">{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="next-event">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="next-event" className="font-serif text-[20px] font-semibold">Próximamente · {selectedClass}</h2>
              <button onClick={() => { setActive('agenda'); showNotice('Abriendo agenda completa') }} className="flex items-center gap-1 text-xs font-semibold text-[#23645f]">Ver agenda <ArrowRight className="size-3.5" /></button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {events.map((event) => (
                <button key={event.title} onClick={() => showNotice(event.title)} className="flex min-w-[265px] items-center gap-3 rounded-[21px] border border-black/[0.04] bg-white p-3 text-left shadow-[0_6px_20px_rgba(33,61,59,0.06)] transition hover:-translate-y-0.5">
                  <span className={`flex size-[53px] shrink-0 flex-col items-center justify-center rounded-[16px] ${event.color === 'coral' ? 'bg-[#fbe0ce] text-[#b65c45]' : 'bg-[#dcecf0] text-[#3f7582]'}`}>
                    <strong className="font-serif text-[22px] leading-none">{event.day}</strong>
                    <small className="mt-1 text-[9px] font-bold tracking-wider">{event.month}</small>
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-[13px] font-bold text-[#304146]">{event.title}</strong>
                    <span className="mt-1 flex items-center gap-1 text-[11px] text-[#7b898e]"><Clock3 className="size-3" />{event.meta}</span>
                  </span>
                  <ChevronRight className="ml-auto size-4 shrink-0 text-[#a3afb1]" />
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="latest-news">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="latest-news" className="font-serif text-[20px] font-semibold">Últimas noticias</h2>
              <button onClick={() => { setActive('noticias'); showNotice('Abriendo todas las noticias') }} className="text-xs font-semibold text-[#23645f]">Ver todas</button>
            </div>
            <div className="flex flex-col gap-3">
              {news.map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.title} onClick={() => showNotice(item.title)} className="flex gap-3 rounded-[21px] border border-black/[0.04] bg-white p-3.5 text-left shadow-[0_6px_20px_rgba(33,61,59,0.05)] transition hover:-translate-y-0.5">
                    <span className={`flex size-[54px] shrink-0 items-center justify-center rounded-[17px] ${item.tone === 'peach' ? 'bg-[#fbe0ce] text-[#b65c45]' : 'bg-[#d9eee4] text-[#23645f]'}`}><Icon className="size-6" strokeWidth={1.8} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b65c45]">{item.tag}</span><span className="text-[10px] text-[#9aa5a7]">{item.date}</span></span>
                      <strong className="mt-1 block text-[14px] font-bold leading-snug text-[#304146]">{item.title}</strong>
                      <span className="mt-1 block text-[12px] leading-relaxed text-[#7b898e]">{item.text}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-8 rounded-[24px] bg-[#f0e7d5] p-5" aria-labelledby="school-info">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ad7a37]">Nuestro cole</p>
                <h2 id="school-info" className="mt-1 font-serif text-[21px] font-semibold text-[#604d2f]">Una comunidad que crece junta.</h2>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-[#f8f1e4] text-[#ad7a37]"><Users className="size-5" /></span>
            </div>
            <p className="mt-2 max-w-[300px] text-[12px] leading-relaxed text-[#806d52]">Conoce nuestro proyecto educativo, servicios y las personas que hacen posible el día a día.</p>
            <button onClick={() => { setActive('colegio'); showNotice('Abriendo información del colegio') }} className="mt-4 flex items-center gap-1 text-xs font-bold text-[#8c642e]">Conocer el colegio <ArrowRight className="size-3.5" /></button>
          </section>
        </div>

        <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-[#e7e8e3] bg-[#fffefa]/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md" aria-label="Navegación principal">
          {[
            { id: 'inicio', label: 'Inicio', icon: Home },
            { id: 'agenda', label: 'Agenda', icon: CalendarDays },
            { id: 'contacto', label: 'Contacto', icon: MessageCircle },
            { id: 'mas', label: 'Más', icon: Menu },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActive(id); showNotice(id === 'inicio' ? 'Ya estás en inicio' : `${label}: sección seleccionada`) }} className={`flex min-w-[58px] flex-col items-center gap-1 text-[10px] font-semibold transition ${active === id ? 'text-[#23645f]' : 'text-[#96a1a3]'}`}>
              <span className={`flex size-8 items-center justify-center rounded-full ${active === id ? 'bg-[#d9eee4]' : ''}`}><Icon className="size-[19px]" strokeWidth={active === id ? 2.3 : 1.8} /></span>
              {label}
            </button>
          ))}
        </nav>

        {notice && <div role="status" className="fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#174c4e] px-4 py-2.5 text-xs font-semibold text-white shadow-lg">{notice}</div>}
      </div>
    </main>
  )
}


