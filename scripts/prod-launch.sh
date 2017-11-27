#!/usr/bin/env bash
set -e


echo "--------------------------------- app root"
ls -lah .meteor/heroku_build/bin/node

cd api

echo "--------------------------------- inside api"
ls -lah .meteor/heroku_build/bin/node

# start the meteor server for API and (due to the above) static serving of the ionic client files
.meteor/heroku_build/bin/node .meteor/heroku_build/app/main.js
