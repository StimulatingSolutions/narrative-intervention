#!/usr/bin/env bash
set -e

npm run meteor-client:prod-bundle
npm run ionic:build
