import React from 'react';
import { cn } from '@/utils/cn';
import { NetworkStatus } from '@/types/nodes';
import { getStatusConfig } from '@/utils/networkStatus';

type IndicatorSize = 'sm' | 'md' | 'lg';

interface NetworkStatusIndicatorProps {
  status: NetworkStatus;
  size?: IndicatorSize;
  showLabel?: boolean;
  className?: string;
}

const sizeClasses: Record<IndicatorSize, { dot: string; text: string }> = {
  sm: { dot: 'h-2 w-2', text: 'text-sm' },
  md: { dot: 'h-3 w-3', text: 'text-base' },
  lg: { dot: 'h-4 w-4', text: 'text-lg' },
};

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const config = getStatusConfig(status);
  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(sizes.dot, 'rounded-full animate-pulse', config.dotClass)}
        style={{ backgroundColor: config.color }}
      />
      {showLabel && (
        <span className={cn(sizes.text, 'font-medium')} style={{ color: config.color }}>
          {config.label}
        </span>
      )}
    </div>
  );
};
