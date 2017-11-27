#!/usr/bin/env bash
set -e


tar -xzvf client-bundle.tgz
mv ./node_modules/meteor-client.prod.js ./node_modules/meteor-client.js
