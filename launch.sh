#!/usr/bin/env bash
set -e

# build client files
npm run meteor-client:bundle

# statically serve up all files from www; see server/doc-root.ts to see how index.html is handled as /
mv www api/public
# mock the cordova.js file because the webapp doesn't need it, but still tries to load it
cat "// mock cordova.js file for webapp deployment" > ./api/public/cordova.js

# start the meteor server for API and (due to the above) static serving of the ionic client files
npm run api
