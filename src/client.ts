import type {
    CosmWasmClient,
    ExecuteResult,
    SigningCosmWasmClient
} from "@cosmjs/cosmwasm-stargate";
import type {
    Asset,
    ChainMeta,
    ChainMetaUpdate,
    ChainResponse,
    ChainsResponse,
    EndpointInput,
    EndpointKind,
    EndpointsResponse,
    ExecuteMsg,
    ExportChainJsonResponse,
    OwnerResponse,
    ParamsUpdate,
    QueryMsg,
    RegistryParamsResponse
} from "./types.js";

export class CosmRegistryClient {
    private readonly client: Pick<CosmWasmClient, "queryContractSmart">;
    protected readonly contractAddress: string;

    constructor(client: Pick<CosmWasmClient, "queryContractSmart">, contractAddress: string) {
        this.client = client;
        this.contractAddress = contractAddress;
    }

    async getChain(chainId: string): Promise<ChainResponse> {
        return this.query<ChainResponse>({ get_chain: { chain_id: chainId } });
    }

    async getChains(params?: { startAfter?: string; limit?: number }): Promise<ChainsResponse> {
        return this.query<ChainsResponse>({
            get_chains: {
                start_after: params?.startAfter ?? null,
                limit: params?.limit ?? null
            }
        });
    }

    async getEndpoints(params: {
        chainId: string;
        kind?: EndpointKind;
        includeInactive?: boolean;
    }): Promise<EndpointsResponse> {
        return this.query<EndpointsResponse>({
            get_endpoints: {
                chain_id: params.chainId,
                kind: params.kind ?? null,
                include_inactive: params.includeInactive ?? null
            }
        });
    }

    async exportChainJson(chainId: string): Promise<ExportChainJsonResponse> {
        return this.query<ExportChainJsonResponse>({
            export_chain_json: {
                chain_id: chainId
            }
        });
    }

    async getOwner(): Promise<OwnerResponse> {
        return this.query<OwnerResponse>({ get_owner: {} });
    }

    async getParams(): Promise<RegistryParamsResponse> {
        return this.query<RegistryParamsResponse>({ get_params: {} });
    }

    private async query<T>(queryMsg: QueryMsg): Promise<T> {
        return this.client.queryContractSmart(this.contractAddress, queryMsg) as Promise<T>;
    }
}

export class SigningCosmRegistryClient extends CosmRegistryClient {
    private readonly signingClient: Pick<
        SigningCosmWasmClient,
        "execute"
    >;
    private readonly sender: string;

    constructor(
        client: Pick<CosmWasmClient, "queryContractSmart">,
        signingClient: Pick<SigningCosmWasmClient, "execute">,
        contractAddress: string,
        sender: string
    ) {
        super(client, contractAddress);
        this.signingClient = signingClient;
        this.sender = sender;
    }

    async createChain(chain: ChainMeta): Promise<ExecuteResult> {
        return this.execute({ register_chain: { chain } });
    }

    async createEndpoint(
        chainId: string,
        endpoint: EndpointInput
    ): Promise<ExecuteResult> {
        return this.execute({ register_endpoint: { chain_id: chainId, endpoint } });
    }

    async addToken(chainId: string, asset: Asset): Promise<ExecuteResult> {
        const chain = await this.getChain(chainId);
        if (!chain.chain) {
            throw new Error(`Chain not found: ${chainId}`);
        }

        const alreadyExists = chain.chain.assets.some(
            (existing) => existing.denom === asset.denom
        );
        if (alreadyExists) {
            throw new Error(`Token already exists for denom: ${asset.denom}`);
        }

        const update: ChainMetaUpdate = {
            assets: [...chain.chain.assets, asset]
        };
        return this.execute({ update_chain_meta: { chain_id: chainId, update } });
    }

    async updateChainMeta(
        chainId: string,
        update: ChainMetaUpdate
    ): Promise<ExecuteResult> {
        return this.execute({ update_chain_meta: { chain_id: chainId, update } });
    }

    async topUpEndpoint(
        chainId: string,
        endpointId: number,
        amount: string
    ): Promise<ExecuteResult> {
        return this.execute({
            top_up_endpoint: {
                chain_id: chainId,
                endpoint_id: endpointId,
                amount
            }
        });
    }

    async removeEndpoint(chainId: string, endpointId: number): Promise<ExecuteResult> {
        return this.execute({ remove_endpoint: { chain_id: chainId, endpoint_id: endpointId } });
    }

    async setParams(params: ParamsUpdate): Promise<ExecuteResult> {
        return this.execute({ set_params: { params } });
    }

    async setEndpointFlags(
        chainId: string,
        endpointId: number,
        flags: { verified?: boolean; preferred?: boolean }
    ): Promise<ExecuteResult> {
        return this.execute({
            set_endpoint_flags: {
                chain_id: chainId,
                endpoint_id: endpointId,
                verified: flags.verified ?? null,
                preferred: flags.preferred ?? null
            }
        });
    }

    private async execute(msg: ExecuteMsg): Promise<ExecuteResult> {
        return this.signingClient.execute(
            this.sender,
            this.contractAddress,
            msg,
            "auto"
        );
    }
}
