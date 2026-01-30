import React from 'react';
import { cn } from '@/utils/cn';
import { NetworkStatusInfo } from '@/types/nodes';
import { Server, Users, Zap } from 'lucide-react';

interface StatusSummaryCardsProps {
  statusInfo: NetworkStatusInfo;
  className?: string;
}

export const StatusSummaryCards: React.FC<StatusSummaryCardsProps> = ({
  statusInfo,
  className,
}) => {
  const { canonicalOnline, canonicalTotal, communityOnline, communityTotal, averageLatencyMs } =
    statusInfo;

  return (
    <div className={cn('grid grid-cols-1 mobile:grid-cols-3 gap-3', className)}>
      {/* Active Nodes */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800/50 p-4 ring-1 ring-zinc-800/50">
        <div className="flex mobile:flex-col mobile:items-start items-center gap-3 mobile:gap-2">
          <div className="p-2 rounded bg-zinc-800/50 ring-1 ring-zinc-700/50">
            <Server className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex-1 mobile:flex-none">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active Nodes</span>
            <div className="flex items-baseline gap-1 mobile:mt-0.5">
              <span className="text-xl font-semibold text-zinc-100 tabular-nums">{canonicalOnline}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-base text-zinc-500 tabular-nums">{canonicalTotal}</span>
              <span className="text-xs text-zinc-600 ml-1">online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standby Nodes */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800/50 p-4 ring-1 ring-zinc-800/50">
        <div className="flex mobile:flex-col mobile:items-start items-center gap-3 mobile:gap-2">
          <div className="p-2 rounded bg-zinc-800/50 ring-1 ring-zinc-700/50">
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex-1 mobile:flex-none">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Standby Nodes</span>
            <div className="flex items-baseline gap-1 mobile:mt-0.5">
              <span className="text-xl font-semibold text-zinc-100 tabular-nums">{communityOnline}</span>
              <span className="text-zinc-600">/</span>
              <span className="text-base text-zinc-500 tabular-nums">{communityTotal}</span>
              <span className="text-xs text-zinc-600 ml-1">online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Average Latency */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800/50 p-4 ring-1 ring-zinc-800/50">
        <div className="flex mobile:flex-col mobile:items-start items-center gap-3 mobile:gap-2">
          <div className="p-2 rounded bg-zinc-800/50 ring-1 ring-zinc-700/50">
            <Zap className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex-1 mobile:flex-none">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Avg Response</span>
            <div className="flex items-baseline gap-1 mobile:mt-0.5">
              <span className="text-xl font-semibold text-zinc-100 tabular-nums">
                {averageLatencyMs !== null ? averageLatencyMs : '—'}
              </span>
              {averageLatencyMs !== null && (
                <span className="text-xs text-zinc-600">ms</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
