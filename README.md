# cosmjs-registry

Client TypeScript pour interroger le contrat Cosm Registry (CosmWasm) via CosmJS.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Synchroniser les schemas V1

```bash
npm run sync:schemas
```

Le script copie les schemas JSON depuis le repo contrat vers `schemas/raw/`.
Vous pouvez surcharger la source avec `CONTRACT_REPO=/chemin/vers/Cosm-registry`.

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

## API ecriture

Utiliser `SigningCosmRegistryClient` pour les execute messages:

- `createChain(chainMeta)`
- `createEndpoint(chainId, endpointInput)`
- `addToken(chainId, asset)`
- `updateChainMeta(chainId, update)`
- `topUpEndpoint(chainId, endpointId, amount)`
- `removeEndpoint(chainId, endpointId)`
- `setParams(params)`
- `setEndpointFlags(chainId, endpointId, { verified, preferred })`

Toutes les structures de types sont alignées sur les schémas V1 générés dans le repo contrat.
