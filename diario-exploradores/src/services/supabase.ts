import { createClient } from '@supabase/supabase-js'
import type {
  DeletedDiscovery,
  Discovery,
  DiscoveryCategory,
  RarityLevel,
} from '../types'

const PHOTOS_BUCKET = 'discovery-photos'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

interface DiscoveryRow {
  id: string
  title: string
  description: string
  category: DiscoveryCategory
  rarity: RarityLevel
  photos: string[] | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export function isSupabaseConfigured() {
  return Boolean(supabase)
}

function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase nao configurado')
  }

  return supabase
}

function isDataUrl(photo: string) {
  return photo.startsWith('data:')
}

function getPhotoExtension(contentType: string) {
  const subtype = contentType.split('/')[1]?.split(';')[0]

  if (!subtype) {
    return 'jpg'
  }

  return subtype === 'jpeg' ? 'jpg' : subtype
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl)
  return response.blob()
}

async function uploadDiscoveryPhoto(
  discoveryId: string,
  photo: string,
  index: number,
) {
  if (!isDataUrl(photo)) {
    return photo
  }

  const blob = await dataUrlToBlob(photo)
  const extension = getPhotoExtension(blob.type)
  const path = `${discoveryId}/${index}.${extension}`
  const client = getSupabase()

  const { error } = await client.storage
    .from(PHOTOS_BUCKET)
    .upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      upsert: true,
    })

  if (error) {
    throw error
  }

  const { data } = client.storage.from(PHOTOS_BUCKET).getPublicUrl(path)

  return data.publicUrl
}

async function uploadDiscoveryPhotos(discovery: Discovery) {
  return Promise.all(
    discovery.photos.map((photo, index) =>
      uploadDiscoveryPhoto(discovery.id, photo, index),
    ),
  )
}

function toDiscoveryRow(discovery: Discovery) {
  return {
    category: discovery.category,
    created_at: discovery.createdAt,
    description: discovery.description,
    id: discovery.id,
    is_favorite: discovery.isFavorite,
    photos: discovery.photos,
    rarity: discovery.rarity,
    title: discovery.title,
    updated_at: discovery.updatedAt,
  }
}

function fromDiscoveryRow(row: DiscoveryRow): Discovery {
  return {
    category: row.category,
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    isFavorite: row.is_favorite,
    photos: Array.isArray(row.photos) ? row.photos : [],
    rarity: row.rarity,
    syncStatus: 'synced',
    title: row.title,
    updatedAt: row.updated_at,
  }
}

export async function syncDiscoveriesToSupabase(discoveries: Discovery[]) {
  if (discoveries.length === 0) {
    return []
  }

  const discoveriesWithUploadedPhotos = await Promise.all(
    discoveries.map(async (discovery) => ({
      ...discovery,
      photos: await uploadDiscoveryPhotos(discovery),
    })),
  )

  const { error } = await getSupabase()
    .from('discoveries')
    .upsert(discoveriesWithUploadedPhotos.map(toDiscoveryRow), {
      onConflict: 'id',
    })

  if (error) {
    throw error
  }

  return discoveriesWithUploadedPhotos.map((discovery) => ({
    ...discovery,
    syncStatus: 'synced' as const,
  }))
}

export async function fetchDiscoveriesFromSupabase() {
  const { data, error } = await getSupabase()
    .from('discoveries')
    .select(
      'id, title, description, category, rarity, photos, is_favorite, created_at, updated_at',
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as DiscoveryRow[]).map(fromDiscoveryRow)
}

export async function deleteDiscoveriesFromSupabase(
  deletedDiscoveries: DeletedDiscovery[],
) {
  if (deletedDiscoveries.length === 0) {
    return
  }

  const client = getSupabase()

  await Promise.all(
    deletedDiscoveries.map(async (discovery) => {
      const { data, error } = await client.storage
        .from(PHOTOS_BUCKET)
        .list(discovery.id)

      if (error || !data.length) {
        return
      }

      await client.storage
        .from(PHOTOS_BUCKET)
        .remove(data.map((file) => `${discovery.id}/${file.name}`))
    }),
  )

  const { error } = await client
    .from('discoveries')
    .delete()
    .in(
      'id',
      deletedDiscoveries.map((discovery) => discovery.id),
    )

  if (error) {
    throw error
  }
}
