import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

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
        <WifiOff className="size-5" />
        Rede offline - {pendingCount} registros pendentes
      </div>
    )
  }

  if (isSyncing) {
    return (
      <div className="flex min-h-12 items-center gap-3 border-b border-amber-100 bg-amber-50 px-4 text-sm font-semibold text-amber-800">
        <RefreshCw className="size-5 animate-spin" />
        Rede online - sincronizando...
      </div>
    )
  }

  return (
    <div className="flex min-h-12 items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800">
      <Wifi className="size-5" />
      {pendingCount > 0
        ? `Rede online - ${pendingCount} pendentes`
        : 'Rede online - tudo sincronizado'}
    </div>
  )
}
