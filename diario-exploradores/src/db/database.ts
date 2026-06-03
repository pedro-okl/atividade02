import Dexie, { type Table } from 'dexie'
import type { DeletedDiscovery, Discovery, SyncStatus } from '../types'

class ExplorerDatabase extends Dexie {
  deletedDiscoveries!: Table<DeletedDiscovery, string>
  discoveries!: Table<Discovery, string>

  constructor() {
    super('ExplorerDB')
    this.version(1).stores({
      discoveries: 'id, title, category, rarity, isFavorite, syncStatus, createdAt',
    })
    this.version(2).stores({
      deletedDiscoveries: 'id, syncStatus, deletedAt',
      discoveries: 'id, title, category, rarity, isFavorite, syncStatus, createdAt',
    })
  }
}

export const db = new ExplorerDatabase()

export async function getAllDiscoveries() {
  return db.discoveries.orderBy('createdAt').reverse().toArray()
}

export async function getDiscoveryById(id: string) {
  return db.discoveries.get(id)
}

export async function getPendingDiscoveries() {
  return db.discoveries
    .where('syncStatus')
    .anyOf(['pending', 'error'])
    .toArray()
}

export async function queueDeletedDiscovery(id: string) {
  await db.deletedDiscoveries.put({
    deletedAt: new Date().toISOString(),
    id,
    syncStatus: 'pending',
  })
}

export async function getPendingDeletedDiscoveries() {
  return db.deletedDiscoveries
    .where('syncStatus')
    .anyOf(['pending', 'error'])
    .toArray()
}

export async function mergeRemoteDiscoveries(remoteDiscoveries: Discovery[]) {
  return db.transaction('rw', db.discoveries, db.deletedDiscoveries, async () => {
    const [localDiscoveries, deletedDiscoveries] = await Promise.all([
      db.discoveries.toArray(),
      db.deletedDiscoveries.toArray(),
    ])
    const localById = new Map(
      localDiscoveries.map((discovery) => [discovery.id, discovery]),
    )
    const remoteIds = new Set(
      remoteDiscoveries.map((discovery) => discovery.id),
    )
    const deletedIds = new Set(
      deletedDiscoveries.map((discovery) => discovery.id),
    )
    let changeCount = 0

    await Promise.all(
      remoteDiscoveries.map(async (remoteDiscovery) => {
        if (deletedIds.has(remoteDiscovery.id)) {
          return
        }

        const localDiscovery = localById.get(remoteDiscovery.id)
        const shouldSaveRemote =
          !localDiscovery ||
          (localDiscovery.syncStatus === 'synced' &&
            new Date(remoteDiscovery.updatedAt).getTime() >
              new Date(localDiscovery.updatedAt).getTime())

        if (shouldSaveRemote) {
          await db.discoveries.put({
            ...remoteDiscovery,
            syncStatus: 'synced',
          })
          changeCount += 1
        }
      }),
    )

    const deletedRemotely = localDiscoveries
      .filter(
        (discovery) =>
          discovery.syncStatus === 'synced' && !remoteIds.has(discovery.id),
      )
      .map((discovery) => discovery.id)

    if (deletedRemotely.length > 0) {
      await db.discoveries.bulkDelete(deletedRemotely)
      changeCount += deletedRemotely.length
    }

    return changeCount
  })
}

export async function removeDeletedDiscoveries(ids: string[]) {
  await db.deletedDiscoveries.bulkDelete(ids)
}

export async function saveSyncedDiscoveries(discoveries: Discovery[]) {
  await db.discoveries.bulkPut(
    discoveries.map((discovery) => ({
      ...discovery,
      syncStatus: 'synced' as const,
    })),
  )
}

export async function updateDeletedSyncStatus(
  ids: string[],
  syncStatus: SyncStatus,
) {
  await db.transaction('rw', db.deletedDiscoveries, async () => {
    await Promise.all(
      ids.map((id) => db.deletedDiscoveries.update(id, { syncStatus })),
    )
  })
}

export async function updateSyncStatus(ids: string[], syncStatus: SyncStatus) {
  await db.transaction('rw', db.discoveries, async () => {
    await Promise.all(
      ids.map((id) => db.discoveries.update(id, { syncStatus })),
    )
  })
}
