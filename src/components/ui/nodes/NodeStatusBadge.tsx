import React from 'react';
import { cn } from '@/utils/cn';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base';
import { NodeStatus, NodeHealthResult } from '@/types/nodes';
import { Caption } from '@/components/typography';

interface NodeStatusBadgeProps {
  status: NodeStatus;
  health?: NodeHealthResult;
  showLabel?: boolean;
  className?: string;
}

const statusConfig: Record<NodeStatus, { color: string; bgColor: string; label: string }> = {
  online: {
    color: 'bg-green-500',
    bgColor: 'bg-green-100',
    label: 'Online',
  },
  offline: {
    color: 'bg-red-500',
    bgColor: 'bg-red-100',
    label: 'Offline',
  },
  error: {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-100',
    label: 'Error',
  },
  unknown: {
    color: 'bg-gray-400',
    bgColor: 'bg-gray-100',
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
        <strong>Status:</strong> {config.label}
      </div>
      {health.version && (
        <div>
          <strong>Version:</strong> {health.version}
        </div>
      )}
      {health.latencyMs !== undefined && (
        <div>
          <strong>Latency:</strong> {health.latencyMs}ms
        </div>
      )}
      {health.error && (
        <div>
          <strong>Error:</strong> {health.error}
        </div>
      )}
      {health.lastChecked && (
        <div>
          <strong>Last checked:</strong> {health.lastChecked.toLocaleTimeString()}
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
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
              config.bgColor,
              className
            )}
          >
            <span className={cn('w-2 h-2 rounded-full', config.color)} />
            {showLabel && <Caption className="text-primary font-medium">{config.label}</Caption>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
