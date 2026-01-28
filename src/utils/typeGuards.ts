/**
 * Generic type guard to check if a contract property exists and has an address string.
 */
export function hasContract<K extends string>(
  contracts: unknown,
  key: K
): contracts is Record<K, { address: string }> {
  return (
    typeof contracts === 'object' &&
    contracts !== null &&
    key in contracts &&
    typeof (contracts as Record<K, { address: string }>)[key]?.address === 'string'
  );
}

/**
 * Type guard to check if an object is a valid chain config with id, name, and contracts properties.
 */
export function isChainConfig(
  obj: unknown
): obj is { id: number; name: string; contracts: object } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as { id: number }).id === 'number' &&
    typeof (obj as { name: string }).name === 'string' &&
    typeof (obj as { contracts: object }).contracts === 'object' &&
    (obj as { contracts: object }).contracts !== null
  );
}
