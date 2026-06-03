import { Outlet } from 'react-router-dom'
import { SyncStatusPanel } from '../dashboard/SyncStatusPanel'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { useSync } from '../../hooks/useSync'

export function Layout() {
  const sync = useSync()

  return (
    <div className="min-h-svh bg-[#f7f4ea] text-stone-900">
      <Header />
      <SyncStatusPanel
        isOnline={sync.isOnline}
        isSyncing={sync.isSyncing}
        pendingCount={sync.pendingCount}
      />
      <main className="mx-auto grid max-w-md gap-4 px-4 pb-28 pt-4">
        <Outlet context={{ lastSyncedAt: sync.lastSyncedAt }} />
      </main>
      <BottomNav />
    </div>
  )
}
