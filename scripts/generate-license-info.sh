#!/usr/bin/env bash
set -e

license-checker --json --out ./src/licensing/licenses-raw.json --customPath ./src/licensing/license-config.json

cat ./src/licensing/licenses-raw.json | ts-node ./scripts/clean-licenses.ts > ./src/licensing/license-info.ts
