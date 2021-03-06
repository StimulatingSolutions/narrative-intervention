#!/usr/bin/env bash
set -e


export IONIC_OPTIMIZE_JS=true


if [ -e ./node_modules/meteor-client.js -a ! -e ./node_modules/meteor-client.dev.js ]
then
  echo "---------------------------- saving dev meteor-client bundle"
  rm -f ./node_modules/meteor-client.dev.js
  mv ./node_modules/meteor-client.js ./node_modules/meteor-client.dev.js
fi

rm -rf client-bundle.tgz


# monkey-patch ionic-app-scripts to work in prod mode with angular-meteor:
echo "---------------------------- monkey-patching ionic-app-scripts"
cp ./scripts/@ionic_app-scripts_dist_aot_utils.js ./node_modules/\@ionic/app-scripts/dist/aot/utils.js


echo "---------------------------- hiding student-only code"
cp ./src/app/select/app.component.teacher ./src/app/app.component.ts
cp ./src/app/select/app.module.teacher ./src/app/app.module.ts
mkdir -p srchide
if [ -e ./src/pages/studentSession ]
then
  mv ./src/pages/studentSession ./srchide
  mv ./src/pages/studentLogin ./srchide
fi
if [ ! -e ./src/pages/login ]
then
  echo "---------------------------- revealing teacher-only code"
  mv ./srchide/login ./src/pages
  mv ./srchide/landing ./src/pages
  mv ./srchide/dataManagement ./src/pages
  mv ./srchide/lesson-plans ./src/pages
  mv ./srchide/loginHelp ./src/pages
  mv ./srchide/schools ./src/pages
  mv ./srchide/teacherSession ./src/pages
  mv ./srchide/usermanagement ./src/pages
  mv ./srchide/videos ./src/pages
  mv ./srchide/email.ts ./src/services
fi
if [ ! -e ./node_modules/meteor-client.js ]
then
  echo "---------------------------- building prod meteor-client bundle"
  npm run meteor-client:prod-bundle
fi
echo "---------------------------- building prod teacher app"
npm run ionic:build-prod
rm -rf ./www/web
mv ./www/build ./www/web
cp ./src/tablet.html ./www/web/index.html

if [[ "$1" == "--build-apk" ]]
then
  echo "---------------------------- building native apk"
  ionic cordova build android
  mv ./platforms/android/build/outputs/apk/android-debug.apk ./src/assets/narrative-intervention.apk
  cp ./src/assets/narrative-intervention.apk ./www/assets/
fi

echo "---------------------------- revealing student-only code"
mv ./srchide/studentSession ./src/pages
mv ./srchide/studentLogin ./src/pages

echo "---------------------------- hiding teacher-only code"
cp ./src/app/select/app.component.student ./src/app/app.component.ts
cp ./src/app/select/app.module.student ./src/app/app.module.ts
mv ./src/pages/login ./srchide
mv ./src/pages/landing ./srchide
mv ./src/pages/dataManagement ./srchide
mv ./src/pages/lesson-plans ./srchide
mv ./src/pages/loginHelp ./srchide
mv ./src/pages/schools ./srchide
mv ./src/pages/teacherSession ./srchide
mv ./src/pages/usermanagement ./srchide
mv ./src/pages/videos ./srchide
mv ./src/services/email.ts ./srchide

echo "---------------------------- building prod student app"
npm run ionic:build-prod
rm -rf ./www/student
mv ./www/build ./www/student
cp ./src/tablet.html ./www/student/index.html

echo "---------------------------- revealing teacher-only code"
mv ./srchide/login ./src/pages
mv ./srchide/landing ./src/pages
mv ./srchide/dataManagement ./src/pages
mv ./srchide/lesson-plans ./src/pages
mv ./srchide/loginHelp ./src/pages
mv ./srchide/schools ./src/pages
mv ./srchide/teacherSession ./src/pages
mv ./srchide/usermanagement ./src/pages
mv ./srchide/videos ./src/pages
mv ./srchide/email.ts ./src/services

echo "---------------------------- installing app selector"
cp ./src/redirect.html ./www/index.html
cp ./src/redirect.html ./src/index.html


echo "---------------------------- creating deployment tarball"
tar -czvf client-bundle.tgz ./node_modules/meteor-client.js ./www  #./src/pages/lesson-plans
