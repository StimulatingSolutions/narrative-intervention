#!/usr/bin/env bash
set -e

# build client files
meteor-client bundle -s api

# mock the cordova.js file because the webapp doesn't need it, but still tries to load
cat "// mock cordova.js file for webapp deployment" > ./www/cordova.js

cd api

# statically serve up all files from www; see server/doc-root.ts to see how index.html is handled as /
ln -s ../www public

# start the meteor server for API and (due to the above) static serving of the ionic client files
.meteor/heroku_build/bin/node .meteor/heroku_build/app/main.js
