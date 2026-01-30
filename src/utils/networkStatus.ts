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
 * Uses semantic colors that work in both light and dark modes
 */
export function getStatusConfig(status: NetworkStatus): StatusConfig {
  switch (status) {
    case 'operational':
      return {
        label: 'All Systems Operational',
        color: 'hsl(142, 71%, 45%)', // emerald-500
        bgClass: 'bg-emerald-500/10',
        dotClass: 'bg-emerald-500',
      };
    case 'degraded':
      return {
        label: 'Degraded Performance',
        color: 'hsl(45, 93%, 47%)', // amber-500
        bgClass: 'bg-amber-500/10',
        dotClass: 'bg-amber-500',
      };
    case 'major-outage':
      return {
        label: 'Major Outage',
        color: 'hsl(25, 95%, 53%)', // orange-500
        bgClass: 'bg-orange-500/10',
        dotClass: 'bg-orange-500',
      };
    case 'outage':
      return {
        label: 'Outage',
        color: 'hsl(0, 84%, 60%)', // destructive-like red
        bgClass: 'bg-destructive/10',
        dotClass: 'bg-destructive',
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
