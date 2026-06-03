export type RarityLevel = 'Comum' | 'Rara' | 'Muito Rara'

export type DiscoveryCategory =
  | 'Botânica'
  | 'Zoologia'
  | 'Geologia'
  | 'Meteorologia'
  | 'Outro'

export type SyncStatus = 'pending' | 'synced' | 'error'

export interface Discovery {
  id: string
  title: string
  description: string
  category: DiscoveryCategory
  rarity: RarityLevel
  photos: string[]
  isFavorite: boolean
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
}

export interface DeletedDiscovery {
  id: string
  deletedAt: string
  syncStatus: SyncStatus
}

export type NewDiscoveryInput = Pick<
  Discovery,
  'title' | 'description' | 'category' | 'rarity' | 'photos'
>

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  'Botânica',
  'Zoologia',
  'Geologia',
  'Meteorologia',
  'Outro',
]

export const RARITY_LEVELS: RarityLevel[] = ['Comum', 'Rara', 'Muito Rara']
