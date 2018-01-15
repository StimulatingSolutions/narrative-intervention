#!/usr/bin/env bash
set -e


echo "<div>" > ./src/pages/lesson-plans/lessonplans.html
echo "export const availableLessons: string[] = [" > ./src/pages/landing/availableLessons.ts

for LESSON_DIR in `ls -d ./src/pages/lesson-plans/lesson*/`
do
  LESSON=`basename $LESSON_DIR`
  LESSON_NUMBER="${LESSON#lesson}"
  echo "  <${LESSON} [session]="session"></${LESSON}>" >> ./src/pages/lesson-plans/lessonplans.html
  echo "  '${LESSON_NUMBER}'," >> ./src/pages/landing/availableLessons.ts
done

echo "</div>" >> ./src/pages/lesson-plans/lessonplans.html
echo "];" >> ./src/pages/landing/availableLessons.ts
