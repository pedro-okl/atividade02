import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DiscoveryForm } from '../components/discovery/DiscoveryForm'
import { useToast } from '../context/ToastContext'
import { useDiscoveries } from '../hooks/useDiscoveries'
import type { NewDiscoveryInput } from '../types'

export function EditDiscoveryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { discoveries, updateDiscovery } = useDiscoveries()
  const { showToast } = useToast()
  const discovery = discoveries.find((item) => item.id === id)

  async function handleSubmit(input: NewDiscoveryInput) {
    if (!discovery) {
      return
    }

    try {
      await updateDiscovery(discovery.id, input)
      showToast('Achado atualizado.', 'success')
      navigate(`/discovery/${discovery.id}`)
    } catch {
      showToast('Erro ao atualizar achado.', 'error')
    }
  }

  if (!discovery) {
    return (
      <section className="grid gap-4">
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800" to="/">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-center">
          <h2 className="text-lg font-black text-stone-950">
            Achado não encontrado
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-4">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800"
        to={`/discovery/${discovery.id}`}
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>
      <div>
        <h2 className="text-2xl font-black text-stone-950">
          Revisar achado
        </h2>
      </div>
      <DiscoveryForm
        initialValue={discovery}
        onSubmit={handleSubmit}
        submitLabel="Atualizar achado"
      />
    </section>
  )
}
