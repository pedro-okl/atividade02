export type RarityLevel = 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico'

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

export const RARITY_LEVELS: RarityLevel[] = [
  'Incomum',
  'Raro',
  'Épico',
  'Lendário',
  'Mítico',
]

const LEGACY_RARITY_LEVELS: Record<string, RarityLevel> = {
  Comum: 'Incomum',
  Rara: 'Raro',
  'Muito Rara': 'Épico',
}

export function normalizeRarity(rarity: string): RarityLevel {
  if (RARITY_LEVELS.includes(rarity as RarityLevel)) {
    return rarity as RarityLevel
  }

  return LEGACY_RARITY_LEVELS[rarity] ?? 'Incomum'
}
