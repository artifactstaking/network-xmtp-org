import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
} from '@/components/base';
import { NodeStatusBadge } from './NodeStatusBadge';
import { NodeData, NodeMetadata, NodeHealthResult } from '@/types/nodes';
import { useFormatters } from '@/hooks/utils/useFormatters';
import { ExternalLink, Copy, Check, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { DIALOG_STYLES } from '@/utils/dialogStyles';
import { cn } from '@/utils/cn';

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
  const nodeType = node.isCanonical ? 'Active' : 'Standby';

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 hover:bg-zinc-800"
      onClick={() => copyToClipboard(text, field)}
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3 text-zinc-500" />
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'w-[calc(100vw-40px)] max-w-lg',
          DIALOG_STYLES.padding,
          DIALOG_STYLES.shadow,
          DIALOG_STYLES.contentScrollable
        )}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-medium text-zinc-100">{displayName}</DialogTitle>
          <DialogDescription className="text-zinc-500">
            {nodeType} Node · #{node.nodeId}
          </DialogDescription>
        </DialogHeader>

        <div className={cn('space-y-6', DIALOG_STYLES.contentGap)}>
          {/* Header with avatar and status */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-base font-mono">
                {node.nodeId}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex items-center justify-between">
              <NodeStatusBadge status={status} health={health} showLabel />
              {region && (
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">{region}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {metadata?.description && (
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Description</span>
              <p className="text-sm text-zinc-300">{metadata.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
              <span className="text-xs text-zinc-500">HTTP Address</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-zinc-300 max-w-[250px] truncate" title={node.httpAddress}>
                  {node.httpAddress}
                </span>
                <CopyButton text={node.httpAddress} field="httpAddress" />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
              <span className="text-xs text-zinc-500">Owner</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-zinc-300">{formatAddress(node.owner)}</span>
                <CopyButton text={node.owner} field="owner" />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
              <span className="text-xs text-zinc-500">Signer</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-zinc-300">{formatAddress(node.signer)}</span>
                <CopyButton text={node.signer} field="signer" />
              </div>
            </div>

            {health?.version && (
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
                <span className="text-xs text-zinc-500">Version</span>
                <span className="text-xs text-zinc-300">{health.version}</span>
              </div>
            )}

            {health?.latencyMs !== undefined && (
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
                <span className="text-xs text-zinc-500">Latency</span>
                <span className="text-xs text-zinc-300">{health.latencyMs}ms</span>
              </div>
            )}

            {health?.lastChecked && (
              <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
                <span className="text-xs text-zinc-500">Last Checked</span>
                <span className="text-xs text-zinc-300">{health.lastChecked.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Signing public key */}
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">Signing Public Key</span>
            <div className="bg-zinc-800/50 rounded-lg p-3 flex items-center gap-2 ring-1 ring-zinc-700/50">
              <span className="font-mono break-all flex-1 text-[10px] text-zinc-400">
                {node.signingPublicKey}
              </span>
              <CopyButton text={node.signingPublicKey} field="publicKey" />
            </div>
          </div>

          {/* External links */}
          {(metadata?.external_url || metadata?.social?.twitter || discord || metadata?.social?.convos) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {metadata?.external_url && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(metadata.external_url, '_blank')}
                  className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-0"
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
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-0"
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
                  className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-0"
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
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-0"
                >
                  Convos
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
