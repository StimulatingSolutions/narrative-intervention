#!/usr/bin/env bash
set -e


if [ -e ./node_modules/meteor-client.js ]
then
  rm -f ./node_modules/meteor-client.dev.js
  mv ./node_modules/meteor-client.js ./node_modules/meteor-client.dev.js
fi

npm run meteor-client:prod-bundle
npm run ionic:build

tar -czvf client-bundle.tgz ./node_modules/meteor-client.js ./www

if [ -e ./node_modules/meteor-client.dev.js ]
then
  rm -f ./node_modules/meteor-client.js
  mv ./node_modules/meteor-client.dev.js ./node_modules/meteor-client.js
fi
