import { useState, useCallback, useEffect, useMemo } from 'react';
import { NodeMetadata } from '@/types/nodes';
import { useNodeStore } from '@/store/nodeStore';

/**
 * Fetch and parse NFT metadata from a tokenURI
 *
 * @param tokenURI - The token URI to fetch
 * @returns The parsed metadata or null if fetch fails
 */
async function fetchMetadataFromURI(tokenURI: string): Promise<NodeMetadata | null> {
  try {
    // Handle IPFS URIs
    let url = tokenURI;
    if (url.startsWith('ipfs://')) {
      url = url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Validate required fields
    if (!data.description) {
      return null;
    }

    return {
      description: data.description,
      image: data.image,
      external_url: data.external_url,
      operator_name: data.operator_name,
      region: data.region,
      social: data.social,
    };
  } catch {
    return null;
  }
}

/**
 * Hook for fetching and caching node NFT metadata
 *
 * @param nodeId - The node ID
 * @param getTokenURI - Function to get the token URI from the contract
 * @returns Object with metadata, loading state, and fetch function
 */
export function useNodeMetadata(
  nodeId: number,
  getTokenURI: (nodeId: number) => Promise<string | null>
) {
  const { getCachedMetadata, setNodeMetadata, isMetadataCacheValid } = useNodeStore();

  const [metadata, setMetadata] = useState<NodeMetadata | null>(() => getCachedMetadata(nodeId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(
    async (forceRefresh = false) => {
      // Check cache first unless force refresh
      if (!forceRefresh && isMetadataCacheValid(nodeId)) {
        const cached = getCachedMetadata(nodeId);
        if (cached !== null) {
          setMetadata(cached);
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get token URI from contract
        const tokenURI = await getTokenURI(nodeId);

        if (!tokenURI) {
          setMetadata(null);
          setNodeMetadata(nodeId, null);
          return;
        }

        // Fetch metadata from URI
        const fetchedMetadata = await fetchMetadataFromURI(tokenURI);

        setMetadata(fetchedMetadata);
        setNodeMetadata(nodeId, fetchedMetadata);
      } catch (err) {
        setError((err as Error).message);
        setMetadata(null);
      } finally {
        setIsLoading(false);
      }
    },
    [nodeId, getTokenURI, getCachedMetadata, setNodeMetadata, isMetadataCacheValid]
  );

  // Fetch on mount if not cached
  useEffect(() => {
    if (!isMetadataCacheValid(nodeId)) {
      fetchMetadata();
    }
  }, [nodeId, fetchMetadata, isMetadataCacheValid]);

  return {
    metadata,
    isLoading,
    error,
    refetch: () => fetchMetadata(true),
  };
}

/**
 * Hook for batch fetching metadata for multiple nodes
 *
 * @param nodeIds - Array of node IDs to fetch metadata for
 * @param getTokenURI - Function to get the token URI from the contract
 * @returns Object with metadata map, loading state, and fetch function
 */
export function useMultipleNodeMetadata(
  nodeIds: number[],
  getTokenURI: (nodeId: number) => Promise<string | null>
) {
  const { getCachedMetadata, setNodeMetadata, isMetadataCacheValid, metadataCache } = useNodeStore();

  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Build metadata map directly from zustand store - this ensures reactivity
  const metadataMap = useMemo(() => {
    const map = new Map<number, NodeMetadata | null>();
    nodeIds.forEach((id) => {
      const cached = getCachedMetadata(id);
      map.set(id, cached);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIds, metadataCache, fetchTrigger]);

  const fetchAllMetadata = useCallback(
    async (forceRefresh = false) => {
      // Filter to only nodes that need fetching
      const nodesToFetch = forceRefresh
        ? nodeIds
        : nodeIds.filter((id) => !isMetadataCacheValid(id));

      if (nodesToFetch.length === 0) return;

      setIsLoading(true);

      try {
        const results = await Promise.all(
          nodesToFetch.map(async (nodeId) => {
            try {
              const tokenURI = await getTokenURI(nodeId);
              if (!tokenURI) {
                return { nodeId, metadata: null };
              }
              const metadata = await fetchMetadataFromURI(tokenURI);
              return { nodeId, metadata };
            } catch {
              return { nodeId, metadata: null };
            }
          })
        );

        // Update zustand store (this will trigger metadataMap to rebuild)
        results.forEach(({ nodeId, metadata }) => {
          setNodeMetadata(nodeId, metadata);
        });

        // Trigger a re-render to rebuild metadataMap from updated store
        setFetchTrigger((prev) => prev + 1);
      } finally {
        setIsLoading(false);
      }
    },
    [nodeIds, getTokenURI, setNodeMetadata, isMetadataCacheValid]
  );

  // Fetch on mount for nodes not in cache
  useEffect(() => {
    if (nodeIds.length === 0) return;

    const uncachedNodes = nodeIds.filter((id) => !isMetadataCacheValid(id));
    if (uncachedNodes.length > 0) {
      fetchAllMetadata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIds.join(',')]);

  return {
    metadataMap,
    isLoading,
    refetch: () => fetchAllMetadata(true),
    getMetadata: (nodeId: number) => metadataMap.get(nodeId) ?? getCachedMetadata(nodeId),
  };
}
