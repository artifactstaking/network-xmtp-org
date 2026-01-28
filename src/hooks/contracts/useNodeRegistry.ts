import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { Address, Abi, getContract } from 'viem';
import { useWalletClient, usePublicClient } from 'wagmi';
import { settlementChain } from '@/constants/chains';
import { hasContract } from '@/utils/typeGuards';
import NodeRegistryAbiJson from '@/abi/NodeRegistry.abi.json';
import { useContractTransaction, TransactionStatus } from './useContractTransaction';
import { NodeData, RawNodeData } from '@/types/nodes';

// Track in-flight requests to prevent duplicate fetches
const pendingRequests: Record<string, boolean> = {};

/**
 * Generic read result structure for NodeRegistry read operations
 */
export interface NodeRegistryReadResult<T> {
  /** The fetched data, null if not yet loaded or error occurred */
  value: T | null;

  /** Whether the data is currently being fetched */
  isLoading: boolean;

  /** Error message if the fetch failed, null otherwise */
  error: string | null;

  /** Function to manually re-trigger the data fetch */
  refetch: () => Promise<void>;
}

/**
 * Write operation result structure
 */
export interface NodeRegistryWriteResult {
  /** Current transaction status */
  status: TransactionStatus;

  /** Transaction hash if available */
  txHash: string | null;

  /** Any error encountered during the transaction */
  error: unknown;

  /** Function to reset the transaction state */
  reset: () => void;
}

/**
 * Set HTTP address operation interface
 */
export interface SetHttpAddressOperation extends NodeRegistryWriteResult {
  /**
   * Update the HTTP address for a node (owner only)
   * @param nodeId - The node ID to update
   * @param httpAddress - The new HTTP address
   */
  sendTransaction: (nodeId: number, httpAddress: string) => Promise<void>;
}

/**
 * Complete return type for the useNodeRegistry hook
 */
export interface UseNodeRegistryResult {
  // Read Operations
  /** Get all nodes from the registry */
  getAllNodes: NodeRegistryReadResult<NodeData[]>;

  /** Get canonical node IDs */
  getCanonicalNodes: NodeRegistryReadResult<number[]>;

  /** Get total node count */
  getAllNodesCount: NodeRegistryReadResult<number>;

  /** Get the token URI for a specific node */
  getTokenURI: (nodeId: number) => Promise<string | null>;

  /** Get the owner of a specific node */
  getOwnerOf: (nodeId: number) => Promise<Address | null>;

  // Write Operations
  /** Update the HTTP address for a node */
  setHttpAddress: SetHttpAddressOperation;

  // Helpers
  /** Check if an address is the owner of a specific node */
  isOwner: (nodeId: number, address?: Address) => Promise<boolean>;
}

/**
 * React hook to interact with the NodeRegistry contract
 *
 * This hook provides a comprehensive interface for all NodeRegistry contract interactions,
 * including read operations for node data and write operations for node owners.
 *
 * @returns {UseNodeRegistryResult} Object containing all contract interaction methods and state
 */
