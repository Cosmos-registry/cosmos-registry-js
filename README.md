# cosmjs-registry

A TypeScript client for querying the Cosm Registry (CosmWasm) contract via CosmJS.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Synchronize V1 Schemas

```bash
npm run sync:schemas
```

The script copies the JSON schemas from the contract repository to `schemas/raw/`.
You can override the source with `CONTRACT_REPO=/path/to/Cosm-registry`.

## Tests

```bash
npm test
```

## API

- `getChain(chainId)`
- `getChains({ startAfter, limit })`
- `getEndpoints({ chainId, kind, includeInactive })`
- `exportChainJson(chainId)`
- `getOwner()`
- `getParams()`

## Write API

Use `SigningCosmRegistryClient` to execute the following messages:

- `createChain(chainMeta)`
- `createEndpoint(chainId, endpointInput)`
- `addToken(chainId, asset)`
- `updateChainMeta(chainId, update)`
- `topUpEndpoint(chainId, endpointId, amount)`
- `removeEndpoint(chainId, endpointId)`
- `setParams(params)`
- `setEndpointFlags(chainId, endpointId, { verified, preferred })`

All type definitions are aligned with the V1 schemas generated in the contract repository.
