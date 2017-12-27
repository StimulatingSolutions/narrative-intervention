#!/usr/bin/env bash
set -e


if [ -e ./node_modules/meteor-client.js ]
then
  rm -f ./node_modules/meteor-client.dev.js
  mv ./node_modules/meteor-client.js ./node_modules/meteor-client.dev.js
fi

rm -rf client-bundle.tgz

npm run meteor-client:prod-bundle
npm run ionic:build
if [[ "$1" == "--build-apk" ]]
then
  ionic cordova build android
  mv ./platforms/android/build/outputs/apk/android-debug.apk ./src/assets/narrative-intervention.apk
  echo "removing unneeded files from APK"
  zip ./src/assets/narrative-intervention.apk -d "assets/www/assets/*" "assets/www/build/vendor*"
  cp ./src/assets/narrative-intervention.apk ./www/assets/narrative-intervention.apk
fi

echo "creating deployment tarball"
tar -czvf client-bundle.tgz ./node_modules/meteor-client.js ./www ./src/pages/lesson-plans

if [ -e ./node_modules/meteor-client.dev.js ]
then
  rm -f ./node_modules/meteor-client.js
  mv ./node_modules/meteor-client.dev.js ./node_modules/meteor-client.js
fi
