#!/usr/bin/env bash
set -e


export TMP_OUTPUT_DIR=${TMP_OUTPUT_DIR:-/tmp}

echo "<div>" > ./src/pages/lesson-plans/lessonplans.html
echo "export const availableLessons: string[] = [" > ./src/pages/landing/availableLessons.ts
echo -n "" > $TMP_OUTPUT_DIR/imports
echo -n "" > $TMP_OUTPUT_DIR/lessons


for LESSON_DIR in `ls -d ./src/pages/lesson-plans/lesson*/`
do
  LESSON=`basename $LESSON_DIR`
  LESSON_NUMBER="${LESSON#lesson}"
  echo "  <${LESSON} [session]=\"session\" *ngIf=\"session.lesson == ${LESSON_NUMBER#0}\"></${LESSON}>" >> ./src/pages/lesson-plans/lessonplans.html
  echo "  '${LESSON_NUMBER#0}'," >> ./src/pages/landing/availableLessons.ts
  echo -n "import { Lesson${LESSON_NUMBER} } from '../pages/lesson-plans/lesson${LESSON_NUMBER}/lesson-${LESSON_NUMBER}';~" >> $TMP_OUTPUT_DIR/imports
  echo -n "    Lesson${LESSON_NUMBER},~" >> $TMP_OUTPUT_DIR/lessons
done

echo "</div>" >> ./src/pages/lesson-plans/lessonplans.html
echo "];" >> ./src/pages/landing/availableLessons.ts

cat ./src/app/select/app.module.template.teacher | sed "s|// __LESSON_IMPORTS__|`cat $TMP_OUTPUT_DIR/imports`|g" | sed "s|// __LESSONS__|`cat $TMP_OUTPUT_DIR/lessons`|g" | tr '~' '\n' > ./src/app/select/app.module.teacher
cat ./src/app/select/app.module.template.web | sed "s|// __LESSON_IMPORTS__|`cat $TMP_OUTPUT_DIR/imports`|g" | sed "s|// __LESSONS__|`cat $TMP_OUTPUT_DIR/lessons`|g" | tr '~' '\n' > ./src/app/select/app.module.web
