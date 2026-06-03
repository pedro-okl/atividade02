import { Compass } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-[#f7f4ea] px-4 py-4">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-emerald-800 text-white shadow-sm">
          <Compass className="size-6" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-black leading-tight text-stone-950">
            Diário de Bordo
          </h1>
        </div>
      </div>
    </header>
  )
}
