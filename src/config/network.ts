/**
 * Network configuration utilities
 * Derives network info from the environment configuration
 */

const ENVIRONMENT_CONFIG = __APP_ENV__;

/**
 * Settlement chain ID from environment
 * 84532 = Base Sepolia (testnet)
 * 8453 = Base (mainnet)
 */
export const settlementChainId = ENVIRONMENT_CONFIG.settlementChain.chainId;

/**
 * Whether the app is running on testnet
 */
export const isTestnet = settlementChainId === 84532;

/**
 * Whether the app is running on mainnet
 */
export const isMainnet = settlementChainId === 8453;

/**
 * Network name identifier (lowercase)
 * Used for URLs, API calls, etc.
 */
export const networkName = isMainnet ? 'mainnet' : 'testnet';

/**
 * Network label (capitalized)
 * Used for badges, labels, etc.
 */
export const networkLabel = isMainnet ? 'Mainnet' : 'Testnet';

/**
 * Full network display name
 * Used for headers, titles, etc.
 */
export const networkDisplayName = isMainnet ? 'XMTP Mainnet' : 'XMTP Testnet';

/**
 * Network configuration object
 * Convenient for passing around as a single object
 */
export const networkConfig = {
  chainId: settlementChainId,
  isTestnet,
  isMainnet,
  name: networkName,
  label: networkLabel,
  displayName: networkDisplayName,
} as const;
