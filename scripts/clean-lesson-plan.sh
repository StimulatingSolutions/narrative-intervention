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
cat $TMP_OUTPUT_DIR/Lesson-${LESSON_NUM}.tmp3.html | ts-node ./scripts/rebuild-lesson-plan-${LESSON_NUM}.ts ${LESSON_NUM}
