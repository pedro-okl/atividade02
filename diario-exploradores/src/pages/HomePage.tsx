import { PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DiscoveryCard } from '../components/discovery/DiscoveryCard'
import { DiscoverySkeleton } from '../components/discovery/DiscoverySkeleton'
import { SearchBar } from '../components/ui/SearchBar'
import { useDiscoveries } from '../hooks/useDiscoveries'
import { useToast } from '../context/ToastContext'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { loading, searchDiscoveries, toggleFavorite } = useDiscoveries()
  const { showToast } = useToast()
  const discoveries = useMemo(
    () => searchDiscoveries(query),
    [query, searchDiscoveries],
  )

  async function handleFavorite(id: string) {
    await toggleFavorite(id)
    showToast('Favoritos atualizados.', 'success')
  }

  return (
    <>
      <section className="grid gap-3">
        <div>
          <h2 className="text-2xl font-black text-stone-950">Descobertas</h2>
          <p className="text-sm font-medium text-stone-600">
            {discoveries.length} registro{discoveries.length === 1 ? '' : 's'} encontrado
            {discoveries.length === 1 ? '' : 's'}
          </p>
        </div>
        <SearchBar onChange={setQuery} value={query} />
      </section>

      {loading ? <DiscoverySkeleton /> : null}

      {!loading && discoveries.length === 0 ? (
        <section className="grid min-h-64 place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center">
          <div>
            <h2 className="text-lg font-black text-stone-950">Nenhuma descoberta</h2>
            <p className="mt-2 text-sm text-stone-600">
              Registre a primeira observação científica da expedição.
            </p>
          </div>
        </section>
      ) : null}

      {!loading && discoveries.length > 0 ? (
        <section className="grid gap-3">
          {discoveries.map((discovery) => (
            <DiscoveryCard
              discovery={discovery}
              key={discovery.id}
              onToggleFavorite={(id) => void handleFavorite(id)}
            />
          ))}
        </section>
      ) : null}

      <Link
        aria-label="Nova descoberta"
        className="fixed bottom-24 right-4 z-30 grid size-14 place-items-center rounded-full bg-emerald-800 text-white shadow-xl"
        to="/new"
      >
        <PlusCircle className="size-7" />
      </Link>
    </>
  )
}
