import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NodeHealthResult, NodeMetadata, NodeFilterType } from '@/types/nodes';

/**
 * Metadata cache TTL in milliseconds (24 hours)
 */
const METADATA_CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Cached metadata entry with timestamp
 */
interface MetadataCacheEntry {
  metadata: NodeMetadata | null;
  fetchedAt: number;
}

/**
 * State management interface for node data
 */
interface NodeState {
  // Cache (memory only - not persisted)
  /** Map of node ID to health status */
  statusCache: Map<number, NodeHealthResult>;

  // Cache (persisted to localStorage)
  /** Map of node ID to metadata with fetch timestamp */
  metadataCache: Record<number, MetadataCacheEntry>;

  // UI State
  /** Currently selected node ID for details view */
  selectedNodeId: number | null;

  /** Current filter type */
  filterType: NodeFilterType;

  /** Search query string */
  searchQuery: string;

  // Actions - Status
  /** Update the health status for a node */
  setNodeStatus: (nodeId: number, status: NodeHealthResult) => void;

  /** Clear all status cache */
  clearStatusCache: () => void;

  // Actions - Metadata
  /** Update the metadata for a node */
  setNodeMetadata: (nodeId: number, metadata: NodeMetadata | null) => void;

  /** Get cached metadata for a node (returns null if expired or not cached) */
  getCachedMetadata: (nodeId: number) => NodeMetadata | null;

  /** Check if metadata cache is valid for a node */
  isMetadataCacheValid: (nodeId: number) => boolean;

  /** Clear all metadata cache */
  clearMetadataCache: () => void;

  // Actions - UI State
  /** Set the selected node ID */
  setSelectedNodeId: (nodeId: number | null) => void;

  /** Set the filter type */
  setFilterType: (filterType: NodeFilterType) => void;

  /** Set the search query */
  setSearchQuery: (query: string) => void;

  /** Reset all state */
  reset: () => void;
}

/**
 * Zustand store for managing node state
 * Status cache is memory-only (not persisted)
 * Metadata cache is persisted to localStorage with 24-hour TTL
 */
export const useNodeStore = create<NodeState>()(
  persist(
    (set, get) => ({
      // Initial state
      statusCache: new Map(),
      metadataCache: {},
      selectedNodeId: null,
      filterType: 'all',
      searchQuery: '',

      // Status actions
      setNodeStatus: (nodeId: number, status: NodeHealthResult) => {
        set((state) => {
          const newCache = new Map(state.statusCache);
          newCache.set(nodeId, status);
          return { statusCache: newCache };
        });
      },

      clearStatusCache: () => {
        set({ statusCache: new Map() });
      },

      // Metadata actions
      setNodeMetadata: (nodeId: number, metadata: NodeMetadata | null) => {
        set((state) => ({
          metadataCache: {
            ...state.metadataCache,
            [nodeId]: {
              metadata,
              fetchedAt: Date.now(),
            },
          },
        }));
      },

      getCachedMetadata: (nodeId: number) => {
        const { metadataCache } = get();
        const entry = metadataCache[nodeId];

        if (!entry) return null;

        // Check if cache is still valid
        if (Date.now() - entry.fetchedAt > METADATA_CACHE_TTL) {
          return null;
        }

        return entry.metadata;
      },

      isMetadataCacheValid: (nodeId: number) => {
        const { metadataCache } = get();
        const entry = metadataCache[nodeId];

        if (!entry) return false;

        return Date.now() - entry.fetchedAt <= METADATA_CACHE_TTL;
      },

      clearMetadataCache: () => {
        set({ metadataCache: {} });
      },

      // UI State actions
      setSelectedNodeId: (nodeId: number | null) => {
        set({ selectedNodeId: nodeId });
      },

      setFilterType: (filterType: NodeFilterType) => {
        set({ filterType });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      reset: () => {
        set({
          statusCache: new Map(),
          metadataCache: {},
          selectedNodeId: null,
          filterType: 'all',
          searchQuery: '',
        });
      },
    }),
    {
      name: 'node-store',
      // Only persist metadata cache and UI preferences, not status cache
      partialize: (state) => ({
        metadataCache: state.metadataCache,
        filterType: state.filterType,
      }),
      // Reconstruct non-persisted state after rehydration
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Reset status cache since it's memory-only
        state.statusCache = new Map();
        state.selectedNodeId = null;
        state.searchQuery = '';
      },
    }
  )
);
