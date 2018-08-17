#!/usr/bin/env bash
set -e


export IONIC_OPTIMIZE_JS=true


if [ -e ./node_modules/meteor-client.dev.js ]
then
  rm -f ./node_modules/meteor-client.js
  mv ./node_modules/meteor-client.dev.js ./node_modules/meteor-client.js
fi

cp ./src/app/select/app.component.web ./src/app/app.component.ts
cp ./src/app/select/app.module.web ./src/app/app.module.ts
cp ./src/app/select/lessonDeclarations.full ./src/app/lessonDeclarations.ts
cp ./src/web.html ./src/index.html

if [[ "$1" == "--bundle" ]]
then
    npm run meteor-client:bundle
fi
