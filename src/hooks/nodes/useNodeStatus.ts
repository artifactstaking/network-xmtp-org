import { useState, useCallback } from 'react';
import { checkNodeHealth } from '@/lib/grpc/nodeHealthClient';
import { NodeHealthResult } from '@/types/nodes';

/**
 * Hook for checking the health status of a single node
 *
 * @param nodeId - The node ID to check
 * @param httpAddress - The node's HTTP address
 * @returns Object with status, loading state, and check function
 */
export function useNodeStatus(nodeId: number, httpAddress: string) {
  const [status, setStatus] = useState<NodeHealthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!httpAddress) {
      setError('No HTTP address provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkNodeHealth(nodeId, httpAddress);
      setStatus(result);

      if (result.status === 'error' && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [nodeId, httpAddress]);

  return {
    status,
    isLoading,
    error,
    checkStatus,
  };
}
