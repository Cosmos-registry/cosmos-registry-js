#!/usr/bin/env bash
set -euo pipefail

CONTRACT_REPO="${CONTRACT_REPO:-/home/dpierret/DAMEPI/DEV/Cosm-registry}"
SRC="$CONTRACT_REPO/schema/raw"
DST="schemas/raw"

mkdir -p "$DST"

cp "$SRC/query.json" "$DST/query.json"
cp "$SRC/response_to_get_chain.json" "$DST/response_to_get_chain.json"
cp "$SRC/response_to_get_chains.json" "$DST/response_to_get_chains.json"
cp "$SRC/response_to_get_endpoints.json" "$DST/response_to_get_endpoints.json"
cp "$SRC/response_to_export_chain_json.json" "$DST/response_to_export_chain_json.json"
cp "$SRC/response_to_get_owner.json" "$DST/response_to_get_owner.json"
cp "$SRC/response_to_get_params.json" "$DST/response_to_get_params.json"

echo "Schemas synchronized from $SRC"
