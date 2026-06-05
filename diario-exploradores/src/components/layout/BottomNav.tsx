import { BarChart2, Home, PlusCircle, Star } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { icon: Home, label: 'Códice', to: '/' },
  { icon: Star, label: 'Tesouros', to: '/favorites' },
  { icon: BarChart2, label: 'Expedição', to: '/dashboard' },
  { icon: PlusCircle, label: 'Registrar', to: '/new' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-20 max-w-md grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              className={({ isActive }) =>
                `grid min-h-16 place-items-center gap-1 rounded-lg px-1 py-2 text-xs font-bold ${
                  isActive ? 'text-emerald-800' : 'text-stone-500'
                }`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              <Icon className="size-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
