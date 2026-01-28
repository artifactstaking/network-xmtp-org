import React, { useState, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/base';
import { Body } from '@/components/typography';
import { NodeTable } from './NodeTable';
import { NodeDetailsDialog } from './NodeDetailsDialog';
import { NetworkStatusBanner, StatusSummaryCards } from '@/components/ui/status';
import { NodeData } from '@/types/nodes';
import { useNodeRegistry } from '@/hooks/contracts/useNodeRegistry';
import { useAllNodeStatuses, useNetworkStatus } from '@/hooks/nodes';
import { useMultipleNodeMetadata } from '@/hooks/nodes/useNodeMetadata';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export const NodesPageContent: React.FC = () => {
  const { getAllNodes, getTokenURI } = useNodeRegistry();

  // Local UI state
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showCanonicalNodes, setShowCanonicalNodes] = useState(false);
  const [showCommunityNodes, setShowCommunityNodes] = useState(false);
  const [canonicalSearch, setCanonicalSearch] = useState('');
  const [communitySearch, setCommunitySearch] = useState('');

  // Get all nodes from contract
  const nodes = getAllNodes.value || [];
  const isLoading = getAllNodes.isLoading;
  const error = getAllNodes.error;

  // Get node IDs for metadata fetching
  const nodeIds = useMemo(() => nodes.map((n) => n.nodeId), [nodes]);

  // Fetch metadata and statuses
  const { metadataMap } = useMultipleNodeMetadata(nodeIds, getTokenURI);
  const { statuses, refresh, isChecking } = useAllNodeStatuses(nodes);

  // Calculate network status from canonical nodes
  const networkStatusInfo = useNetworkStatus(nodes, statuses);

  // Separate canonical and community nodes
  const canonicalNodes = useMemo(() => nodes.filter((n) => n.isCanonical), [nodes]);
  const communityNodes = useMemo(() => nodes.filter((n) => !n.isCanonical), [nodes]);

  // Helper to get operator name from metadata
  const getOperatorName = useCallback((nodeId: number): string => {
    const metadata = metadataMap.get(nodeId);
    return metadata?.operator_name || '';
  }, [metadataMap]);

  // Filter function for nodes
  const filterNodes = useCallback((nodeList: NodeData[], searchQuery: string): NodeData[] => {
    if (!searchQuery.trim()) return nodeList;
    const query = searchQuery.toLowerCase();
    return nodeList.filter((node) => {
      const operatorName = getOperatorName(node.nodeId);
      const health = statuses.get(node.nodeId);
      return (
        node.nodeId.toString().includes(query) ||
        node.httpAddress.toLowerCase().includes(query) ||
        node.owner.toLowerCase().includes(query) ||
        operatorName.toLowerCase().includes(query) ||
        (health?.version?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [getOperatorName, statuses]);

  // Filtered nodes for each section
  const filteredCanonicalNodes = useMemo(
    () => filterNodes(canonicalNodes, canonicalSearch),
    [canonicalNodes, canonicalSearch, filterNodes]
  );
  const filteredCommunityNodes = useMemo(
    () => filterNodes(communityNodes, communitySearch),
    [communityNodes, communitySearch, filterNodes]
  );

  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node);
    setDetailsOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Body className="text-destructive mb-4">Error loading nodes: {error}</Body>
        <button onClick={() => getAllNodes.refetch()} className="text-accent hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Network Status Banner */}
      <NetworkStatusBanner
        statusInfo={networkStatusInfo}
        onRefresh={refresh}
        isRefreshing={isChecking}
      />

      {/* Status Summary Cards */}
      <StatusSummaryCards statusInfo={networkStatusInfo} />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Canonical Nodes Section - Collapsible */}
          {canonicalNodes.length > 0 && (
            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setShowCanonicalNodes(!showCanonicalNodes)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">Canonical Nodes</span>
                  <span className="text-sm text-gray-500">
                    {networkStatusInfo.canonicalOnline}/{canonicalNodes.length} online
                  </span>
                </div>
                {showCanonicalNodes ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {showCanonicalNodes && (
                <div className="border-t px-6 py-4 space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by ID, operator, address, version..."
                      value={canonicalSearch}
                      onChange={(e) => setCanonicalSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {/* Node Table */}
                  {filteredCanonicalNodes.length > 0 ? (
                    <NodeTable
                      nodes={filteredCanonicalNodes}
                      metadataMap={metadataMap}
                      statusMap={statuses}
                      onNodeClick={handleNodeClick}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No nodes match your search
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Community Nodes Section - Collapsible */}
          {communityNodes.length > 0 && (
            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setShowCommunityNodes(!showCommunityNodes)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">Community Nodes</span>
                  <span className="text-sm text-gray-500">
                    {networkStatusInfo.communityOnline}/{communityNodes.length} online
                  </span>
                </div>
                {showCommunityNodes ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {showCommunityNodes && (
                <div className="border-t">
                  {/* Search Input */}
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by ID, operator, address, version..."
                        value={communitySearch}
                        onChange={(e) => setCommunitySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                  {/* Node Table */}
                  {filteredCommunityNodes.length > 0 ? (
                    <NodeTable
                      nodes={filteredCommunityNodes}
                      metadataMap={metadataMap}
                      statusMap={statuses}
                      onNodeClick={handleNodeClick}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No nodes match your search
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Body className="text-secondary">No nodes registered on the network</Body>
            </div>
          )}
        </div>
      )}

      {/* Details Dialog */}
      <NodeDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        node={selectedNode}
        metadata={selectedNode ? metadataMap.get(selectedNode.nodeId) : undefined}
        health={selectedNode ? statuses.get(selectedNode.nodeId) : undefined}
      />
    </div>
  );
};
