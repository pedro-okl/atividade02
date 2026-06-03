import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onChange: (value: string) => void
  value: string
}

export function SearchBar({ onChange, value }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-stone-500"
      />
      <input
        aria-label="Buscar descobertas"
        className="min-h-12 w-full rounded-lg border border-stone-300 bg-white pl-10 pr-11 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por título, descrição ou categoria"
        type="search"
        value={value}
      />
      {value ? (
        <button
          aria-label="Limpar busca"
          className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-stone-500"
          onClick={() => onChange('')}
          type="button"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
