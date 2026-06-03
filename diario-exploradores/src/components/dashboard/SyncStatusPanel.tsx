import { Cloud, CloudOff, RefreshCw } from 'lucide-react'

interface SyncStatusPanelProps {
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
}

export function SyncStatusPanel({
  isOnline,
  isSyncing,
  pendingCount,
}: SyncStatusPanelProps) {
  if (!isOnline) {
    return (
      <div className="flex min-h-12 items-center gap-3 border-b border-rose-100 bg-rose-50 px-4 text-sm font-semibold text-rose-800">
        <CloudOff className="size-5" />
        Offline - {pendingCount} registros pendentes
      </div>
    )
  }

  if (isSyncing) {
    return (
      <div className="flex min-h-12 items-center gap-3 border-b border-amber-100 bg-amber-50 px-4 text-sm font-semibold text-amber-800">
        <RefreshCw className="size-5 animate-spin" />
        Online - sincronizando...
      </div>
    )
  }

  return (
    <div className="flex min-h-12 items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800">
      <Cloud className="size-5" />
      {pendingCount > 0 ? `Online - ${pendingCount} pendentes` : 'Tudo sincronizado'}
    </div>
  )
}
