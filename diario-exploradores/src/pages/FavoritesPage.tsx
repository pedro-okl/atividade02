import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DiscoveryCard } from '../components/discovery/DiscoveryCard'
import { DiscoverySkeleton } from '../components/discovery/DiscoverySkeleton'
import { SearchBar } from '../components/ui/SearchBar'
import { useToast } from '../context/ToastContext'
import { useDiscoveries } from '../hooks/useDiscoveries'

export function FavoritesPage() {
  const [query, setQuery] = useState('')
  const { loading, searchDiscoveries, toggleFavorite } = useDiscoveries()
  const { showToast } = useToast()
  const favorites = useMemo(
    () => searchDiscoveries(query, true),
    [query, searchDiscoveries],
  )

  async function handleFavorite(id: string) {
    await toggleFavorite(id)
    showToast('Tesouros atualizados.', 'success')
  }

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-black text-stone-950">
          Tesouros da expedição
        </h2>
        <p className="text-sm font-medium text-stone-600">
          {favorites.length} achado{favorites.length === 1 ? '' : 's'} lendário
          {favorites.length === 1 ? '' : 's'}
        </p>
      </div>
      <SearchBar onChange={setQuery} value={query} />

      {loading ? <DiscoverySkeleton /> : null}

      {!loading && favorites.length === 0 ? (
        <section className="grid min-h-64 place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center">
          <div>
            <Star className="mx-auto size-10 text-amber-500" />
            <h2 className="mt-3 text-lg font-black text-stone-950">
              Nenhum tesouro marcado ainda.
            </h2>
          </div>
        </section>
      ) : null}

      {!loading && favorites.length > 0 ? (
        <div className="grid gap-3">
          {favorites.map((discovery) => (
            <DiscoveryCard
              discovery={discovery}
              key={discovery.id}
              onToggleFavorite={(id) => void handleFavorite(id)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
