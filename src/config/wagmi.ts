import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';

const ENVIRONMENT_CONFIG = __APP_ENV__;

// Determine which chain to use based on environment
const settlementChain =
  ENVIRONMENT_CONFIG.settlementChain.chainId === 8453 ? base : baseSepolia;

export const config = getDefaultConfig({
  appName: 'XMTP Node Registry',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [settlementChain],
  transports: {
    [settlementChain.id]: http(ENVIRONMENT_CONFIG.settlementChain.publicRpcUrl),
  },
  ssr: false,
});
