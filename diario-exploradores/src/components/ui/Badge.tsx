import type { ReactNode } from 'react'
import type { RarityLevel, SyncStatus } from '../../types'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  )
}

export function CategoryBadge({ children }: { children: ReactNode }) {
  return (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-900">
      {children}
    </Badge>
  )
}

export function RarityBadge({ rarity }: { rarity: RarityLevel }) {
  const styles: Record<RarityLevel, string> = {
    Comum: 'border-green-200 bg-green-50 text-green-800',
    Rara: 'border-amber-200 bg-amber-50 text-amber-800',
    'Muito Rara': 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800',
  }

  return <Badge className={styles[rarity]}>{rarity}</Badge>
}

export function SyncBadge({ status }: { status: SyncStatus }) {
  const labels: Record<SyncStatus, string> = {
    pending: 'Pendente',
    synced: 'Sincronizado',
    error: 'Erro',
  }

  const styles: Record<SyncStatus, string> = {
    pending: 'border-amber-200 bg-amber-50 text-amber-800',
    synced: 'border-sky-200 bg-sky-50 text-sky-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
  }

  return <Badge className={styles[status]}>{labels[status]}</Badge>
}
