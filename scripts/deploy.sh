#!/usr/bin/env bash
set -e

MESSAGE=${1:-deploying}

npm run prod:build
git add .
git commit -m "${MESSAGE}"
git push origin master
git push heroku master
