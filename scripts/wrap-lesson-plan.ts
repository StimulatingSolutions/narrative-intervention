import * as fs from "fs";
import * as getStdin from "get-stdin";
import * as RegexEscape from "regex-escape";



let lessonNumber: number =  parseInt(process.argv[2]);

getStdin().then((s: string) => {

  // [^<]*(?:<[^/][^>]*>[^<]*</[^>]*>[^<]*)*?
  // [^<]*(?:<(?!strong>)[^<]*)*

  // initial markup
  console.log(
    `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <HTML>
    <HEAD>
      <script type="text/javascript" src="https://raw.githack.com/myrcutio/browser-scss/master/dist/browser-scss.min.js"></script>
      <STYLE TYPE="text/scss">
      ${fs.readFileSync('./src/pages/lesson-plans/lessonplans.scss')}
      ${fs.readFileSync('./src/pages/lesson-plans/step.scss')}
      </STYLE>
    </HEAD>
    <BODY>`
  );

  console.log(s);

  // trailing markup
  console.log('</BODY></HTML>');

  process.exit(0);
});
