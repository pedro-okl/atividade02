import { ArrowLeft, CalendarDays, Edit3, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CategoryBadge, RarityBadge, SyncBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../context/ToastContext'
import { useDiscoveries } from '../hooks/useDiscoveries'
import { formatDateTime } from '../utils/format'

export function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deleteDiscovery, discoveries, toggleFavorite } = useDiscoveries()
  const { showToast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const discovery = useMemo(
    () => discoveries.find((item) => item.id === id),
    [discoveries, id],
  )

  if (!discovery) {
    return (
      <section className="grid gap-4">
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800" to="/">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center">
          <h2 className="text-lg font-black text-stone-950">Registro não encontrado</h2>
        </div>
      </section>
    )
  }

  async function handleDelete() {
    if (!discovery) {
      return
    }

    await deleteDiscovery(discovery.id)
    showToast('Descoberta excluída.', 'success')
    navigate('/')
  }

  async function handleFavorite() {
    if (!discovery) {
      return
    }

    await toggleFavorite(discovery.id)
    showToast('Favoritos atualizados.', 'success')
  }

  return (
    <section className="grid gap-4">
      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800" to="/">
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      {discovery.photos.length > 0 ? (
        <div className="flex snap-x gap-3 overflow-x-auto pb-1">
          {discovery.photos.map((photo, index) => (
            <img
              alt={`Foto ${index + 1} de ${discovery.title}`}
              className="aspect-[4/3] w-[82%] shrink-0 snap-center rounded-lg object-cover shadow-sm"
              key={photo}
              src={photo}
            />
          ))}
        </div>
      ) : null}

      <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge>{discovery.category}</CategoryBadge>
          <RarityBadge rarity={discovery.rarity} />
          <SyncBadge status={discovery.syncStatus} />
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight text-stone-950">
          {discovery.title}
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {discovery.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-stone-500">
          <CalendarDays className="size-4" />
          Criado em {formatDateTime(discovery.createdAt)}
        </div>
        <div className="mt-2 text-sm font-semibold text-stone-500">
          Atualizado em {formatDateTime(discovery.updatedAt)}
        </div>
      </article>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => void handleFavorite()} variant="secondary">
          <Star className="size-4" fill={discovery.isFavorite ? 'currentColor' : 'none'} />
          {discovery.isFavorite ? 'Favorita' : 'Favoritar'}
        </Button>
        <Button onClick={() => navigate(`/discovery/${discovery.id}/edit`)} variant="secondary">
          <Edit3 className="size-4" />
          Editar
        </Button>
      </div>
      <Button onClick={() => setIsDeleting(true)} variant="danger">
        <Trash2 className="size-4" />
        Excluir descoberta
      </Button>

      <Modal
        confirmLabel="Excluir"
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={() => void handleDelete()}
        title="Excluir descoberta?"
      >
        Esta ação remove o registro e todas as fotos anexadas.
      </Modal>
    </section>
  )
}
