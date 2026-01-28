import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { NetworkStatusInfo } from '@/types/nodes';
import { getStatusConfig, formatRelativeTime } from '@/utils/networkStatus';
import { RefreshCw } from 'lucide-react';

interface NetworkStatusBannerProps {
  statusInfo: NetworkStatusInfo;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({
  statusInfo,
  onRefresh,
  isRefreshing = false,
  className,
}) => {
  const config = getStatusConfig(statusInfo.status);
  const [relativeTime, setRelativeTime] = useState(formatRelativeTime(statusInfo.lastChecked));

  // Update relative time every 5 seconds
  useEffect(() => {
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(statusInfo.lastChecked));
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);

    return () => clearInterval(interval);
  }, [statusInfo.lastChecked]);

  return (
    <div
      className={cn(
        'rounded-lg px-6 py-3',
        className
      )}
      style={{
        backgroundColor: config.color,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Status indicator and label */}
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-lg font-semibold text-white">
            {config.label}
          </span>
        </div>

        {/* Last updated with refresh */}
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-sm">Updated {relativeTime}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Refresh status"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
