import React from 'react';
import { cn } from '@/utils/cn';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base';
import { NodeStatus, NodeHealthResult } from '@/types/nodes';

interface NodeStatusBadgeProps {
  status: NodeStatus;
  health?: NodeHealthResult;
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<NodeStatus, { dotClass: string; bgClass: string; textClass: string; label: string }> = {
  online: {
    dotClass: 'bg-emerald-400',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    label: 'Online',
  },
  offline: {
    dotClass: 'bg-red-400',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    label: 'Offline',
  },
  error: {
    dotClass: 'bg-amber-400',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    label: 'Error',
  },
  unknown: {
    dotClass: 'bg-zinc-500',
    bgClass: 'bg-zinc-700/50',
    textClass: 'text-zinc-400',
    label: 'Unknown',
  },
};

export const NodeStatusBadge: React.FC<NodeStatusBadgeProps> = ({
  status,
  health,
  showLabel = true,
  className,
}) => {
  const config = statusConfig[status];

  const tooltipContent = health ? (
    <div className="flex flex-col gap-1 text-xs">
      <div>
        <span className="text-zinc-400">Status:</span> <span className="text-zinc-200">{config.label}</span>
      </div>
      {health.version && (
        <div>
          <span className="text-zinc-400">Version:</span> <span className="text-zinc-200">{health.version}</span>
        </div>
      )}
      {health.latencyMs !== undefined && (
        <div>
          <span className="text-zinc-400">Latency:</span> <span className="text-zinc-200">{health.latencyMs}ms</span>
        </div>
      )}
      {health.error && (
        <div>
          <span className="text-zinc-400">Error:</span> <span className="text-zinc-200">{health.error}</span>
        </div>
      )}
      {health.lastChecked && (
        <div>
          <span className="text-zinc-400">Last checked:</span> <span className="text-zinc-200">{health.lastChecked.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  ) : (
    <span>{config.label}</span>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors',
              config.bgClass,
              className
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                config.dotClass,
                status === 'online' && 'animate-pulse'
              )}
            />
            {showLabel && <span className={cn('text-xs font-medium', config.textClass)}>{config.label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
