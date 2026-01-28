# XMTP Network Status

A React-based web application for monitoring the health and status of the XMTP network. This status page displays real-time node information from the NodeRegistry smart contract and shows live health status via gRPC-Web health checks.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Node Metadata JSON Schema](#node-metadata-json-schema)
- [Smart Contract Integration](#smart-contract-integration)
- [Health Check System](#health-check-system)
- [Network Status Logic](#network-status-logic)
- [Development Commands](#development-commands)
- [Key Components](#key-components)

---

## Features

- **Network Status Banner**: Shows overall network health (Operational, Degraded, Major Outage, Outage)
- **Status Summary Cards**: Displays canonical/community node counts and average latency
- **Real-time Health Checks**: gRPC-Web calls to MetadataApi.GetVersion
- **NFT Metadata Display**: Fetches and displays tokenURI JSON (avatar, operator info, location)
- **Collapsible Node Sections**: Separate sections for canonical and community nodes
- **Search Functionality**: Filter nodes by ID, operator, address, or version
- **Responsive Design**: Works on desktop and mobile

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Components              │  Hooks                │  State       │
│  - NetworkStatusBanner   │  - useNodeRegistry    │  - nodeStore │
│  - StatusSummaryCards    │  - useNodeStatus      │    (Zustand) │
│  - NodeTable             │  - useNodeMetadata    │              │
│  - NodeStatusBadge       │  - useAllNodeStatuses │              │
│  - NodeDetailsDialog     │  - useNetworkStatus   │              │
├─────────────────────────────────────────────────────────────────┤
│                        External Services                        │
├──────────────────────┬──────────────────────┬───────────────────┤
│  NodeRegistry        │  Node gRPC Endpoints │  Metadata URIs    │
│  (Settlement Chain)  │  (Health Checks)     │  (tokenURI JSON)  │
│  - getAllNodes()     │  - GetVersion        │  - name, image    │
│  - tokenURI()        │                      │  - operator info  │
└──────────────────────┴──────────────────────┴───────────────────┘
```

---

## Project Structure

```text
node-registry-portal/
├── environments/                               # Environment-specific JSON configs
│   ├── testnet.json                            # Testnet configuration (Base Sepolia)
│   └── mainnet.json                            # Mainnet configuration (Base Mainnet)
├── proto/                                      # Protocol buffer definitions
│   └── metadata_api/
│       └── metadata_api.proto                  # MetadataApi service definition
├── public/
│   └── xmtp-logo.svg                           # XMTP logo
├── src/
│   ├── abi/
│   │   └── NodeRegistry.abi.json               # Contract ABI
│   ├── components/
│   │   ├── base/                               # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Dialog.tsx
│   │   │   └── ...
│   │   ├── typography/                         # Text components
│   │   ├── ui/
│   │   │   ├── nodes/                          # Node-specific components
│   │   │   │   ├── NodeTable.tsx               # Table view for nodes
│   │   │   │   ├── NodeStatusBadge.tsx         # Online/offline indicator
│   │   │   │   ├── NodeDetailsDialog.tsx       # Full node details modal
│   │   │   │   └── NodesPageContent.tsx        # Main page content
│   │   │   └── status/                         # Status page components
│   │   │       ├── NetworkStatusBanner.tsx     # Main status banner
│   │   │       ├── StatusSummaryCards.tsx      # Summary statistics
│   │   │       └── NetworkStatusIndicator.tsx
│   │   └── Layout.tsx                          # App layout with header/footer
│   ├── config/
│   │   └── wagmi.ts                            # Wagmi configuration
│   ├── constants/
│   │   └── chains.ts                           # Chain configuration
│   ├── hooks/
│   │   ├── contracts/
│   │   │   └── useNodeRegistry.ts              # Contract read operations
│   │   ├── nodes/
│   │   │   ├── useNodeStatus.ts                # Single node health check
│   │   │   ├── useAllNodeStatuses.ts           # Batch status polling
│   │   │   ├── useNodeMetadata.ts              # Metadata fetching with cache
│   │   │   └── useNetworkStatus.ts             # Network status calculation
│   │   └── utils/
│   │       └── useFormatters.ts                # Address formatting utilities
│   ├── lib/
│   │   └── grpc/
│   │       └── nodeHealthClient.ts             # gRPC-Web health check client
│   ├── pages/
│   │   └── Nodes.tsx                           # Main nodes page
│   ├── store/
│   │   └── nodeStore.ts                        # Zustand state management
│   ├── types/
│   │   └── nodes.ts                            # TypeScript type definitions
│   ├── utils/
│   │   ├── cn.ts                               # className merge utility
│   │   ├── networkStatus.ts                    # Status calculation utilities
│   │   └── typeGuards.ts                       # Type guard utilities
│   ├── App.tsx                                 # Main app component
│   ├── main.tsx                                # Entry point
│   └── index.css                               # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install

# Start development server (testnet)
yarn dev

# Or start with mainnet config
yarn dev:mainnet
```

### Access

Open <http://localhost:5173> in your browser.

---

## Environment Configuration

The application uses JSON configuration files in `/environments/` directory.

### Testnet Configuration (`environments/testnet.json`)

```json
{
  "settlementChain": {
    "chainId": 84532,
    "name": "Base Sepolia",
    "publicRpcUrl": "https://base-sepolia.g.alchemy.com/v2/YOUR_KEY",
    "blockExplorerUrl": "https://sepolia.basescan.org",
    "nodeRegistry": "0xFac49258e9F06f321d992EFe1Ea289308002a1E4"
  }
}
```

### Key Configuration Fields

| Field | Description |
| ------- | ------------- |
| `settlementChain.chainId` | Chain ID (84532 for Base Sepolia, 8453 for Base) |
| `settlementChain.publicRpcUrl` | RPC endpoint URL |
| `settlementChain.nodeRegistry` | NodeRegistry contract address |
| `settlementChain.blockExplorerUrl` | Block explorer for transaction links |

---

## Node Metadata JSON Schema

Each node NFT can have a `tokenURI` that returns JSON metadata. The contract's `tokenURI(nodeId)` function returns a URL like `https://metadata.example.com/nodeId`.

**Note:** The node display name is always derived from the contract as `"XMTP Node #<nodeId>"` and should not be included in metadata.

### Full Schema

```json
{
  "description": "An XMTP Network Node operated by Example Labs",
  "image": "https://example.com/node-avatar.png",
  "external_url": "https://node-operator.example.com",
  "operator_name": "Example Labs",
  "region": "US-East",
  "social": {
    "twitter": "@example",
    "discord": "example-discord",
    "convos": "username_or_url"
  }
}
```

### Field Descriptions

| Field | Required | Description |
| ------- | ---------- | ------------- |
| `description` | Yes | Description of the node |
| `image` | No | Image URL for avatar |
| `external_url` | No | Link to operator's website |
| `operator_name` | No | Operator display name |
| `region` | No | Geographic region (e.g., "US-East", "EU-West") |
| `social.twitter` | No | Twitter handle |
| `social.discord` | No | Discord server/handle |
| `social.convos` | No | Convos username or full URL |

---

## Smart Contract Integration

### NodeRegistry Contract

The status page reads from the NodeRegistry contract on the settlement chain.

#### Read Functions

```solidity
// Get all registered nodes
function getAllNodes() external view returns (NodeWithId[] memory);

// Get canonical node IDs
function getCanonicalNodes() external view returns (uint32[] memory);

// Get node owner (NFT owner)
function ownerOf(uint256 tokenId) external view returns (address);

// Get metadata URI
function tokenURI(uint256 tokenId) external view returns (string memory);
```

#### Node Data Structure

```solidity
struct Node {
    address signer;           // Address derived from signing public key
    bool isCanonical;         // Part of canonical network
    bytes signingPublicKey;   // Public key for verification
    string httpAddress;       // HTTP endpoint (e.g., "https://node.example.com:443")
}

struct NodeWithId {
    uint32 nodeId;            // Unique ID (100, 200, 300, ...)
    Node node;
}
```

---

## Health Check System

### How It Works

1. Portal fetches node's `httpAddress` from contract
2. Makes gRPC-Web POST request to `{httpAddress}/xmtp.xmtpv4.metadata_api.MetadataApi/GetVersion`
3. Parses binary protobuf response for version string
4. Updates status: online (success), offline (timeout/error), unknown (CORS blocked)

### gRPC-Web Request Format

```bash
curl -X POST {httpAddress}/xmtp.xmtpv4.metadata_api.MetadataApi/GetVersion \
    -H "Content-Type: application/grpc-web" \
    -H "Accept: application/grpc-web" \
    --data-binary @<(head -c 5 /dev/zero)
```

### Response Parsing

- gRPC-Web frame: 5 bytes header (1 flag + 4 length) + protobuf message
- Protobuf: field 1 (version string) encoded as `0x0a` + length + UTF-8 bytes
- Example: `0x0a 0x05 0x31 0x2e 0x31 0x2e 0x30` = "1.1.0"

### CORS Limitations

Browser requests may be blocked by CORS if nodes don't send `Access-Control-Allow-Origin` headers. In this case, status shows as "Unknown" with tooltip explaining CORS limitation.

### Polling Behavior

- Initial check on page load
- Auto-refresh every 30 seconds when page is visible
- Manual refresh button available
- Polling pauses when page is hidden (visibility API)

---

## Network Status Logic

The network status is calculated based on the health of **canonical nodes only**.

| Status | Condition | Color |
| -------- | ----------- | ------- |
| Operational | ≥80% canonical nodes online | Green |
| Degraded | 50-79% canonical nodes online | Yellow |
| Major Outage | 1-49% canonical nodes online | Orange |
| Outage | 0% canonical nodes online | Red |

---

## Development Commands

| Command | Description |
| --------- | ------------- |
| `yarn dev` | Start dev server (testnet) |
| `yarn dev:mainnet` | Start dev server (mainnet) |
| `yarn build` | Production build (testnet) |
| `yarn build:mainnet` | Production build (mainnet) |
| `yarn preview` | Preview production build |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix ESLint issues |
| `yarn type-check` | TypeScript type checking |
| `yarn format` | Format code with Prettier |
| `yarn format:check` | Check code formatting |
| `yarn test` | Run tests in watch mode |
| `yarn test:run` | Run tests once |
| `yarn clean` | Clean build artifacts |

---

## Key Components

### NetworkStatusBanner

Main banner at top of page showing:

- Overall network status (Operational, Degraded, etc.)
- Color-coded background based on status
- Last updated timestamp with refresh button

### StatusSummaryCards

Three summary cards showing:

- Canonical Nodes: X/Y Online
- Community Nodes: X/Y Online
- Average Latency: Xms

### NodeTable

Table view displaying nodes with:

- Avatar and node name
- Node ID (with canonical badge)
- Status badge (online/offline)
- Location (with map pin icon)
- HTTP address
- Owner address

### NodeStatusBadge

Visual indicator showing:

- Green dot + "Online" for healthy nodes
- Red dot + "Offline" for unreachable nodes
- Yellow dot + "Error" for error responses
- Gray dot + "Unknown" for CORS-blocked or unchecked

Tooltip shows version, latency, and last check time.

### NodeDetailsDialog

Modal showing full node details:

- Centered node name and ID
- Avatar with canonical/status badges and location
- Description (from metadata)
- Operator name
- HTTP Address, Owner, Signer (with copy buttons)
- Version, Latency, Last Checked
- Signing Public Key
- Social links (Website, Twitter, Discord, Convos)

---

## TypeScript Types

### NodeData

```typescript
interface NodeData {
  nodeId: number;
  signer: Address;
  isCanonical: boolean;
  signingPublicKey: `0x${string}`;
  httpAddress: string;
  owner: Address;
}
```

### NodeMetadata

```typescript
interface NodeMetadata {
  description: string;
  image?: string;
  external_url?: string;
  operator_name?: string;
  region?: string;
  social?: {
    twitter?: string;
    discord?: string;
    convos?: string;
  };
}
```

### NodeHealthResult

```typescript
interface NodeHealthResult {
  nodeId: number;
  httpAddress: string;
  status: 'online' | 'offline' | 'error' | 'unknown';
  version?: string;
  latencyMs?: number;
  lastChecked: Date;
  error?: string;
}
```

### NetworkStatusInfo

```typescript
interface NetworkStatusInfo {
  status: 'operational' | 'degraded' | 'major-outage' | 'outage';
  canonicalOnline: number;
  canonicalTotal: number;
  communityOnline: number;
  communityTotal: number;
  averageLatencyMs: number | null;
  lastChecked: Date;
}
```

---

## State Management

Uses Zustand with persistence:

- **statusCache** (memory only): Map of nodeId → health status
- **metadataCache** (localStorage, 24h TTL): Map of nodeId → metadata

---

## License

MIT
