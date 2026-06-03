import { useOutletContext } from 'react-router-dom'
import { StatsCard } from '../components/dashboard/StatsCard'
import { useDiscoveries } from '../hooks/useDiscoveries'
import { DISCOVERY_CATEGORIES, RARITY_LEVELS } from '../types'
import { formatDateTime } from '../utils/format'

interface OutletContext {
  lastSyncedAt: string | null
}

export function DashboardPage() {
  const { discoveries } = useDiscoveries()
  const { lastSyncedAt } = useOutletContext<OutletContext>()
  const total = discoveries.length
  const synced = discoveries.filter((item) => item.syncStatus === 'synced').length
  const syncPercent = total === 0 ? 0 : Math.round((synced / total) * 100)

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-2xl font-black text-stone-950">Dashboard</h2>
        <p className="text-sm font-medium text-stone-600">
          Última sincronização: {formatDateTime(lastSyncedAt)}
        </p>
      </div>

      <StatsCard label="Total de descobertas" value={total} />

      <StatsCard label="% sincronizado" value={`${syncPercent}%`}>
        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-700 transition-all"
            style={{ width: `${syncPercent}%` }}
          />
        </div>
      </StatsCard>

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wide text-stone-600">
          Por categoria
        </h3>
        <div className="mt-3 grid gap-2">
          {DISCOVERY_CATEGORIES.map((category) => (
            <div className="flex items-center justify-between gap-3 text-sm" key={category}>
              <span className="font-semibold text-stone-700">{category}</span>
              <strong className="text-stone-950">
                {discoveries.filter((item) => item.category === category).length}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wide text-stone-600">
          Por raridade
        </h3>
        <div className="mt-3 grid gap-2">
          {RARITY_LEVELS.map((rarity) => (
            <div className="flex items-center justify-between gap-3 text-sm" key={rarity}>
              <span className="font-semibold text-stone-700">{rarity}</span>
              <strong className="text-stone-950">
                {discoveries.filter((item) => item.rarity === rarity).length}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
