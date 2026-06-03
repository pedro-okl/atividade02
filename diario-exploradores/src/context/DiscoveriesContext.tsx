/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { db, getAllDiscoveries, queueDeletedDiscovery } from '../db/database'
import type { Discovery, NewDiscoveryInput } from '../types'
import { normalizeText } from '../utils/format'

interface DiscoveriesState {
  discoveries: Discovery[]
  loading: boolean
  error: string | null
}

interface DiscoveriesContextValue extends DiscoveriesState {
  createDiscovery: (input: NewDiscoveryInput) => Promise<Discovery>
  deleteDiscovery: (id: string) => Promise<void>
  refreshDiscoveries: () => Promise<void>
  searchDiscoveries: (query: string, favoritesOnly?: boolean) => Discovery[]
  toggleFavorite: (id: string) => Promise<void>
  updateDiscovery: (id: string, input: NewDiscoveryInput) => Promise<void>
}

type DiscoveriesAction =
  | { type: 'loading' }
  | { type: 'loaded'; discoveries: Discovery[] }
  | { type: 'error'; error: string }

const DiscoveriesContext = createContext<DiscoveriesContextValue | undefined>(
  undefined,
)

function discoveriesReducer(
  state: DiscoveriesState,
  action: DiscoveriesAction,
): DiscoveriesState {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null }
    case 'loaded':
      return { discoveries: action.discoveries, loading: false, error: null }
    case 'error':
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

const initialState: DiscoveriesState = {
  discoveries: [],
  loading: true,
  error: null,
}

function createId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

export function DiscoveriesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(discoveriesReducer, initialState)

  const refreshDiscoveries = useCallback(async () => {
    dispatch({ type: 'loading' })

    try {
      const discoveries = await getAllDiscoveries()
      dispatch({ type: 'loaded', discoveries })
    } catch {
      dispatch({
        type: 'error',
        error: 'Não foi possível carregar as descobertas.',
      })
    }
  }, [])

  useEffect(() => {
    void refreshDiscoveries()
  }, [refreshDiscoveries])

  const createDiscovery = useCallback(
    async (input: NewDiscoveryInput) => {
      const now = new Date().toISOString()
      const discovery: Discovery = {
        id: createId(),
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        rarity: input.rarity,
        photos: input.photos,
        isFavorite: false,
        syncStatus: 'pending',
        createdAt: now,
        updatedAt: now,
      }

      await db.discoveries.add(discovery)
      await refreshDiscoveries()
      return discovery
    },
    [refreshDiscoveries],
  )

  const updateDiscovery = useCallback(
    async (id: string, input: NewDiscoveryInput) => {
      await db.discoveries.update(id, {
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        rarity: input.rarity,
        photos: input.photos,
        syncStatus: 'pending',
        updatedAt: new Date().toISOString(),
      })
      await refreshDiscoveries()
    },
    [refreshDiscoveries],
  )

  const deleteDiscovery = useCallback(
    async (id: string) => {
      await db.transaction('rw', db.discoveries, db.deletedDiscoveries, async () => {
        await db.discoveries.delete(id)
        await queueDeletedDiscovery(id)
      })
      await refreshDiscoveries()
    },
    [refreshDiscoveries],
  )

  const toggleFavorite = useCallback(
    async (id: string) => {
      const current = await db.discoveries.get(id)
      if (!current) {
        return
      }

      await db.discoveries.update(id, {
        isFavorite: !current.isFavorite,
        syncStatus: 'pending',
        updatedAt: new Date().toISOString(),
      })
      await refreshDiscoveries()
    },
    [refreshDiscoveries],
  )

  const searchDiscoveries = useCallback(
    (query: string, favoritesOnly = false) => {
      const terms = normalizeText(query.trim())
      const base = favoritesOnly
        ? state.discoveries.filter((discovery) => discovery.isFavorite)
        : state.discoveries

      if (!terms) {
        return base
      }

      return base.filter((discovery) => {
        const searchable = normalizeText(
          `${discovery.title} ${discovery.description} ${discovery.category}`,
        )
        return searchable.includes(terms)
      })
    },
    [state.discoveries],
  )

  const value = useMemo<DiscoveriesContextValue>(
    () => ({
      ...state,
      createDiscovery,
      deleteDiscovery,
      refreshDiscoveries,
      searchDiscoveries,
      toggleFavorite,
      updateDiscovery,
    }),
    [
      createDiscovery,
      deleteDiscovery,
      refreshDiscoveries,
      searchDiscoveries,
      state,
      toggleFavorite,
      updateDiscovery,
    ],
  )

  return (
    <DiscoveriesContext.Provider value={value}>
      {children}
    </DiscoveriesContext.Provider>
  )
}

export function useDiscoveries() {
  const context = useContext(DiscoveriesContext)

  if (!context) {
    throw new Error('useDiscoveries must be used within DiscoveriesProvider')
  }

  return context
}
