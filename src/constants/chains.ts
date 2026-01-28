import {
  base as defaultBase,
  baseSepolia as defaultBaseSepolia,
} from 'wagmi/chains';

import { Chain } from '@rainbow-me/rainbowkit';
import { settlementChainContracts } from './contracts';

const ENVIRONMENT_CONFIG = __APP_ENV__;

const getSettlementChain = (chainId: number) => {
  if (chainId === 8453) return defaultBase;
  if (chainId === 84532) return defaultBaseSepolia;

  throw new Error(`Unsupported settlement chain id: ${chainId}`);
};

/**
 * The settlement chain.
 * @type {Chain}
 */
export const settlementChain: Chain = {
  ...getSettlementChain(ENVIRONMENT_CONFIG.settlementChain.chainId),
  contracts: settlementChainContracts,
} as const;
