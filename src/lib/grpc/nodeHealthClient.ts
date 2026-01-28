import { NodeHealthResult, NodeData } from '@/types/nodes';

/**
 * Default timeout for health check requests (in milliseconds)
 */
const HEALTH_CHECK_TIMEOUT = 5000;

/**
 * Default concurrency limit for batch health checks
 */
const DEFAULT_CONCURRENCY = 5;

/**
 * Create gRPC-Web request body for an empty message
 * gRPC-Web framing: 1 byte flags (0x00) + 4 bytes length (0x00000000) = 5 zero bytes
 */
function createEmptyGrpcWebRequest(): Uint8Array {
  return new Uint8Array(5); // 5 zero bytes
}

/**
 * Parse gRPC-Web response to extract the version string
 * Response format: 1 byte flags + 4 bytes length + protobuf message
 * The protobuf message for GetVersionResponse has field 1 (version) as a string
 */
function parseGrpcWebVersionResponse(data: ArrayBuffer): string | null {
  try {
    const bytes = new Uint8Array(data);

    if (bytes.length < 5) {
      return null;
    }

    // Skip gRPC-Web frame header (5 bytes: 1 flag + 4 length)
    const messageStart = 5;

    // Parse protobuf: field 1 is string (wire type 2 = length-delimited)
    // Format: field tag (0x0a = field 1, wire type 2) + varint length + string bytes
    if (bytes[messageStart] !== 0x0a) {
      return null;
    }

    const stringLength = bytes[messageStart + 1];
    const stringStart = messageStart + 2;
    const stringBytes = bytes.slice(stringStart, stringStart + stringLength);

    return new TextDecoder().decode(stringBytes);
  } catch {
    return null;
  }
}

/**
 * Check the health of a single node by calling its MetadataApi.GetVersion endpoint
 * Uses gRPC-Web protocol
 *
 * @param nodeId - The node ID
 * @param httpAddress - The node's HTTP address
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise resolving to the health check result
 */
export async function checkNodeHealth(
  nodeId: number,
  httpAddress: string,
  timeout: number = HEALTH_CHECK_TIMEOUT
): Promise<NodeHealthResult> {
  const startTime = Date.now();

  // Debug: log the address being checked
  console.log(`[NodeHealth] Checking node ${nodeId} at: ${httpAddress}`);

  // Handle empty or invalid addresses
  if (!httpAddress || httpAddress.trim() === '') {
    console.warn(`[NodeHealth] Node ${nodeId} has no HTTP address`);
    return {
      nodeId,
      httpAddress: '',
      status: 'unknown',
      lastChecked: new Date(),
      error: 'No HTTP address configured',
    };
  }

  // Normalize the HTTP address
  let baseUrl = httpAddress.trim();
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  }
  // Remove trailing slash
  baseUrl = baseUrl.replace(/\/$/, '');

  // gRPC-Web endpoint path
  const url = `${baseUrl}/xmtp.xmtpv4.metadata_api.MetadataApi/GetVersion`;
  console.log(`[NodeHealth] Full URL: ${url}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/grpc-web',
        Accept: 'application/grpc-web',
      },
      body: createEmptyGrpcWebRequest(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      return {
        nodeId,
        httpAddress,
        status: 'error',
        lastChecked: new Date(),
        latencyMs,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.arrayBuffer();
    const version = parseGrpcWebVersionResponse(data);

    if (version) {
      return {
        nodeId,
        httpAddress,
        status: 'online',
        version,
        latencyMs,
        lastChecked: new Date(),
      };
    }

    // Got a response but couldn't parse version - still consider online
    return {
      nodeId,
      httpAddress,
      status: 'online',
      version: 'unknown',
      latencyMs,
      lastChecked: new Date(),
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return {
          nodeId,
          httpAddress,
          status: 'offline',
          lastChecked: new Date(),
          latencyMs,
          error: 'Request timeout',
        };
      }

      // Network errors usually indicate the node is offline
      if (
        err.message.includes('fetch') ||
        err.message.includes('network') ||
        err.message.includes('ECONNREFUSED') ||
        err.message.includes('ENOTFOUND')
      ) {
        return {
          nodeId,
          httpAddress,
          status: 'offline',
          lastChecked: new Date(),
          latencyMs,
          error: err.message,
        };
      }

      return {
        nodeId,
        httpAddress,
        status: 'error',
        lastChecked: new Date(),
        latencyMs,
        error: err.message,
      };
    }

    return {
      nodeId,
      httpAddress,
      status: 'error',
      lastChecked: new Date(),
      latencyMs,
      error: 'Unknown error',
    };
  }
}

/**
 * Check the health of multiple nodes with concurrency control
 *
 * @param nodes - Array of node data to check
 * @param concurrency - Maximum number of concurrent requests
 * @param timeout - Timeout per request in milliseconds
 * @returns Promise resolving to array of health check results
 */
export async function checkMultipleNodes(
  nodes: NodeData[],
  concurrency: number = DEFAULT_CONCURRENCY,
  timeout: number = HEALTH_CHECK_TIMEOUT
): Promise<NodeHealthResult[]> {
  const results: NodeHealthResult[] = [];
  const queue = [...nodes];

  // Process nodes in batches
  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const batchResults = await Promise.all(
      batch.map((node) => checkNodeHealth(node.nodeId, node.httpAddress, timeout))
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Create a map of node IDs to their health results
 *
 * @param results - Array of health check results
 * @returns Map of nodeId to NodeHealthResult
 */
export function createHealthResultMap(results: NodeHealthResult[]): Map<number, NodeHealthResult> {
  return new Map(results.map((result) => [result.nodeId, result]));
}
