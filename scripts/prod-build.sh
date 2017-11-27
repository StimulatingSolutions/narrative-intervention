#!/usr/bin/env bash
set -e

npm run meteor-client:bundle
npm run ionic:build
