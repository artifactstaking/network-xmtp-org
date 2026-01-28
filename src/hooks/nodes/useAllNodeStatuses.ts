import { useEffect, useCallback, useRef } from 'react';
import { checkMultipleNodes, createHealthResultMap } from '@/lib/grpc/nodeHealthClient';
import { NodeData, NodeHealthResult } from '@/types/nodes';
import { useNodeStore } from '@/store/nodeStore';

/**
 * Default polling interval for status checks (30 seconds)
 */
const DEFAULT_POLL_INTERVAL = 30000;

/**
 * Hook for checking the health status of all nodes with automatic polling
 *
 * @param nodes - Array of nodes to check
 * @param options - Configuration options
 * @returns Object with statuses, loading state, and refresh function
 */
export function useAllNodeStatuses(
  nodes: NodeData[],
  options: {
    /** Polling interval in milliseconds (default: 30000) */
    pollInterval?: number;
    /** Whether to enable automatic polling (default: true) */
    enablePolling?: boolean;
    /** Maximum concurrent requests (default: 5) */
    concurrency?: number;
  } = {}
) {
  const { pollInterval = DEFAULT_POLL_INTERVAL, enablePolling = true, concurrency = 5 } = options;

  const { statusCache, setNodeStatus } = useNodeStore();
  const isCheckingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const checkAllStatuses = useCallback(async () => {
    if (isCheckingRef.current || nodes.length === 0) return;

    isCheckingRef.current = true;

    try {
      const results = await checkMultipleNodes(nodes, concurrency);

      // Update store with results
      results.forEach((result) => {
        setNodeStatus(result.nodeId, result);
      });
    } finally {
      isCheckingRef.current = false;
    }
  }, [nodes, concurrency, setNodeStatus]);

  // Initial check on mount or when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      checkAllStatuses();
    }
  }, [nodes.length, checkAllStatuses]);

  // Set up polling
  useEffect(() => {
    if (!enablePolling || nodes.length === 0) return;

    // Clear any existing interval
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = window.setInterval(() => {
      // Only poll if page is visible
      if (document.visibilityState === 'visible') {
        checkAllStatuses();
      }
    }, pollInterval);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enablePolling, pollInterval, nodes.length, checkAllStatuses]);

  // Handle visibility changes - refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && nodes.length > 0) {
        checkAllStatuses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [nodes.length, checkAllStatuses]);

  // Create a map of current statuses for easy lookup
  const getStatusForNode = useCallback(
    (nodeId: number): NodeHealthResult | undefined => {
      return statusCache.get(nodeId);
    },
    [statusCache]
  );

  // Get all statuses as an array
  const allStatuses = Array.from(statusCache.values());

  // Count statuses by type
  const statusCounts = {
    online: allStatuses.filter((s) => s.status === 'online').length,
    offline: allStatuses.filter((s) => s.status === 'offline').length,
    error: allStatuses.filter((s) => s.status === 'error').length,
    unknown: nodes.length - allStatuses.length,
  };

  return {
    statuses: createHealthResultMap(allStatuses),
    statusCounts,
    isChecking: isCheckingRef.current,
    refresh: checkAllStatuses,
    getStatusForNode,
  };
}
