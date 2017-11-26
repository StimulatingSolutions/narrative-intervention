#!/usr/bin/env bash
set -e

echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "PATH: $PATH"
echo "meteor: "`which meteor`
echo "npm: "`which npm`

# build client files
meteor npm run meteor-client:bundle

# statically serve up all files from www; see server/doc-root.ts to see how index.html is handled as /
cd api
ln -s ../www public
cd ..
# mock the cordova.js file because the webapp doesn't need it, but still tries to load
cat "// mock cordova.js file for webapp deployment" > ./www/cordova.js

# start the meteor server for API and (due to the above) static serving of the ionic client files
meteor npm run api
