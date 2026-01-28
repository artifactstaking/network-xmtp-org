import { ChainContract } from 'viem';

const ENVIRONMENT_CONFIG = __APP_ENV__;

/** Configuration for contracts on the settlement chain. */

export interface SettlementChainContracts extends Record<string, ChainContract> {
  nodeRegistry: ChainContract;
}

export const settlementChainContracts: SettlementChainContracts = {
  nodeRegistry: {
    address: ENVIRONMENT_CONFIG.settlementChain.nodeRegistry,
    blockCreated: undefined,
  },
} as const;
