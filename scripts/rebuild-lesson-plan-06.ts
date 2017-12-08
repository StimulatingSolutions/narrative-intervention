import * as fs from "fs";
import * as getStdin from "get-stdin";
import * as RegexEscape from "regex-escape";


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
      ${fs.readFileSync('./src/pages/lesson-plans/lesson-plan.scss')}
      </STYLE>
    </HEAD>
    <BODY>
    <div class="lesson-plan-wrapper">
    <lesson-plan [lessonNumber]="${process.argv[2].replace(new RegExp('^0*'), '')}">\n`
  );

  // rebuilding
  s = s.replace(new RegExp('<p>([^<]*)</p>', 'i'), '<h2>$1</h2>');
  s = s.replace(new RegExp('(<p>(?:[^<]*(?:<(?!/p>)[^<]*)*)Materials Needed(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>)', 'i'), '<p><br/></p>\n$1');
  s = s.replace(new RegExp('<p>(?:[^<]*(?:<(?!/p>)[^<]*)*)Lesson Overview(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>', 'i'), '');
  s = s.replace(new RegExp('<table>[^<]*(?:<(?!strong>)[^<]*)*<strong>([^<]*(?:<(?!/strong>)[^<]*)*)</strong>', 'i'), '<div class="triple-border-1"><div class="triple-border-2"><div class="triple-border-3">\n<p class="v-padding"><strong>$1</strong></p>');
  s = s.replace(new RegExp('</p>\\s*</blockquote>', 'i'), '');
  s = s.replace(new RegExp('</TD>[^<]*(?:<(?!/TABLE>)[^<]*)*</TABLE>', 'i'), '</div></div></div>');
  s = s.replace(new RegExp('<li>\\s*<blockquote>([^<]*(?:<(?!blockquote>)[^<]*)*)</blockquote>\\s*(?:</li>|<ul>)', 'gi'), '<li>$1</li>');
  s = s.replace(new RegExp('</ul>\\s*</li>', 'gi'), '</li>');
  s = s.replace(new RegExp('</li>\\s*</li>', 'gi'), '</li>');
  s = s.replace(new RegExp('</ul>\\s*<ul>', 'gi'), '');
  s = s.replace(new RegExp('<li>\\s*</li>', 'gi'), '');
  s = s.replace(new RegExp('</ul>\\s*<blockquote>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</blockquote>\\s*<ul>', 'gi'), '</ul>\n<hr/>\n<p class="v-padding">$1</p><ul>');
  s = s.replace(new RegExp('<blockquote>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</blockquote>', 'i'), '<p class="v-padding">$1</p>');

  s = s.replace(new RegExp('<table>[^<]*(?:<(?!em>)[^<]*)*<em>([^<]*(?:<(?!/em>)[^<]*)*)</em>', 'i'), '</ol>\n<hr class="page-break"/>\n<div class="triple-border-1"><div class="triple-border-2"><div class="triple-border-3">\n<p class="v-padding"><em>$1</em>');
  s = s.replace(new RegExp('</th>[^<]*(?:<(?!/th>)[^<]*)*</thead>', 'i'), '</div></div></div>\n<table>');
  s = s.replace(new RegExp('<th>[\\s_]*</th>', 'gi'), '');
  s = s.replace(new RegExp('<td>[\\s_]*</td>', 'gi'), '');
  s = s.replace(new RegExp('<tr ?[^>]*>[\\s_]*</tr>', 'gi'), '');

  s = s.replace(new RegExp('<(/?)th>', 'gi'), '<$1td>');
  s = s.replace(new RegExp('<(/?)thead>', 'gi'), '<$1tbody>');
  s = s.replace(new RegExp('<tr ?[^>]*>', 'gi'), '<tr>');
  s = s.replace(new RegExp('</tbody>\\s*</table>\\s*<table>\\s*<tbody>', 'gi'), '');
  s = s.replace(new RegExp('</tbody>\\s*<tbody>', 'gi'), '');
  s = s.replace(new RegExp('<table>\\s*<tbody>\\s*<tr>\\s*<td>', 'gi'), '<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">');
  s = s.replace(new RegExp('</td>\\s*</tr>\\s*</tbody>\\s*</table>', 'gi'), '</step>');
  s = s.replace(new RegExp('</td>\\s*</tr>\\s*<tr>\\s*<td>', 'gi'), '</step>\n<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">');

  let re = new RegExp('<step[^<]*>([^<]*(?:<(?!/step>)[^<]*)*)<blockquote>([^<]*(?:<(?!/step>)[^<]*)*)</blockquote>([^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi');
  s = s.replace(re, '<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">$1$2$3</step>');
  s = s.replace(re, '<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">$1$2$3</step>');
  s = s.replace(re, '<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">$1$2$3</step>');

  s = s.replace(new RegExp('<step[^<]*><p>([^<]*(?:<(?!/step>)[^<]*)*materials for[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '</li>\n</ol>\n<hr class="page-break"/>\n<div class="triple-border-1"><div class="triple-border-2"><div class="triple-border-3">\n<p class="v-padding">$1</div></div></div>');
  s = s.replace(new RegExp('</div>\\s*<step[^<]*>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), '</div>\n<p>$1</p>\n<ol>\n<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">');
  s = s.replace(new RegExp('</ol>', 'i'), '');
  s = s.replace(new RegExp('<step[^<]*>\\s*<p>\\s*[a-z]?\\s*\\.\\s*([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '</li>\n<li>\n<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor"><p>$1</step>');
  s = s.replace(new RegExp('<step[^<]*>\\s*[a-z]?\\s*\\.\\s*([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '</li>\n<li>\n<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor"><p>$1</p></step>');
  s = s.replace(new RegExp('<ol ?[^>]*>', 'gi'), '<ol>');
  s = s.replace(new RegExp('<ol>\\s*</li>', 'gi'), '<ol>');
  s = s.replace(new RegExp('<step[^<]*>\\s*<p>\\s*(<strong>[^<]*(?:<(?!/strong>)[^<]*)*</strong>)\\s*</p>\\s*<ul>', 'gi'), '<p class="v-padding bullet-heading">$1</p>\n<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor"><ul>');
  s = s.replace(new RegExp('<step[^<]*>\\s*((?:<p>[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)*)<ul>\\s*<li>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</li>\\s*</ul>((?:\\s*<p>[^<]*(?:<(?!/p>)[^<]*)*</p>)+)', 'gi'), '<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">$1<ul><li>\n<p>$2</p>\n$3\n</li></ul>');
  s = s.replace(new RegExp('\\s*(\\[[^\\]]*\\])\\s*\\.', 'gi'), '. $1');
  s = s.replace(new RegExp('\\s*(\\[[^\\]]*\\])\\s*,', 'gi'), ', $1');
  s = s.replace(new RegExp('<step[^<]*>\\s*(<strong>[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor"><p>$1</p></step>');
  s = s.replace(new RegExp('<p>\\s*([^<]*(?:<(?!/p>)[^[<]*)*(?:[<>:]\\s*\\[[^[\\]]+]\\s*([^<]*(?:<(?!\\/p>)[^[<]*)*))?[^\\w\\s[<>:]\\s*\\[[^[\\]]+][^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), (match, p1) => {
    let sub = p1;
    sub = sub.replace(new RegExp('([^\\w\\s[<>:])\\s*(\\[[^[\\]]+])', 'gi'), '$1</p>\n<p>$2</p>\n<p>');
    return `<p>${sub}</p>`;
  });
  s = s.replace(new RegExp('<p>\\W*</p>', 'gi'), '');
  s = s.replace(new RegExp('(?:<step[^<]*>)?(<p><em><strong>[^<]*(?:<(?!/strong>)[^<]*)*</strong></em></p>[^<]*(?:<(?!/step>)[^<]*)*)(?:</step>)?', 'gi'), '<div class="hint">$1\n</div>');
  s = s.replace(new RegExp('<div class="hint">([^<]*(?:<(?!/div>)[^<]*)*?)(<p>T:[^<]*(?:<(?!/div>)[^<]*)*)</div>', 'gi'), (match, p1, p2) => {
    let sub = p2;
    sub = sub.replace(new RegExp('</p>\\s*<p>T:\\s*', 'gi'), '</p></li>\n<li><p>');
    sub = sub.replace(new RegExp('<p>T:\\s*', 'gi'), '<p>');
    return `<div class="hint">\n${p1}\n<ul class="t-bullets">\n<li>${sub}</li>\n</ul></div>\n`;
  });
  s = s.replace(new RegExp('<step[^<]*>\\s*<(o|u)l>\\s*<li>([^<]*(?:<(?!/li>)[^<]*)*)</li>\\s*</\\1l>\\s*</step>', 'gi'), '<$1l><li><step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">$2</step></li></$1l>');
  s = s.replace(new RegExp('</(o|u)l>\\s*<\\1l>', 'gi'), '');
  s = s.replace(new RegExp('(<step[^<]*>[^<]*(?:<(?!/step>)[^<]*)*(?:<p>)?<strong>Think Aloud:?</strong>[^<]*(?:<(?!/step>)[^<]*)*</step>)', 'gi'), '<div class="instructions">$1</div>');
  s = s.replace(new RegExp('<li>\\s*<step[^<]*>(\\s*<p>[^<]*(?:<(?!/div>)[^<]*)*?</p>)\\s*(<p>[a-z]\\.[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), (match, p1, p2) => {
    let sub = p2;
    sub = sub.replace(new RegExp('</p>\\s*<p>[a-z]\\.\\s*', 'gi'), '</p></step></li>\n<li><step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor"><p>');
    sub = sub.replace(new RegExp('<p>[a-z]\\.\\s*', 'gi'), '<p>');
    return `<li>\n<step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">\n${p1}</step></li>\n<li><step [stepsContext]="steps" [highlightedStepId]="suggestedStepId" [currentQuestionId]="gettingResponsesFor">\n${sub}</step>\n`;
  });
  s = s.replace(new RegExp('</([-\\w]*)><(\\1[^>]*)>', 'gi'), '</$1>\\n<$2>');

  console.log(s);


  // trailing markup
  console.log('</ol>\n</lesson-plan>\n</div>\n</BODY></HTML>');

  process.exit(0);
});
