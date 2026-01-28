import { useCallback } from 'react';
import { formatUnits } from 'viem';
import { format } from 'date-fns';

/**
 * Returns formatter functions for currency, address, date, gwei, seconds, and input formatting.
 * All formatters are memoized for stable references.
 */
export function useFormatters() {
  // Currency Formatters

  /**
   * Formats a number as two decimal places (e.g., "123.45").
   * @param value - The numeric value to format
   * @returns The formatted currency string
   */
  const formatCurrency = useCallback((value: number): string => {
    return `${value.toFixed(2)}`;
  }, []);

  const formatBalance = useCallback(
    (value: number | bigint | string = 0, decimals = 6, symbol: string | null = null) => {
      const suffix = symbol ? ` ${symbol}` : '';

      // Handle raw bigint values (e.g., from contracts)
      if (typeof value === 'bigint') return `~$${formatUnits(value, decimals)}${suffix}`;

      if (typeof value !== 'string') return `~$${value.toFixed(2)}${suffix}`;

      // Handle already-formatted strings - parse carefully to preserve precision
      const numValue = parseFloat(value);

      if (isNaN(numValue)) return `~$0.00${suffix}`;

      // For strings that are already properly formatted, preserve more precision
      // Only round to 2 decimals for display if the value is very small or has excessive precision
      const formatted =
        numValue < 0.01 && numValue > 0
          ? numValue.toFixed(6).replace(/\.?0+$/, '')
          : numValue.toFixed(2);

      return `~$${formatted}${suffix}`;
    },
    []
  );

  // Onchain Data Formatters

  /**
   * Shortens an EVM address (e.g., "0x1234...abcd").
   * @param address - The address to format
   * @returns The shortened address string, or empty string if falsy
   */
  const formatAddress = useCallback((address: string): string => {
    return address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';
  }, []);

  /**
   * Formats a value in wei as Gwei (e.g., 12345678900 -> "12.35").
   * @param wei - The value in wei
   * @returns The formatted Gwei string
   */
  const formatGwei = useCallback((wei: number): string => {
    return (wei / 1e9).toFixed(2);
  }, []);

  /**
   * Shortens a transaction hash (e.g., "0x1234...6789").
   * @param hash - The transaction hash to format
   * @returns The truncated hash string, or empty string if falsy
   */
  const formatTxHash = useCallback((hash: string): string => {
    return hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : '';
  }, []);

  // Date Formatters

  /**
   * Formats a date string as a locale string.
   * @param date - The ISO date string or date input
   * @returns The formatted date string
   */
  const formatDate = useCallback((date: string | number | Date): string => {
    return new Date(date).toLocaleString();
  }, []);

  /**
   * Formats a value in milliseconds as seconds (e.g., 1234 -> "1.23").
   * @param ms - The value in milliseconds
   * @returns The formatted seconds string
   */
  const formatSeconds = useCallback((ms: number): string => {
    return (ms / 1000).toFixed(2);
  }, []);

  /**
   * Formats a date as 'Month YYYY' (e.g., 'April 2025').
   * @param date - The date to format
   * @returns The formatted month and year string
   */
  const formatMonthYear = useCallback((date: string | number | Date): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  /**
   * Formats a date as 'Mon DD' (e.g., 'Apr 29').
   * @param date - The date to format
   * @returns The formatted short date string
   */
  const formatShortDate = useCallback((date: string | number | Date): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
    });
  }, []);

  /**
   * Formats a value in seconds as hours (e.g., 7200 -> "2").
   * @param seconds - The value in seconds
   * @returns The formatted hours string as a whole number
   */
  const formatSecondsToHours = useCallback((seconds: number): string => {
    const hours = Math.round(seconds / 3600);
    return hours.toString();
  }, []);

  /**
   * Formats a date as 'MMM DD · HH:mm' (e.g., 'Apr 13 · 10:31').
   * @param date - The date to format
   * @returns The formatted date string with middot separator
   */
  const formatTransactionDate = useCallback((date: string | number | Date): string => {
    return format(date, 'MMM dd · HH:mm');
  }, []);

  /**
   * Formats estimated hours into human-readable countdown format.
   * @param estimatedHours - The estimated hours (can be fractional)
   * @returns Formatted countdown string (e.g., '30 mins', '2 hrs', '1 day')
   */
  const formatCountdown = useCallback((estimatedHours: number): string => {
    if (estimatedHours < 1) {
      // Convert to minutes for sub-hour values
      const minutes = Math.round(estimatedHours * 60);
      return minutes <= 1 ? '1 min' : `${minutes} mins`;
    } else if (estimatedHours < 24) {
      // Display in hours for 1-23 hours
      const hours = Math.round(estimatedHours);
      return hours === 1 ? '1 hr' : `${hours} hrs`;
    } else {
      // Display in days for 24+ hours
      const days = Math.round(estimatedHours / 24);
      return days === 1 ? '1 day' : `${days} days`;
    }
  }, []);

  // Other Formatters

  /**
   * Ensures a leading zero for decimal input strings (e.g., ".25" -> "0.25").
   * @param input - The input string
   * @returns The formatted string with leading zero if needed
   */
  const formatInputWithLeadingZero = useCallback((input: string): string => {
    return input.startsWith('.') || input.startsWith('-.') ? `0${input}` : input;
  }, []);

  return {
    formatCurrency,
    formatBalance,
    formatAddress,
    formatDate,
    formatGwei,
    formatSeconds,
    formatInputWithLeadingZero,
    formatMonthYear,
    formatShortDate,
    formatTxHash,
    formatSecondsToHours,
    formatTransactionDate,
    formatCountdown,
  };
}
