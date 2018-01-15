#!/usr/bin/env bash
set -e


# brew install pandoc
# npm install -g typescript
# npm install -g ts-node


TMP_OUTPUT_DIR=${TMP_OUTPUT_DIR:-/tmp}
LESSON_NUM=`printf "%02d\n" $1`

pandoc -f docx -t markdown_strict > $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp1.md
cat $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp1.md | ts-node ./scripts/clean-markdown.ts > $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp2.md
cat $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp2.md | pandoc -f markdown_strict -t html > $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp3.html
if [[ ! -e "./src/pages/lesson-plans/lesson${LESSON_NUM}" ]]
then
  mkdir -p ./src/pages/lesson-plans/lesson${LESSON_NUM}
  touch ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}-notes.md
  cat ./src/pages/lesson-plans/standalone/lesson-component-template.ts | sed -e "s/__LESSON_NUM__/${LESSON_NUM}/g"  > ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.ts
  ./scripts/rebuild-available-lessons.sh
fi
cat $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp3.html | ts-node ./scripts/rebuild-lesson-plan.ts ${LESSON_NUM} > ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html
cat ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html | ts-node ./scripts/wrap-lesson-plan.ts ${LESSON_NUM} > ./src/pages/lesson-plans/standalone/lesson-${LESSON_NUM}.html
