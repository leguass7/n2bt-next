export type Route = {
  id: string
  path?: string
  label: string
}
export const adminRoutes: Route[] = [
  { id: 'admin.menu.site', path: '/', label: 'Site' },
  { id: 'admin.menu.index', path: '/admin', label: 'Página inicial' },
  { id: 'admin.menu.users', path: '/admin/users', label: 'Cadastro de Atletas' },
  { id: 'admin.menu.arenas', path: '/admin/arenas', label: 'Cadastro de Arenas' },
  { id: 'admin.menu.tournaments', path: '/admin/tournaments', label: 'Torneios' }
]
