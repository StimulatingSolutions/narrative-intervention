#!/usr/bin/env bash
set -e


# brew install pandoc
# npm install -g typescript
# npm install -g ts-node


export TMP_OUTPUT_DIR=${TMP_OUTPUT_DIR:-/tmp}

while [[ "$1" != "" && "$1" != "test" ]]
do
  LESSON_NUM=`printf "%02d\n" $1`
  echo "=========================== Lesson ${LESSON_NUM} ==========================="

  echo "---- docx -> markdown"
  cat ./src/assets/lesson-plans/lesson-${LESSON_NUM}.docx | pandoc -f docx -t markdown_strict > $TMP_OUTPUT_DIR/lesson-${LESSON_NUM}.tmp1.md
  echo "---- cleaning markdown"
  cat $TMP_OUTPUT_DIR/lesson-${LESSON_NUM}.tmp1.md | ts-node ./scripts/clean-markdown.ts > $TMP_OUTPUT_DIR/lesson-${LESSON_NUM}.tmp2.md
  echo "---- markdown -> html"
  cat $TMP_OUTPUT_DIR/lesson-${LESSON_NUM}.tmp2.md | pandoc -f markdown_strict -t html > $TMP_OUTPUT_DIR/lesson-${LESSON_NUM}.tmp3.html
  if [[ ! -e "./src/pages/lesson-plans/lesson${LESSON_NUM}" ]]
  then
    echo "---- generating typescript controller"
    mkdir -p ./src/pages/lesson-plans/lesson${LESSON_NUM}
    cat ./src/pages/lesson-plans/lesson.ts.template | sed -e "s/__LESSON_NUM__/${LESSON_NUM}/g"  > ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.ts
    #./scripts/rebuild-available-lessons.sh
  fi

  echo -n > ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html
  if [[ "${!#}" == "test" ]]
  then
    cat ./scripts/test-page-stub-pre.html >> ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html
  fi
  echo "---- executing regexes"
  cat $TMP_OUTPUT_DIR/lesson-${LESSON_NUM}.tmp3.html | ts-node ./scripts/rebuild-lesson-plan.ts ${LESSON_NUM} >> ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html
  if [[ "${!#}" == "test" ]]
  then
    cat ./scripts/test-page-stub-post.html >> ./src/pages/lesson-plans/lesson${LESSON_NUM}/lesson-${LESSON_NUM}.html
  fi

  shift
done
