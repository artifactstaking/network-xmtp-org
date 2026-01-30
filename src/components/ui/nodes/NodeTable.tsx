import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/base';
import { NodeStatusBadge } from './NodeStatusBadge';
import { NodeData, NodeMetadata, NodeHealthResult } from '@/types/nodes';
import { useFormatters } from '@/hooks/utils/useFormatters';
import { MapPin } from 'lucide-react';

interface NodeTableProps {
  nodes: NodeData[];
  metadataMap?: Map<number, NodeMetadata | null>;
  statusMap?: Map<number, NodeHealthResult>;
  onNodeClick?: (node: NodeData) => void;
}

export const NodeTable: React.FC<NodeTableProps> = ({
  nodes,
  metadataMap,
  statusMap,
  onNodeClick,
}) => {
  const { formatAddress } = useFormatters();

  const getMetadata = (nodeId: number) => metadataMap?.get(nodeId);
  const getStatus = (nodeId: number) => statusMap?.get(nodeId);

  const getOperatorName = (node: NodeData) => {
    const metadata = getMetadata(node.nodeId);
    return metadata?.operator_name || null;
  };

  const getAvatarUrl = (node: NodeData) => {
    const metadata = getMetadata(node.nodeId);
    return metadata?.image || undefined;
  };

  const getRegion = (node: NodeData) => {
    const metadata = getMetadata(node.nodeId);
    return metadata?.region || null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800/50 hover:bg-transparent">
            <TableHead className="min-w-[200px] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Node
            </TableHead>
            <TableHead className="w-24 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="w-24 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Type
            </TableHead>
            <TableHead className="w-28 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Location
            </TableHead>
            <TableHead className="min-w-[200px] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              HTTP Address
            </TableHead>
            <TableHead className="w-32 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Owner
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <span className="text-zinc-500">No nodes found</span>
              </TableCell>
            </TableRow>
          ) : (
            nodes.map((node) => {
              const status = getStatus(node.nodeId);
              const health = statusMap?.get(node.nodeId);
              const region = getRegion(node);
              const operatorName = getOperatorName(node);
              const avatarUrl = getAvatarUrl(node);
              const nodeType = node.isCanonical ? 'Active' : 'Standby';

              return (
                <TableRow
                  key={node.nodeId}
                  className="cursor-pointer border-zinc-800/50 hover:bg-zinc-800/30 focus-visible:bg-zinc-800/30 focus-visible:outline-none"
                  onClick={() => onNodeClick?.(node)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNodeClick?.(node);
                    }
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {avatarUrl ? <AvatarImage src={avatarUrl} alt={operatorName || `Node ${node.nodeId}`} /> : null}
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs font-mono">
                          {node.nodeId}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200 truncate max-w-[140px]">
                          {operatorName || `Node #${node.nodeId}`}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">#{node.nodeId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <NodeStatusBadge
                      status={status?.status || 'unknown'}
                      health={health}
                      showLabel
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs ${
                        node.isCanonical
                          ? 'text-zinc-300 font-medium'
                          : 'text-zinc-500'
                      }`}
                    >
                      {nodeType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {region ? (
                      <div className="flex items-center gap-1 text-zinc-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs">{region}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-zinc-400 truncate max-w-[200px]" title={node.httpAddress}>
                      {node.httpAddress}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-zinc-500">{formatAddress(node.owner)}</span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
