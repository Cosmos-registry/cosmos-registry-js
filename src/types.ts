export type Uint128 = string;

export type NetworkType = "mainnet" | "testnet" | "devnet";
export type EndpointKind = "rpc" | "rest" | "grpc" | "wss";
export type EndpointStatus = "online" | "offline";
export type VerificationState = "unverified" | "verified_online" | "verified_offline";

export interface Asset {
    denom: string;
    display: string;
    symbol: string;
    decimals: number;
}

export interface Explorer {
    kind: string;
    url: string;
}

export interface ChainMeta {
    chain_id: string;
    chain_name: string;
    pretty_name: string;
    bech32_prefix: string;
    network_type: NetworkType;
    website?: string | null;
    assets: Asset[];
    explorers: Explorer[];
}

export interface EndpointView {
    endpoint_id: number;
    chain_id: string;
    owner: string;
    kind: EndpointKind;
    url: string;
    normalized_url: string;
    preferred: boolean;
    active: boolean;
    remaining_deposit: Uint128;
    consecutive_failures: number;
    consecutive_successes: number;
    estimated_expiry?: number | null;
    last_checked_at?: number | null;
    last_checked_by?: string | null;
    last_latency_ms?: number | null;
    last_status?: EndpointStatus | null;
    last_success_at?: number | null;
    verification_state: VerificationState;
}

export interface ChainResponse {
    chain?: ChainMeta | null;
    owner?: string | null;
    endpoints: EndpointView[];
}

export interface ChainListItem {
    chain_id: string;
    pretty_name: string;
    network_type: NetworkType;
    endpoint_count: number;
}

export interface ChainsResponse {
    chains: ChainListItem[];
}

export interface EndpointsResponse {
    endpoints: EndpointView[];
}

export interface ApiEndpointEntry {
    address: string;
    provider: string;
}

export interface ChainJsonApis {
    rpc: ApiEndpointEntry[];
    rest: ApiEndpointEntry[];
    grpc: ApiEndpointEntry[];
    wss: ApiEndpointEntry[];
}

export interface ExportChainJsonResponse {
    chain_id: string;
    chain_name: string;
    pretty_name: string;
    bech32_prefix: string;
    network_type: NetworkType;
    website?: string | null;
    assets: Asset[];
    apis: ChainJsonApis;
}

export interface OwnerResponse {
    owner: string;
    treasury: string;
}

export interface RegistryParams {
    auto_unverify_failure_streak: number;
    auto_unverify_last_success_older_than_secs: number;
    epoch_seconds: number;
    max_endpoints_per_chain: number;
    min_endpoint_deposit: Uint128;
    oracle_max_batch_size: number;
    rent_per_epoch: Uint128;
    trusted_oracles: string[];
}

export interface RegistryParamsResponse {
    params: RegistryParams;
}

export interface ChainMetaUpdate {
    chain_name?: string | null;
    pretty_name?: string | null;
    bech32_prefix?: string | null;
    network_type?: NetworkType | null;
    website?: string | null;
    assets?: Asset[] | null;
    explorers?: Explorer[] | null;
}

export interface EndpointInput {
    kind: EndpointKind;
    url: string;
    deposit: Uint128;
    owner?: string | null;
}

export interface ParamsUpdate {
    auto_unverify_failure_streak?: number | null;
    auto_unverify_last_success_older_than_secs?: number | null;
    epoch_seconds?: number | null;
    max_endpoints_per_chain?: number | null;
    min_endpoint_deposit?: Uint128 | null;
    oracle_max_batch_size?: number | null;
    rent_per_epoch?: Uint128 | null;
    trusted_oracles?: string[] | null;
}

export type ExecuteMsg =
    | { register_chain: { chain: ChainMeta } }
    | { update_chain_meta: { chain_id: string; update: ChainMetaUpdate } }
    | { register_endpoint: { chain_id: string; endpoint: EndpointInput } }
    | { top_up_endpoint: { chain_id: string; endpoint_id: number; amount: Uint128 } }
    | { remove_endpoint: { chain_id: string; endpoint_id: number } }
    | { set_params: { params: ParamsUpdate } }
    | {
        set_endpoint_flags: {
            chain_id: string;
            endpoint_id: number;
            verified?: boolean | null;
            preferred?: boolean | null;
        };
    };

export type QueryMsg =
    | { get_chain: { chain_id: string } }
    | { get_chains: { start_after?: string | null; limit?: number | null } }
    | {
        get_endpoints: {
            chain_id: string;
            include_inactive?: boolean | null;
            kind?: EndpointKind | null;
            last_success_after?: number | null;
            last_success_before?: number | null;
            limit?: number | null;
            only_unverified?: boolean | null;
            start_after?: number | null;
            verification_state?: VerificationState | null;
        };
    }
    | { export_chain_json: { chain_id: string } }
    | { get_owner: Record<string, never> }
    | { get_params: Record<string, never> };
