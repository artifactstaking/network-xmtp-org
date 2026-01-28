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
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      {/* Canonical Nodes */}
      <div className="bg-white rounded-lg border shadow-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <Server className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">Canonical Nodes</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{canonicalOnline}</span>
          <span className="text-gray-400">/</span>
          <span className="text-lg text-gray-500">{canonicalTotal}</span>
          <span className="text-sm text-gray-400 ml-1">online</span>
        </div>
      </div>

      {/* Community Nodes */}
      <div className="bg-white rounded-lg border shadow-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-50">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">Community Nodes</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{communityOnline}</span>
          <span className="text-gray-400">/</span>
          <span className="text-lg text-gray-500">{communityTotal}</span>
          <span className="text-sm text-gray-400 ml-1">online</span>
        </div>
      </div>

      {/* Average Latency */}
      <div className="bg-white rounded-lg border shadow-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-green-50">
            <Zap className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">Avg Response Time</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {averageLatencyMs !== null ? averageLatencyMs : '—'}
          </span>
          {averageLatencyMs !== null && (
            <span className="text-sm text-gray-400">ms</span>
          )}
        </div>
      </div>
    </div>
  );
};
