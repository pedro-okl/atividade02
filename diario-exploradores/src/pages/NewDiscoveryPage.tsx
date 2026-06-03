import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { DiscoveryForm } from '../components/discovery/DiscoveryForm'
import { useToast } from '../context/ToastContext'
import { useDiscoveries } from '../hooks/useDiscoveries'
import type { NewDiscoveryInput } from '../types'

export function NewDiscoveryPage() {
  const navigate = useNavigate()
  const { createDiscovery } = useDiscoveries()
  const { showToast } = useToast()

  async function handleSubmit(input: NewDiscoveryInput) {
    try {
      const discovery = await createDiscovery(input)
      showToast('Descoberta salva.', 'success')
      navigate(`/discovery/${discovery.id}`)
    } catch {
      showToast('Erro ao salvar descoberta.', 'error')
    }
  }

  return (
    <section className="grid gap-4">
      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-emerald-800" to="/">
        <ArrowLeft className="size-4" />
        Voltar
      </Link>
      <div>
        <h2 className="text-2xl font-black text-stone-950">Nova descoberta</h2>
      </div>
      <DiscoveryForm onSubmit={handleSubmit} />
    </section>
  )
}
