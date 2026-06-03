import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getPendingDeletedDiscoveries,
  getPendingDiscoveries,
  mergeRemoteDiscoveries,
  removeDeletedDiscoveries,
  saveSyncedDiscoveries,
  updateDeletedSyncStatus,
  updateSyncStatus,
} from '../db/database'
import { useDiscoveries } from './useDiscoveries'
import { useNetworkStatus } from './useNetworkStatus'
import { useToast } from '../context/ToastContext'
import {
  deleteDiscoveriesFromSupabase,
  fetchDiscoveriesFromSupabase,
  isSupabaseConfigured,
  syncDiscoveriesToSupabase,
} from '../services/supabase'

export function useSync() {
  const isOnline = useNetworkStatus()
  const { discoveries, refreshDiscoveries } = useDiscoveries()
  const { showToast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const hasLoadedRemoteRef = useRef(false)
  const isSyncingRef = useRef(false)

  const pendingCount = useMemo(
    () =>
      discoveries.filter((discovery) => discovery.syncStatus !== 'synced')
        .length,
    [discoveries],
  )

  const syncPending = useCallback(async (options?: { silent?: boolean }) => {
    if (!isOnline || isSyncingRef.current) {
      return
    }

    const pending = await getPendingDiscoveries()
    const pendingDeletes = await getPendingDeletedDiscoveries()

    if (!isSupabaseConfigured()) {
      if (!options?.silent && (pending.length > 0 || pendingDeletes.length > 0)) {
        showToast('Configure o Supabase para sincronizar online.', 'info')
      }
      return
    }

    isSyncingRef.current = true
    setIsSyncing(true)

    let hasError = false
    let hasLocalSync = false
    let shouldRefresh = false

    try {
      if (pending.length > 0) {
        try {
          const syncedDiscoveries = await syncDiscoveriesToSupabase(pending)
          await saveSyncedDiscoveries(syncedDiscoveries)
          hasLocalSync = true
          shouldRefresh = true
        } catch {
          hasError = true
          await updateSyncStatus(
            pending.map((discovery) => discovery.id),
            'error',
          )
          shouldRefresh = true
        }
      }

      if (pendingDeletes.length > 0) {
        try {
          await deleteDiscoveriesFromSupabase(pendingDeletes)
          await removeDeletedDiscoveries(
            pendingDeletes.map((discovery) => discovery.id),
          )
          hasLocalSync = true
          shouldRefresh = true
        } catch {
          hasError = true
          await updateDeletedSyncStatus(
            pendingDeletes.map((discovery) => discovery.id),
            'error',
          )
        }
      }

      try {
        const remoteDiscoveries = await fetchDiscoveriesFromSupabase()
        const remoteChangeCount = await mergeRemoteDiscoveries(remoteDiscoveries)
        hasLoadedRemoteRef.current = true
        shouldRefresh = shouldRefresh || remoteChangeCount > 0
      } catch {
        hasError = true
      }

      if (hasLocalSync || shouldRefresh) {
        setLastSyncedAt(new Date().toISOString())
      }

      if (!options?.silent && hasError) {
        showToast('Falha na sincronizacao. Os dados seguem salvos offline.', 'error')
      } else if (!options?.silent && hasLocalSync) {
        showToast('Sincronizacao concluida.', 'success')
      }
    } finally {
      isSyncingRef.current = false
      setIsSyncing(false)
      if (shouldRefresh) {
        await refreshDiscoveries()
      }
    }
  }, [isOnline, refreshDiscoveries, showToast])

  useEffect(() => {
    if (!isOnline) {
      hasLoadedRemoteRef.current = false
      return
    }

    if (isOnline && (pendingCount > 0 || !hasLoadedRemoteRef.current)) {
      const syncTimer = window.setTimeout(
        () => void syncPending({ silent: pendingCount === 0 }),
        0,
      )
      return () => window.clearTimeout(syncTimer)
    }
  }, [isOnline, pendingCount, syncPending])

  return {
    isOnline,
    isSyncing,
    lastSyncedAt,
    pendingCount,
    syncPending,
  }
}
