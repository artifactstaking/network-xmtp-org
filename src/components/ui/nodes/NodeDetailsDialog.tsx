import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
} from '@/components/base';
import { Body, Label, Caption } from '@/components/typography';
import { NodeStatusBadge } from './NodeStatusBadge';
import { NodeData, NodeMetadata, NodeHealthResult } from '@/types/nodes';
import { useFormatters } from '@/hooks/utils/useFormatters';
import { ExternalLink, Copy, Check, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface NodeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: NodeData | null;
  metadata?: NodeMetadata | null;
  health?: NodeHealthResult;
}

export const NodeDetailsDialog: React.FC<NodeDetailsDialogProps> = ({
  open,
  onOpenChange,
  node,
  metadata,
  health,
}) => {
  const { formatAddress } = useFormatters();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!node) return null;

  // Extract metadata fields
  const operatorName = metadata?.operator_name || null;
  const displayName = operatorName || `Node #${node.nodeId}`;
  const region = metadata?.region || null;
  const discord = metadata?.social?.discord || null;
  const avatarUrl = metadata?.image || undefined;
  const status = health?.status || 'unknown';

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      onClick={() => copyToClipboard(text, field)}
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">{displayName}</DialogTitle>
          <DialogDescription>XMTP Node #{node.nodeId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with avatar, badges, and status */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-accent/10 text-accent text-lg">
                {node.nodeId}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {node.isCanonical && (
                  <Badge variant="default" className="bg-accent text-white">
                    Canonical
                  </Badge>
                )}
                <NodeStatusBadge status={status} health={health} showLabel />
              </div>
              {region && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <Caption>{region}</Caption>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {metadata?.description && (
            <div>
              <Label className="text-secondary mb-1 block">Description</Label>
              <Body>{metadata.description}</Body>
            </div>
          )}

          {/* Details grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <Label className="text-secondary">HTTP Address</Label>
              <div className="flex items-center gap-1">
                <Caption className="font-mono max-w-[250px] truncate" title={node.httpAddress}>
                  {node.httpAddress}
                </Caption>
                <CopyButton text={node.httpAddress} field="httpAddress" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <Label className="text-secondary">Owner</Label>
              <div className="flex items-center gap-1">
                <Caption className="font-mono">{formatAddress(node.owner)}</Caption>
                <CopyButton text={node.owner} field="owner" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <Label className="text-secondary">Signer</Label>
              <div className="flex items-center gap-1">
                <Caption className="font-mono">{formatAddress(node.signer)}</Caption>
                <CopyButton text={node.signer} field="signer" />
              </div>
            </div>

            {health?.version && (
              <div className="flex items-center justify-between py-2 border-b">
                <Label className="text-secondary">Version</Label>
                <Caption>{health.version}</Caption>
              </div>
            )}

            {health?.latencyMs !== undefined && (
              <div className="flex items-center justify-between py-2 border-b">
                <Label className="text-secondary">Latency</Label>
                <Caption>{health.latencyMs}ms</Caption>
              </div>
            )}

            {health?.lastChecked && (
              <div className="flex items-center justify-between py-2 border-b">
                <Label className="text-secondary">Last Checked</Label>
                <Caption>{health.lastChecked.toLocaleString()}</Caption>
              </div>
            )}
          </div>

          {/* Signing public key (collapsible) */}
          <div>
            <Label className="text-secondary mb-1 block">Signing Public Key</Label>
            <div className="bg-muted/50 rounded p-2 flex items-center gap-2">
              <Caption className="font-mono break-all flex-1 text-xs">
                {node.signingPublicKey}
              </Caption>
              <CopyButton text={node.signingPublicKey} field="publicKey" />
            </div>
          </div>

          {/* External links */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {metadata?.external_url && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(metadata.external_url, '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Website
              </Button>
            )}

            {metadata?.social?.twitter && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://twitter.com/${metadata.social!.twitter!.replace('@', '')}`,
                    '_blank'
                  )
                }
              >
                Twitter
              </Button>
            )}

            {discord && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const discordUrl = discord.startsWith('http')
                    ? discord
                    : `https://discord.gg/${discord}`;
                  window.open(discordUrl, '_blank');
                }}
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Discord
              </Button>
            )}

            {metadata?.social?.convos && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const convos = metadata.social!.convos!;
                  const convosUrl = convos.startsWith('http')
                    ? convos
                    : `https://converse.xyz/dm/${convos}`;
                  window.open(convosUrl, '_blank');
                }}
              >
                Convos
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
