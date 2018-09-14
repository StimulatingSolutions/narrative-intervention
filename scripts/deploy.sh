#!/usr/bin/env bash
set -e

export NODE_OPTIONS=--max_old_space_size=8192
MESSAGE=${1:-deploying}

echo "###################################################### building for production"
npm run prod:build
echo "###################################################### committing files"
git add .
git commit -m "${MESSAGE}"
echo "###################################################### pushing to github"
git push origin master
echo "###################################################### deploying to heroku"
git push heroku master