export function useNodeRegistry(): UseNodeRegistryResult {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const isInitializedRef = useRef(false);

  // Validate contract configuration
  if (!hasContract(settlementChain.contracts, 'nodeRegistry')) {
    throw new Error('NodeRegistry contract not defined for settlementChain');
  }

  const nodeRegistryAddress = settlementChain.contracts.nodeRegistry.address as Address;

  // Write operation hook
  const setHttpAddressTx = useContractTransaction();

  // Read operation states
  const [getAllNodesState, setGetAllNodesState] = useState<{
    value: NodeData[] | null;
    isLoading: boolean;
    error: string | null;
  }>({ value: null, isLoading: false, error: null });

  const [getCanonicalNodesState, setGetCanonicalNodesState] = useState<{
    value: number[] | null;
    isLoading: boolean;
    error: string | null;
  }>({ value: null, isLoading: false, error: null });

  const [getAllNodesCountState, setGetAllNodesCountState] = useState<{
    value: number | null;
    isLoading: boolean;
    error: string | null;
  }>({ value: null, isLoading: false, error: null });

  // Memoize contract instance for type-safe calls
  const contract = useMemo(() => {
    return publicClient
      ? getContract({
          address: nodeRegistryAddress,
          abi: NodeRegistryAbiJson as Abi,
          client: publicClient,
        })
      : null;
  }, [nodeRegistryAddress, publicClient]);

  // Memoize wallet contract instance for writes
  const walletContract = useMemo(() => {
    return walletClient
      ? getContract({
          address: nodeRegistryAddress,
          abi: NodeRegistryAbiJson as Abi,
          client: walletClient,
        })
      : null;
  }, [nodeRegistryAddress, walletClient]);

  /**
   * Internal function to fetch all nodes
   */
  const _fetchAllNodes = useCallback(async () => {
    if (!contract) return;

    const requestKey = `${nodeRegistryAddress}_all_nodes`;

    if (pendingRequests[requestKey]) return;

    setGetAllNodesState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      pendingRequests[requestKey] = true;

      const result = (await contract.read.getAllNodes()) as RawNodeData[];

      // Fetch owners for all nodes in parallel
      const nodesWithOwners = await Promise.all(
        result.map(async (rawNode) => {
          let owner: Address = '0x0000000000000000000000000000000000000000';
          try {
            owner = (await contract.read.ownerOf([rawNode.nodeId])) as Address;
          } catch {
            // Node might not exist or other error
          }

          return {
            nodeId: rawNode.nodeId,
            signer: rawNode.node.signer,
            isCanonical: rawNode.node.isCanonical,
            signingPublicKey: rawNode.node.signingPublicKey,
            httpAddress: rawNode.node.httpAddress,
            owner,
          } as NodeData;
        })
      );

      setGetAllNodesState({
        value: nodesWithOwners,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setGetAllNodesState({
        value: null,
        isLoading: false,
        error: (err as Error).message,
      });
    } finally {
      pendingRequests[requestKey] = false;
    }
  }, [contract, nodeRegistryAddress]);

  /**
   * Internal function to fetch canonical node IDs
   */
  const _fetchCanonicalNodes = useCallback(async () => {
    if (!contract) return;

    const requestKey = `${nodeRegistryAddress}_canonical_nodes`;

    if (pendingRequests[requestKey]) return;

    setGetCanonicalNodesState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      pendingRequests[requestKey] = true;

      const result = (await contract.read.getCanonicalNodes()) as number[];

      setGetCanonicalNodesState({
        value: result.map(Number),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setGetCanonicalNodesState({
        value: null,
        isLoading: false,
        error: (err as Error).message,
      });
    } finally {
      pendingRequests[requestKey] = false;
    }
  }, [contract, nodeRegistryAddress]);

  /**
   * Internal function to fetch total node count
   */
  const _fetchAllNodesCount = useCallback(async () => {
    if (!contract) return;

    const requestKey = `${nodeRegistryAddress}_all_nodes_count`;

    if (pendingRequests[requestKey]) return;

    setGetAllNodesCountState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      pendingRequests[requestKey] = true;

      const result = (await contract.read.getAllNodesCount()) as number;

      setGetAllNodesCountState({
        value: Number(result),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setGetAllNodesCountState({
        value: null,
        isLoading: false,
        error: (err as Error).message,
      });
    } finally {
      pendingRequests[requestKey] = false;
    }
  }, [contract, nodeRegistryAddress]);

  /**
   * Get the token URI for a specific node
   */
  const getTokenURI = useCallback(
    async (nodeId: number): Promise<string | null> => {
      if (!contract) return null;

      try {
        const result = (await contract.read.tokenURI([nodeId])) as string;
        return result;
      } catch {
        return null;
      }
    },
    [contract]
  );

  /**
   * Get the owner of a specific node
   */
  const getOwnerOf = useCallback(
    async (nodeId: number): Promise<Address | null> => {
      if (!contract) return null;

      try {
        const result = (await contract.read.ownerOf([nodeId])) as Address;
        return result;
      } catch {
        return null;
      }
    },
    [contract]
  );

  /**
   * Check if an address is the owner of a specific node
   */
  const isOwner = useCallback(
    async (nodeId: number, address?: Address): Promise<boolean> => {
      if (!address || !contract) return false;

      try {
        const owner = await getOwnerOf(nodeId);
        return owner?.toLowerCase() === address.toLowerCase();
      } catch {
        return false;
      }
    },
    [contract, getOwnerOf]
  );

  /**
   * Set HTTP address operation implementation
   */
  const setHttpAddress = useCallback(
    async (nodeId: number, httpAddress: string) => {
      if (!walletContract) throw new Error('Wallet client not available');

      await setHttpAddressTx.sendTransaction(async () => {
        const hash = await walletContract.write.setHttpAddress([nodeId, httpAddress]);
        return hash;
      });
    },
    [walletContract, setHttpAddressTx]
  );

  // Auto-fetch on mount - ONLY ONCE
  useEffect(() => {
    if (publicClient && !isInitializedRef.current) {
      isInitializedRef.current = true;

      // Batch fetch the most critical data
      Promise.allSettled([_fetchAllNodes(), _fetchCanonicalNodes(), _fetchAllNodesCount()]);
    }
  }, [publicClient, _fetchAllNodes, _fetchCanonicalNodes, _fetchAllNodesCount]);

  // Refetch after successful write operations
  useEffect(() => {
    if (setHttpAddressTx.status === 'success') {
      _fetchAllNodes();
    }
  }, [setHttpAddressTx.status, _fetchAllNodes]);

  return {
    // Read Operations
    getAllNodes: {
      ...getAllNodesState,
      refetch: _fetchAllNodes,
    },
    getCanonicalNodes: {
      ...getCanonicalNodesState,
      refetch: _fetchCanonicalNodes,
    },
    getAllNodesCount: {
      ...getAllNodesCountState,
      refetch: _fetchAllNodesCount,
    },
    getTokenURI,
    getOwnerOf,

    // Write Operations
    setHttpAddress: {
      status: setHttpAddressTx.status,
      txHash: setHttpAddressTx.txHash,
      error: setHttpAddressTx.error,
      sendTransaction: setHttpAddress,
      reset: setHttpAddressTx.reset,
    },

    // Helpers
    isOwner,
  };
}
