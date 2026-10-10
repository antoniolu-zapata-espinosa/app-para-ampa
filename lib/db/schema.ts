import { boolean, date, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

export const clases = pgTable('clases', {
  id: text('id').primaryKey(),
  nombre: text('nombre').notNull(),
  etapa: text('etapa').notNull(),
  cursoEscolar: text('curso_escolar').notNull(),
  activa: boolean('activa').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const hijos = pgTable('hijos', {
  id: text('id').primaryKey(),
  nombre: text('nombre').notNull(),
  apellidos: text('apellidos').notNull(),
  fechaNacimiento: date('fecha_nacimiento'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const hijosUsuarios = pgTable('hijos_usuarios', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  hijoId: text('hijo_id').notNull(),
  claseId: text('clase_id').notNull(),
  parentesco: text('parentesco').notNull().default('tutor'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('hijos_usuarios_user_hijo_unique').on(table.userId, table.hijoId),
  unique('hijos_usuarios_hijo_clase_user_unique').on(table.hijoId, table.claseId, table.userId),
])

export const agenda = pgTable('agenda', {
  id: text('id').primaryKey(),
  claseId: text('clase_id'),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  fechaInicio: timestamp('fecha_inicio', { withTimezone: true }).notNull(),
  fechaFin: timestamp('fecha_fin', { withTimezone: true }),
  ubicacion: text('ubicacion'),
  tipo: text('tipo').notNull().default('evento'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const noticias = pgTable('noticias', {
  id: text('id').primaryKey(),
  claseId: text('clase_id'),
  titulo: text('titulo').notNull(),
  contenido: text('contenido').notNull(),
  imagenUrl: text('imagen_url'),
  publicada: boolean('publicada').notNull().default(true),
  fechaPublicacion: timestamp('fecha_publicacion', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const menuEscolar = pgTable('menu_escolar', {
  id: text('id').primaryKey(),
  claseId: text('clase_id'),
  fecha: date('fecha').notNull(),
  platoPrincipal: text('plato_principal').notNull(),
  segundoPlato: text('segundo_plato'),
  postre: text('postre'),
  alergenos: text('alergenos'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [unique('menu_escolar_clase_fecha_unique').on(table.claseId, table.fecha)])

export type Clase = typeof clases.$inferSelect
export type AgendaItem = typeof agenda.$inferSelect
export type Noticia = typeof noticias.$inferSelect
export type MenuEscolar = typeof menuEscolar.$inferSelect
