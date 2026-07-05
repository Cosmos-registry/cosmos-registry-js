import { describe, expect, it, vi } from "vitest";

import { CosmRegistryClient, SigningCosmRegistryClient } from "../src/client.js";

describe("CosmRegistryClient", () => {
    it("builds get_chain query correctly", async () => {
        const queryContractSmart = vi.fn().mockResolvedValue({
            chain: null,
            owner: null,
            endpoints: []
        });

        const client = new CosmRegistryClient(
            { queryContractSmart },
            "cosmos1contract"
        );

        const response = await client.getChain("cosmoshub-4");

        expect(queryContractSmart).toHaveBeenCalledWith("cosmos1contract", {
            get_chain: { chain_id: "cosmoshub-4" }
        });
        expect(response.endpoints).toEqual([]);
    });

    it("builds get_endpoints query with filters", async () => {
        const queryContractSmart = vi.fn().mockResolvedValue({ endpoints: [] });

        const client = new CosmRegistryClient(
            { queryContractSmart },
            "cosmos1contract"
        );

        await client.getEndpoints({
            chainId: "osmosis-1",
            kind: "rpc",
            includeInactive: true
        });

        expect(queryContractSmart).toHaveBeenCalledWith("cosmos1contract", {
            get_endpoints: {
                chain_id: "osmosis-1",
                include_inactive: true,
                kind: "rpc",
                last_success_after: null,
                last_success_before: null,
                limit: null,
                only_unverified: null,
                start_after: null,
                verification_state: null
            }
        });
    });

    it("builds export_chain_json query", async () => {
        const queryContractSmart = vi.fn().mockResolvedValue({
            chain_id: "cosmoshub-4",
            chain_name: "cosmoshub",
            pretty_name: "Cosmos Hub",
            bech32_prefix: "cosmos",
            network_type: "mainnet",
            assets: [],
            apis: { rpc: [], rest: [], grpc: [], wss: [] }
        });

        const client = new CosmRegistryClient(
            { queryContractSmart },
            "cosmos1contract"
        );

        const response = await client.exportChainJson("cosmoshub-4");

        expect(queryContractSmart).toHaveBeenCalledWith("cosmos1contract", {
            export_chain_json: { chain_id: "cosmoshub-4" }
        });
        expect(response.chain_id).toBe("cosmoshub-4");
    });

    it("builds register_chain execute", async () => {
        const queryContractSmart = vi.fn();
        const execute = vi.fn().mockResolvedValue({ transactionHash: "tx1" });

        const client = new SigningCosmRegistryClient(
            { queryContractSmart },
            { execute },
            "cosmos1contract",
            "cosmos1sender"
        );

        await client.createChain({
            chain_id: "cosmoshub-4",
            chain_name: "cosmoshub",
            pretty_name: "Cosmos Hub",
            bech32_prefix: "cosmos",
            network_type: "mainnet",
            assets: [],
            explorers: []
        });

        expect(execute).toHaveBeenCalledWith(
            "cosmos1sender",
            "cosmos1contract",
            {
                register_chain: {
                    chain: {
                        chain_id: "cosmoshub-4",
                        chain_name: "cosmoshub",
                        pretty_name: "Cosmos Hub",
                        bech32_prefix: "cosmos",
                        network_type: "mainnet",
                        assets: [],
                        explorers: []
                    }
                }
            },
            "auto"
        );
    });

    it("builds register_endpoint execute", async () => {
        const queryContractSmart = vi.fn();
        const execute = vi.fn().mockResolvedValue({ transactionHash: "tx2" });

        const client = new SigningCosmRegistryClient(
            { queryContractSmart },
            { execute },
            "cosmos1contract",
            "cosmos1sender"
        );

        await client.createEndpoint("cosmoshub-4", {
            kind: "rpc",
            url: "https://rpc.cosmos.network",
            deposit: "1000"
        });

        expect(execute).toHaveBeenCalledWith(
            "cosmos1sender",
            "cosmos1contract",
            {
                register_endpoint: {
                    chain_id: "cosmoshub-4",
                    endpoint: {
                        kind: "rpc",
                        url: "https://rpc.cosmos.network",
                        deposit: "1000"
                    }
                }
            },
            "auto"
        );
    });

    it("adds token by reading chain then updating metadata", async () => {
        const queryContractSmart = vi
            .fn()
            .mockResolvedValueOnce({
                chain: {
                    chain_id: "cosmoshub-4",
                    chain_name: "cosmoshub",
                    pretty_name: "Cosmos Hub",
                    bech32_prefix: "cosmos",
                    network_type: "mainnet",
                    assets: [
                        {
                            denom: "uatom",
                            display: "atom",
                            symbol: "ATOM",
                            decimals: 6
                        }
                    ],
                    explorers: []
                },
                owner: "cosmos1owner",
                endpoints: []
            });
        const execute = vi.fn().mockResolvedValue({ transactionHash: "tx3" });

        const client = new SigningCosmRegistryClient(
            { queryContractSmart },
            { execute },
            "cosmos1contract",
            "cosmos1sender"
        );

        await client.addToken("cosmoshub-4", {
            denom: "uatom2",
            display: "atom2",
            symbol: "ATOM2",
            decimals: 6
        });

        expect(queryContractSmart).toHaveBeenCalledWith("cosmos1contract", {
            get_chain: { chain_id: "cosmoshub-4" }
        });
        expect(execute).toHaveBeenCalledWith(
            "cosmos1sender",
            "cosmos1contract",
            {
                update_chain_meta: {
                    chain_id: "cosmoshub-4",
                    update: {
                        assets: [
                            {
                                denom: "uatom",
                                display: "atom",
                                symbol: "ATOM",
                                decimals: 6
                            },
                            {
                                denom: "uatom2",
                                display: "atom2",
                                symbol: "ATOM2",
                                decimals: 6
                            }
                        ]
                    }
                }
            },
            "auto"
        );
    });
});
