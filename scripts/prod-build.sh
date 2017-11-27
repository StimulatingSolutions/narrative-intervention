#!/usr/bin/env bash
set -e

npm run meteor-client:prod-bundle
npm run ionic:build

tar -czvf client-bundle.tgz ./node_modules/meteor-client.prod.js ./www
