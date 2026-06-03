import { Camera, ChevronRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Discovery } from '../../types'
import { formatDate } from '../../utils/format'
import { CategoryBadge, RarityBadge, SyncBadge } from '../ui/Badge'

interface DiscoveryCardProps {
  discovery: Discovery
  onToggleFavorite: (id: string) => void
}

export function DiscoveryCard({ discovery, onToggleFavorite }: DiscoveryCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Link className="min-w-0 flex-1" to={`/discovery/${discovery.id}`}>
          <div className="flex flex-wrap gap-2">
            <CategoryBadge>{discovery.category}</CategoryBadge>
            <RarityBadge rarity={discovery.rarity} />
          </div>
          <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-tight text-stone-950">
            {discovery.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">
            {discovery.description}
          </p>
        </Link>
        <button
          aria-label={discovery.isFavorite ? 'Remover dos favoritos' : 'Favoritar descoberta'}
          className="grid size-11 shrink-0 place-items-center rounded-lg border border-stone-200 text-amber-600"
          onClick={() => onToggleFavorite(discovery.id)}
          type="button"
        >
          <Star
            className="size-5"
            fill={discovery.isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
        <span>{formatDate(discovery.createdAt)}</span>
        {discovery.photos.length > 0 ? (
          <span className="inline-flex items-center gap-1">
            <Camera className="size-4" />
            {discovery.photos.length}
          </span>
        ) : null}
        <SyncBadge status={discovery.syncStatus} />
        <Link
          aria-label={`Abrir ${discovery.title}`}
          className="ml-auto grid size-9 place-items-center rounded-md text-emerald-800"
          to={`/discovery/${discovery.id}`}
        >
          <ChevronRight className="size-5" />
        </Link>
      </div>
    </article>
  )
}
