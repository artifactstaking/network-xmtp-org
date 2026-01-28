import { useMemo } from 'react';
import { NodeData, NodeHealthResult, NetworkStatusInfo } from '@/types/nodes';
import { calculateNetworkStatus } from '@/utils/networkStatus';

/**
 * Hook that computes network status from nodes and their health statuses
 *
 * @param nodes - Array of all nodes
 * @param statuses - Map of node IDs to their health results
 * @returns NetworkStatusInfo with status, counts, and metadata
 */
export function useNetworkStatus(
  nodes: NodeData[],
  statuses: Map<number, NodeHealthResult>
): NetworkStatusInfo {
  return useMemo(() => {
    // Separate canonical and community nodes
    const canonicalNodes = nodes.filter((n) => n.isCanonical);
    const communityNodes = nodes.filter((n) => !n.isCanonical);

    // Count online nodes for each category
    let canonicalOnline = 0;
    let communityOnline = 0;
    let totalLatencyMs = 0;
    let onlineCount = 0;
    let latestCheck: Date | null = null;

    for (const node of canonicalNodes) {
      const health = statuses.get(node.nodeId);
      if (health?.status === 'online') {
        canonicalOnline++;
        if (health.latencyMs !== undefined) {
          totalLatencyMs += health.latencyMs;
          onlineCount++;
        }
      }
      if (health?.lastChecked) {
        if (!latestCheck || health.lastChecked > latestCheck) {
          latestCheck = health.lastChecked;
        }
      }
    }

    for (const node of communityNodes) {
      const health = statuses.get(node.nodeId);
      if (health?.status === 'online') {
        communityOnline++;
        if (health.latencyMs !== undefined) {
          totalLatencyMs += health.latencyMs;
          onlineCount++;
        }
      }
      if (health?.lastChecked) {
        if (!latestCheck || health.lastChecked > latestCheck) {
          latestCheck = health.lastChecked;
        }
      }
    }

    // Calculate average latency from all online nodes
    const averageLatencyMs = onlineCount > 0 ? Math.round(totalLatencyMs / onlineCount) : null;

    // Calculate network status based on canonical nodes only
    const status = calculateNetworkStatus(canonicalOnline, canonicalNodes.length);

    return {
      status,
      canonicalOnline,
      canonicalTotal: canonicalNodes.length,
      communityOnline,
      communityTotal: communityNodes.length,
      averageLatencyMs,
      lastChecked: latestCheck,
    };
  }, [nodes, statuses]);
}
