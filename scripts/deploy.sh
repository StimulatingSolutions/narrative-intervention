#!/usr/bin/env bash
set -e

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
