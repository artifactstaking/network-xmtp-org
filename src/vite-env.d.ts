/// <reference types="vite/client" />

interface EnvironmentConfig {
  settlementChain: {
    chainId: number;
    publicRpcUrl: string;
    nodeRegistry: `0x${string}`;
  };
}

declare const __APP_ENV__: EnvironmentConfig;

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
