import { NetworkStatus } from '@/types/nodes';

/**
 * Status configuration for display purposes
 */
export interface StatusConfig {
  label: string;
  color: string;
  bgClass: string;
  dotClass: string;
}

/**
 * Calculate network status based on canonical node health
 *
 * Thresholds:
 * - Operational: ≥80% canonical nodes online
 * - Degraded: 50-79% canonical nodes online
 * - Major Outage: 1-49% canonical nodes online
 * - Outage: 0% canonical nodes online
 */
export function calculateNetworkStatus(
  canonicalOnline: number,
  canonicalTotal: number
): NetworkStatus {
  if (canonicalTotal === 0) {
    return 'outage';
  }

  const percentage = (canonicalOnline / canonicalTotal) * 100;

  if (percentage >= 80) {
    return 'operational';
  } else if (percentage >= 50) {
    return 'degraded';
  } else if (percentage >= 1) {
    return 'major-outage';
  } else {
    return 'outage';
  }
}

/**
 * Get display configuration for a network status
 */
export function getStatusConfig(status: NetworkStatus): StatusConfig {
  switch (status) {
    case 'operational':
      return {
        label: 'All Systems Operational',
        color: '#22c55e', // green-500
        bgClass: 'bg-green-50',
        dotClass: 'bg-green-500',
      };
    case 'degraded':
      return {
        label: 'Degraded Performance',
        color: '#eab308', // yellow-500
        bgClass: 'bg-yellow-50',
        dotClass: 'bg-yellow-500',
      };
    case 'major-outage':
      return {
        label: 'Major Outage',
        color: '#f97316', // orange-500
        bgClass: 'bg-orange-50',
        dotClass: 'bg-orange-500',
      };
    case 'outage':
      return {
        label: 'Outage',
        color: '#ef4444', // red-500
        bgClass: 'bg-red-50',
        dotClass: 'bg-red-500',
      };
  }
}

/**
 * Format a relative time string (e.g., "5 seconds ago")
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) {
    return 'Never';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 5) {
    return 'Just now';
  } else if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
}
