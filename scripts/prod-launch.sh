#!/usr/bin/env bash
set -e


echo "--------------------------------- compiled app"
ls -lah .meteor/heroku_build/app/

# start the meteor server for API and (due to the above) static serving of the ionic client files
.meteor/heroku_build/bin/node .meteor/heroku_build/app/main.js
