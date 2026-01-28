import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/base';
import { Label, Body, Caption } from '@/components/typography';
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
          <TableRow>
            <TableHead className="min-w-[200px]">
              <Label>Node</Label>
            </TableHead>
            <TableHead className="w-24">
              <Label>Status</Label>
            </TableHead>
            <TableHead className="w-28">
              <Label>Location</Label>
            </TableHead>
            <TableHead className="min-w-[200px]">
              <Label>HTTP Address</Label>
            </TableHead>
            <TableHead className="w-32">
              <Label>Owner</Label>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <Body className="text-secondary">No nodes found</Body>
              </TableCell>
            </TableRow>
          ) : (
            nodes.map((node) => {
              const status = getStatus(node.nodeId);
              const health = statusMap?.get(node.nodeId);
              const region = getRegion(node);
              const operatorName = getOperatorName(node);
              const avatarUrl = getAvatarUrl(node);

              return (
                <TableRow
                  key={node.nodeId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onNodeClick?.(node)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {avatarUrl ? <AvatarImage src={avatarUrl} alt={operatorName || `Node ${node.nodeId}`} /> : null}
                        <AvatarFallback className="bg-accent/10 text-accent text-sm">
                          {node.nodeId}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Body className="font-semibold truncate max-w-[140px]">{operatorName || `Node #${node.nodeId}`}</Body>
                          {node.isCanonical && (
                            <Badge variant="default" className="bg-accent text-white text-xs">
                              C
                            </Badge>
                          )}
                        </div>
                        <Caption className="text-gray-500">XMTP Node #{node.nodeId}</Caption>
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
                    {region ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3.5 w-3.5" />
                        <Caption>{region}</Caption>
                      </div>
                    ) : (
                      <Caption className="text-gray-400">—</Caption>
                    )}
                  </TableCell>
                  <TableCell>
                    <Caption className="font-mono truncate max-w-[200px]" title={node.httpAddress}>
                      {node.httpAddress}
                    </Caption>
                  </TableCell>
                  <TableCell>
                    <Caption className="font-mono">{formatAddress(node.owner)}</Caption>
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
