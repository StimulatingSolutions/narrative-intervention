#!/usr/bin/env bash
set -e


TMP_OUTPUT_DIR=${TMP_OUTPUT_DIR:-/tmp}
LESSON_NUM=`printf "%02d\n" $1`

mv ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp4.html
cat $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp4.html | ts-node ./scripts/insert-ratings.ts ${LESSON_NUM} > ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html
cat ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html | ts-node ./scripts/wrap-lesson-plan.ts ${LESSON_NUM} > ./src/pages/lesson-plans/standalone/lesson-${LESSON_NUM}.html
