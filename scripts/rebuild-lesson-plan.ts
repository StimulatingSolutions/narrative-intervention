import * as getStdin from "get-stdin";



let lessonNumber: number =  parseInt(process.argv[2]);

getStdin().then((s: string) => {

  // [^<]*(?:<[^/][^>]*>[^<]*</[^>]*>[^<]*)*?
  // [^<]*(?:<(?!strong>)[^<]*)*

  // initial markup
  console.log('<div [ngClass]="{\'lesson-plan-wrapper\': true, \'lesson-review\': session.review}">');


  // rebuilding
  s = s.replace(new RegExp('<!--\\s*-->', 'gi'), '');
  s = s.replace(new RegExp('\\s+\n', 'gi'), '\n');
  s = s.replace(new RegExp('<p>((?:[^<]*(?:<(?!/p>)[^<]*)*)Materials Needed(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>)', 'i'), '<p class="line-before">$1');
  s = s.replace(new RegExp('<p>(?:[^<]*(?:<(?!/p>)[^<]*)*)Lesson Overview(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>', 'i'), '');
  s = s.replace(new RegExp('<table>[^<]*(?:<(?!strong>)[^<]*)*<strong>([^<]*(?:<(?!/strong>)[^<]*)*)</strong>', 'i'), '<div class="black-border">\n<p class="v-padding"><strong>$1</strong></p>');
  s = s.replace(new RegExp('</p>\\s*</blockquote>', 'i'), '');
  s = s.replace(new RegExp('</TD>[^<]*(?:<(?!/TABLE>)[^<]*)*</TABLE>', 'i'), '</div>');
  s = s.replace(new RegExp('<li>\\s*<blockquote>([^<]*(?:<(?!blockquote>)[^<]*)*)</blockquote>\\s*(?:</li>|<ul>)', 'gi'), '<li>$1</li>');
  s = s.replace(new RegExp('</ul>\\s*</li>', 'gi'), '</li>');
  s = s.replace(new RegExp('</li>\\s*</li>', 'gi'), '</li>');
  s = s.replace(new RegExp('</ul>\\s*<ul>', 'gi'), '');
  s = s.replace(new RegExp('<li>\\s*</li>', 'gi'), '');
  s = s.replace(new RegExp('<li>\\s*([^<]+)</li>', 'gi'), '<li><p>$1</p></li>');
  s = s.replace(new RegExp('</ul>\\s*<blockquote>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</blockquote>\\s*<ul>', 'gi'), '</ul>\n<hr/>\n<p class="v-padding">$1</p><ul>');
  s = s.replace(new RegExp('<blockquote>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</blockquote>', 'i'), '<p class="v-padding">$1</p>');
  s = s.replace(new RegExp('<span[^>]*></span>', 'gi'), '');

  s = s.replace(new RegExp('<table>[^<]*(?:<(?!em>)[^<]*)*<em>([^<]*(?:<(?!/em>)[^<]*)*)</em>', 'i'), '</ol>\n<hr class="page-break"/>\n<div class="black-border">\n<p class="v-padding"><em>$1</em>');
  s = s.replace(new RegExp('</th>[^<]*(?:<(?!/th>)[^<]*)*</thead>', 'i'), '</div>\n<table>');
  s = s.replace(new RegExp('<th>[\\s_]*</th>', 'gi'), '');
  s = s.replace(new RegExp('<th><strong>[\\s_]*</strong></th>', 'gi'), '');
  s = s.replace(new RegExp('<p>[\\s_]*</p>', 'gi'), '');
  s = s.replace(new RegExp('<td>[\\s_]*</td>', 'gi'), '');
  s = s.replace(new RegExp('<td><strong>[\\s_]*</strong></td>', 'gi'), '');
  s = s.replace(new RegExp('<tr ?[^>]*>[\\s_]*</tr>', 'gi'), '');

  s = s.replace(new RegExp('<(/?)th>', 'gi'), '<$1td>');
  s = s.replace(new RegExp('<(/?)thead>', 'gi'), '<$1tbody>');
  s = s.replace(new RegExp('<tr ?[^>]*>', 'gi'), '<tr>');
  s = s.replace(new RegExp('</tbody>\\s*</table>\\s*<table>\\s*<tbody>', 'gi'), '');
  s = s.replace(new RegExp('</tbody>\\s*<tbody>', 'gi'), '');
  s = s.replace(new RegExp('<table>\\s*<tbody>\\s*<tr>\\s*<td>', 'gi'), '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">');
  s = s.replace(new RegExp('</td>\\s*</tr>\\s*</tbody>\\s*</table>', 'gi'), '</step>');
  s = s.replace(new RegExp('</td>\\s*</tr>\\s*<tr>\\s*<td>', 'gi'), '</step>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">');

  let re = new RegExp('<step[^>]*>([^<]*(?:<(?!/step>)[^<]*)*)<blockquote>([^<]*(?:<(?!/step>)[^<]*)*)</blockquote>([^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi');
  s = s.replace(re, '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">$1$2$3</step>');
  s = s.replace(re, '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">$1$2$3</step>');
  s = s.replace(re, '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">$1$2$3</step>');

  s = s.replace(new RegExp('<step[^>]*><p>([^<]*(?:<(?!/step>)[^<]*)*materials for[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '</li>\n</ol>\n<hr class="page-break"/>\n<div class="black-border">\n<p class="v-padding">$1</div>');
  s = s.replace(new RegExp('</div>\\s*<step[^>]*>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), '</div>\n<p>$1</p>\n<ol>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">');
  s = s.replace(new RegExp('</ol>', 'i'), '');
  s = s.replace(new RegExp('<step[^>]*>\\s*<p>\\s*[a-z]?\\s*\\.\\s*([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '</li>\n<li>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session"><p>$1</step>');
  s = s.replace(new RegExp('<step[^>]*>\\s*[a-z]?\\s*\\.\\s*([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '</li>\n<li>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session"><p>$1</p></step>');
  s = s.replace(new RegExp('<ol ?[^>]*>', 'gi'), '<ol>');
  s = s.replace(new RegExp('<ol>\\s*</li>', 'gi'), '<ol>');
  s = s.replace(new RegExp('<step[^>]*>\\s*<p>\\s*(<strong>[^<]*(?:<(?!/strong>)[^<]*)*</strong>)\\s*</p>\\s*<ul>', 'gi'), '<p class="v-padding">$1</p>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session"><ul>');
  s = s.replace(new RegExp('<step[^>]*>\\s*((?:<p>[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)*)<ul>\\s*<li>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</li>\\s*</ul>((?:\\s*<p>[^<]*(?:<(?!/p>)[^<]*)*</p>)+)', 'gi'), '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">$1<ul><li>\n<p>$2</p>\n$3\n</li></ul>');
  //s = s.replace(new RegExp('\\s*(\\[[^\\]]*\\])\\s*\\.', 'gi'), '. $1');
  //s = s.replace(new RegExp('\\s*(\\[[^\\]]*\\])\\s*,', 'gi'), ', $1');
  s = s.replace(new RegExp('<step[^>]*>\\s*(<strong>[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session"><p>$1</p></step>');
  /*
  s = s.replace(new RegExp('<p>\\s*([^<]*(?:<(?!/p>)[^[<]*)*(?:[<>:]\\s*\\[[^[\\]]+]\\s*([^<]*(?:<(?!\\/p>)[^[<]*)*))?[^\\w\\s[<>:]\\s*\\[[^[\\]]+][^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), (match, p1) => {
    let sub = p1;
    sub = sub.replace(new RegExp('([^\\w\\s[<>:])\\s*(\\[[^[\\]]+])', 'gi'), '$1</p>\n<p>$2</p>\n<p>');
    return `<p>${sub}</p>`;
  });
  */
  s = s.replace(new RegExp('<p>\\W*</p>', 'gi'), '');
  s = s.replace(new RegExp('(?:<step[^>]*>)?(<p><em><strong>[^<]*(?:<(?!/strong>)[^<]*)*</strong></em></p>[^<]*(?:<(?!/step>)[^<]*)*)(?:</step>)?', 'gi'), '<div class="hint">$1\n</div>');
  /*
  s = s.replace(new RegExp('<div class="hint">([^<]*(?:<(?!/div>)[^<]*)*?)(<p>T:[^<]*(?:<(?!/div>)[^<]*)*)</div>', 'gi'), (match, p1, p2) => {
    let sub = p2;
    sub = sub.replace(new RegExp('</p>\\s*<p>T:\\s*', 'gi'), '</p></li>\n<li><p>');
    sub = sub.replace(new RegExp('<p>T:\\s*', 'gi'), '<p>');
    return `<div class="hint">\n${p1}\n<ul class="t-bullets">\n<li>${sub}</li>\n</ul></div>\n`;
  });
  */
  s = s.replace(new RegExp('<step[^>]*>\\s*<[ou]l>\\s*<li>([^<]*(?:<(?!/li>)[^<]*)*)</li>\\s*</\\1l>\\s*</step>', 'gi'), '<$1l><li><step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">$2</step></li></$1l>');
  s = s.replace(new RegExp('</[ou]l>\\s*<\\1l>', 'gi'), '');
  s = s.replace(new RegExp('<li>\\s*<step[^>]*>(\\s*<p>[^<]*(?:<(?!/div>)[^<]*)*?</p>)\\s*(<p>[a-z]\\.[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), (match, p1, p2) => {
    let sub = p2;
    sub = sub.replace(new RegExp('</p>\\s*<p>[a-z]\\.\\s*', 'gi'), '</p></step></li>\n<li><step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session"><p>');
    sub = sub.replace(new RegExp('<p>[a-z]\\.\\s*', 'gi'), '<p>');
    return `<li>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">\n${p1}</step></li>\n<li><step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">\n${sub}</step>\n`;
  });
  s = s.replace(new RegExp('</([-\\w]*)><(\\1[^>]*)>', 'gi'), '</$1>\n<$2>');
  s = s.replace(new RegExp('<step[^>]*>2. Magician Narrative: Part II Teacher Modeling/Guided Practice\\s*</step>\\s*</li>', 'gi'), '<p>2. Magician Narrative: Part II Teacher Modeling/Guided Practice</p>\n<ol>');
  s = s.replace(new RegExp('<step([^>]*)>\\s*([^<]+)\\s*</step>', 'gi'), '<step$1>\n<p>$2</p>\n</step>');
  s = s.replace(new RegExp('<step([^>]*)>\\s*([^<]+)</td>\\s*<td>\\s*</step>', 'gi'), '<step$1>\n<p>$2</p>\n</step>');
  s = s.replace(new RegExp('<step([^>]*)>\\s*([^<]+)</td>\\s*<td>([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '<step$1>\n<p>$2</p>\n<p>$3</p>\n</step>');
  s = s.replace(new RegExp('<step([^>]*)>\\s*([^<]+)</td>\\s*<td>\\s*</step>', 'gi'), '<step$1>\n<p>$2</p>\n</step>');
  s = s.replace(new RegExp('<step([^>]*)>\\s*([^<]*(?:<(?!/step>)[^<]*)*)<p>([^<]*(?:<(?!/step>)[^<]*)*)</p>\\s*</td>\\s*<td>([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '<step$1>$2\n<p>$3</p>\n<p>$4</p>\n</step>');
  s = s.replace(new RegExp('<step([^>]*)>\\s*([^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>', 'gi'), '<step$1>\n$2\n</step>');

  s = s.replace(new RegExp('\\s*<p[^>]*>\\s*</p>\\s*', 'gi'), '\n');
  s = s.replace(new RegExp('</step>\\s*</li>\\s*<li>\\s*<step>\\s*', 'gi'), '</step>\n<step>\n');
  //s = s.replace(new RegExp('<p>(\\w+(?:\\W\\w+)?:)</p>(\\s*)<p>', 'gi'), '<div class="left">$1</div>$2<div class="right">');

  s = s.replace(new RegExp('<step([^>]*)>\\s*<ul>\\s*<li>([^<]*(?:<(?!/li>)[^<]*)*)\\s*</li>\\s*</ul>\\s*</step>', 'gi'), '<ul>\n<li>\n<step$1>\n$2\n</step>\n</li>\n</ul>');
  s = s.replace(new RegExp('</ul>\\s*<ul>\\s*', 'gi'), '');

  s = s.replace(new RegExp('<p>((?:[^<]*(?:<(?!/p>)[^<]*)*))</p>', 'i'), '<h2 class="line-before">$1 ({{session.review ? "review" : ("for "+session.schoolName+", Group "+session.schoolNumber)}})</h2>');
  s = s.replace(new RegExp('<p>', 'i'), '<p class="line-before">');

  s = s.replace(new RegExp('</em>(\\s*):', 'gi'), ':</em>$1');

  if (lessonNumber == 3) {
    s = s.replace(new RegExp('(<li><p>Lesson 3 Magician Narrative Review from Lesson 2 Mastery Sheet \\(Lesson 3 Appendix, p. 2\\)</p>)\\s*<ul>', 'i'), '$1\n</li>');
    // TODO: temporary thing to expedite dev
    s = s.replace(new RegExp('(<p>\\[Students respond]</p>)\\s*</step>\\s*</li>\\s*</ol>', 'gi'), '$1');
  } else if (lessonNumber == 4) {
    s = s.replace(new RegExp('</ul>\\s*<blockquote>\\s*(<p>[^<]*</p>)\\s*<p>((?:[^<]*(?:<(?!/p>)[^<]*)*)</p>)\\s*</blockquote>', 'i'), '<li>$1</li>\n</ul>\n<hr/>\n<p class="v-padding">$2');
  }
  s = s.replace(new RegExp('<div class="(?:hint|black-border)">\\s*<p[^>]*>\\s*(<em><strong>Building Board from Previous Lesson:</strong></em></p>)\\s*(?:<ol[^>]*>\\s*<step[^>]*>\\s*)?(<p><em>Before the lesson begins:</em></p>)\\s*<ol>\\s*([^<]*(?:<(?!/ol>)[^<]*)*\\s*</ol>\\s*</div>)\\s*(?:</li>\\s*</ol>)?', 'i'), '<div class="hint connected-above">\n<p class="v-padding">$1\n$2\n<ol class="numbers">\n$3');
  s = s.replace(new RegExp('<p>\\s*(\\d+\\.)\\s*<strong>', 'gi'), '<p class="heading">$1 <strong>');
  s = s.replace(new RegExp('(<p class="heading">\\d+\\.(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>)\\s*<ol>\\s*(<step[^>]*>)\\s*<p class="v-padding">\\w\\.\\s*', 'gi'), '$1\n<ol>\n<li>\n$2\n<p>');
  s = s.replace(new RegExp('<ol>\\s*<step[^>]*>\\s*', 'gi'), '');
  s = s.replace(new RegExp('<step[^>]*>\\s*(<p class="heading">(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>)\\s*<p>\\w\\.\\s*((?:[^<]*(?:<(?!/p>)[^<]*)*)</p>)\\s*</step>', 'gi'), '$1\n<ol>\n<li>\n<p class="as-step">$2');
  s = s.replace(new RegExp('<step[^>]*>\\s*(\\d+\\.[^<]*(?:<(?!/step>)[^<]*)*)\\s*</step>\\s*<step[^>]*>\\s*<p>\\[If tablets are available(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</step>\\s*</li>', 'gi'), '<p class="heading">$1</p>\n<div class="tablets-only">\n<p class="as-step center">[If tablets are available follow the directions in this dark gray box]</p>\n<p class="as-step">$2</p>\n<ol>');
  s = s.replace(new RegExp('<p>(<strong>[^<]*:</strong>)</p>', 'gi'), '<p class="heading">$1</p>');
  s = s.replace(new RegExp('<li>\\s*(<step[^>]*>\\s*[^<]*(?:<(?!/step>)[^<]*)*\\s*</step>)\\s*<step[^>]*>\\s*<p>(\\[If tablets are NOT[^<]*(?:<(?!/p>)[^<]*)*</p>)\\s*</step>\\s*</li>\\s*([^<]*(?:<(?!/ol>)[^<]*)*</ol>)', 'gi'), '<li>\n$1</li></ol>\n</div>\n<div class="no-tablets">\n<p class="center">$2\n<ol>$3\n</div>');
  s = s.replace(new RegExp('<step[^>]*>\\s*(\\d+\\.\\s*<strong>[^<]*(?:<(?!/step>)[^<]*)*)</step>\\s*</li>', 'gi'), '<p class="heading">$1</p>\n<ol>');

  s = s.replace(new RegExp(`<p><strong>Lesson ${lessonNumber}</strong></p>\\s*<hr class="page-break"/>`, 'i'), `<p class="center line-after"><strong>Lesson ${lessonNumber}</strong></p>`);
  s = s.replace(new RegExp(`</div>\\s*(<p class="center line-after"><strong>Lesson ${lessonNumber}</strong></p>)`, 'i'), `</div>\n<hr class="page-break"/>\n$1`);
  s = s.replace(new RegExp('<div class="black-border">\\s*(<p class="v-padding"><em><strong>Setting Up for the Magician Narrative</strong></em></p>)', 'i'), '<div class="hint connected-below">\n$1');
  s = s.replace(new RegExp('(<div class="hint connected-below">\\s*<p class="v-padding"><em><strong>Setting Up for the Magician Narrative</strong></em></p>[^<]*(?:<(?!/div>)[^<]*)*)<ol>', 'i'), '$1<ol class="numbers">');
  s = s.replace(new RegExp('(<div class="hint connected-below">\\s*<p class="v-padding"><em><strong>Setting Up for the Magician Narrative</strong></em></p>[^<]*(?:<(?!/div>)[^<]*)*)<ol>', 'i'), '$1<ol class="numbers">');
  s = s.replace(new RegExp('(<div class="hint connected-below">\\s*<p class="v-padding"><em><strong>Setting Up for the Magician Narrative</strong></em></p>[^<]*(?:<(?!/div>)[^<]*)*)<ol>', 'i'), '$1<ol class="numbers">');
  s = s.replace(new RegExp('<step[^>]*>\\s*<p>(\\[If tablets are available follow[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<div class="tablets-only">\n<p class="as-step center">$1</div>');
  s = s.replace(new RegExp('<step[^>]*>\\s*<p>(\\[If tablets are NOT available[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<div class="no-tablets">\n<p class="as-step center">$1</div>');
  s = s.replace(new RegExp('(<div class="tablets-only">[^<]*(?:<(?!/div>)[^<]*)*)</div>\\s*((?:<step[^>]*>[^<]*(?:<(?!/step>)[^<]*)*</step>\\s*)+)(<div class="no-tablets">)', 'gi'), '$1$2</div>\n$3');
  s = s.replace(new RegExp('<div class="no-tablets">\\s*<p class="as-step center">([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*((?:<p>(?:[^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*)+)', 'gi'), '<div class="no-tablets">\n<p class="as-step center">$1</p>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">$2</step>\n');
  s = s.replace(new RegExp('<step defaultResponse="goal"[^>]*>([^<]*(?:<(?!/step>)[^<]*)*Students should tap on the GOAL card[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<step questionType="goal" correctAnswer="goal" (onReady)="stepReady($event)" [session]="session">$1</step>');
  s = s.replace(new RegExp('<step defaultResponse="goal"[^>]*>([^<]*(?:<(?!/step>)[^<]*)*Students should tap on the TRY card[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<step questionType="goal" correctAnswer="try" (onReady)="stepReady($event)" [session]="session">$1</step>');
  s = s.replace(new RegExp('<step defaultResponse="goal"[^>]*>([^<]*(?:<(?!/step>)[^<]*)*Students should tap on the OUTCOME FAIL card[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<step questionType="goal" correctAnswer="outcome-fail" (onReady)="stepReady($event)" [session]="session">$1</step>');
  s = s.replace(new RegExp('<step defaultResponse="goal"[^>]*>([^<]*(?:<(?!/step>)[^<]*)*Students should tap on the OUTCOME YES card[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<step questionType="goal" correctAnswer="outcome-yes" (onReady)="stepReady($event)" [session]="session">$1</step>');

  s = s.replace(new RegExp('<li>\\s*<p>', 'gi'), '<li>\n<p>');
  s = s.replace(new RegExp('</p>\\s*</li>', 'gi'), '</p>\n</li>');
  s = s.replace(new RegExp('(<step[^>]*>)\\s*<ol>\\s*<li>\\s*([^<]*(?:<(?!/li>)[^<]*)*)</li>\\s*</ol>\\s*([^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '<ol>\n<li>\n$1\n$2\n$3\n</step>\n</li>\n</ol>');

  s = s.replace(new RegExp('<p class="heading">[^<]*(?:<(?!/p>)[^<]*)*Student Evaluation #\\d[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*<div class="tablets-only">[^<]*(?:<(?!/div>)[^<]*)*</div>', 'gi'), (match) => {
    return match.replace(new RegExp('<step[^>]*>\\s*((?:<p[^>]*>[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)*)\\s*<p>\\s*(?:\\d\\.)?\\s*Say:\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*((?:<p>\\s*\\[\\s*Students\\s*respond\\s*]\\s*</p>)?)\\s*((?:<p[^>]*>[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)*)\\s*</step>', 'gi'), (match2, pre, p1, p2, post) => {
      let respond = '';
      let step = 'defaultResponse';
      if (p2) {
        respond = '<p class="line-before">[Students respond]</p>\n';
        step = 'questionType';
      }
      return `<step ${step}="goal" (onReady)="stepReady($event)" [session]="session">\n${pre}\n<div class="left">Say:</div>\n<div class="right">\n${p1}\n${respond}</div>\n${post}\n</step>`;
    });
  });

  s = s.replace(new RegExp('\\s*(?:</li>)?\\s*(?:</ol>)?(?:<step[^>]*>)?\\s*<p>END OF LESSON</p>\\s*<p>([^<]*(?:<(?!/p>)[^<]*)*</p>)\\s*(?:</step>)?\\s*(?:</li>)?\\s*', 'gi'), '</li>\n</ol>\n<h2 class="center">END OF LESSON</h2>\n<p class="center">$1');

  s = s.replace(new RegExp('<step([^>]*)>\\s*(<p>\\s*<strong>\\s*Think\\s*Aloud\\s*/\\s*Say\\s*:\\s*</strong>)', 'gi'), '<step class="grey-bg" $1>\n$2');
  s = s.replace(new RegExp('(<p>\\s*\\[\\s*READ\\s*SLIDE\\s*\\d+\\s*])\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>\\s*([^\\[])', 'gi'), '$1\n$2\n<br/>\n$3');
  s = s.replace(new RegExp('(<p>\\s*\\[\\s*READ\\s*SLIDE\\s*\\d+\\s*])\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>\\s*([^\\[])', 'gi'), '$1\n$2\n<br/>\n$3');
  s = s.replace(new RegExp('(<p>\\s*\\[\\s*READ\\s*SLIDE\\s*\\d+\\s*])\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>\\s*([^\\[])', 'gi'), '$1\n$2\n<br/>\n$3');
  s = s.replace(new RegExp('(<p>\\s*\\[\\s*READ\\s*SLIDE\\s*\\d+\\s*])\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>\\s*([^\\[])', 'gi'), '$1\n$2\n<br/>\n$3');
  s = s.replace(new RegExp('(<p>\\s*\\[\\s*READ\\s*SLIDE\\s*\\d+\\s*])\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>\\s*([^\\[])', 'gi'), '$1\n$2\n<br/>\n$3');
  s = s.replace(new RegExp('(<p>\\s*\\[\\s*READ\\s*SLIDE\\s*\\d+\\s*])\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*<p>\\s*([^\\[])', 'gi'), '$1\n$2\n<br/>\n$3');

  s = s.replace(new RegExp('</ol>\\s*<ol>\\s*', 'gi'), '');

  s = s.replace(new RegExp('\\bClicking\\b', 'g'), 'Tapping');
  s = s.replace(new RegExp('\\bclicking\\b', 'g'), 'tapping');
  s = s.replace(new RegExp('\\bClicked\\b', 'g'), 'Tapped');
  s = s.replace(new RegExp('\\bclicked\\b', 'g'), 'tapped');
  s = s.replace(new RegExp('\\bClicks\\b', 'g'), 'Taps');
  s = s.replace(new RegExp('\\bclicks\\b', 'g'), 'taps');
  s = s.replace(new RegExp('\\bClick\\b', 'g'), 'Tap');
  s = s.replace(new RegExp('\\bclick\\b', 'g'), 'tap');
  s = s.replace(new RegExp('\\bPressing\\b', 'g'), 'Tapping');
  s = s.replace(new RegExp('\\bpressing\\b', 'g'), 'tapping');
  s = s.replace(new RegExp('\\bPressed\\b', 'g'), 'Tapped');
  s = s.replace(new RegExp('\\bpressed\\b', 'g'), 'tapped');
  s = s.replace(new RegExp('\\bPresses\\b', 'g'), 'Taps');
  s = s.replace(new RegExp('\\bpresses\\b', 'g'), 'taps');
  s = s.replace(new RegExp('\\bPress\\b', 'g'), 'Tap');
  s = s.replace(new RegExp('\\bpress\\b', 'g'), 'tap');
  s = s.replace(new RegExp('\\bHitting\\b', 'g'), 'Tapping');
  s = s.replace(new RegExp('\\bhitting\\b', 'g'), 'tapping');
  s = s.replace(new RegExp('\\bHitted\\b', 'g'), 'Tapped');
  s = s.replace(new RegExp('\\bhitted\\b', 'g'), 'tapped');
  s = s.replace(new RegExp('\\bHits\\b', 'g'), 'Taps');
  s = s.replace(new RegExp('\\bhits\\b', 'g'), 'taps');
  s = s.replace(new RegExp('\\bHit\\b', 'g'), 'Tap');
  s = s.replace(new RegExp('\\bhit\\b', 'g'), 'tap');

  s = s.replace(new RegExp('(<p class="heading">[^<]*(?:<(?!/p>)[^<]*)*Student Evaluation[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*<div class="tablets-only">[^<]*(?:<(?!/div>)[^<]*)*<ol>)([^<]*(?:<(?!/ol>)[^<]*)*)(</ol>\\s*</div>)', 'gi'), (match, p1, p2, p3) => {
    let steps = p2;
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*<p class="heading"><strong>Directions:\\s*</strong></p>)', 'gi'), '<step defaultResponse="difficulty"$1');
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*<p class="heading"><strong>Ask Questions:\\s*</strong></p>)', 'gi'), '<step defaultResponse="difficulty"$1');
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*[^<]*(?:<(?!/step>)[^<]*)*<em>really\\s*hard</em>,\\s*<em>hard</em>,\\s*<em>okay</em>,\\s*<em>easy</em>,\\s*or\\s*<em>really\\s*easy</em>[^<]*(?:<(?!/step>)[^<]*)*</step>\\s*)<step questionType="goal"', 'gi'), '<step defaultResponse="difficulty"$1<step questionType="difficulty"');
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*[^<]*(?:<(?!/step>)[^<]*)*how much we liked[^<]*(?:<(?!/step>)[^<]*)*</step>\\s*)', 'gi'), '<step defaultResponse="appeal"$1');
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*[^<]*(?:<(?!/step>)[^<]*)*<em>not\\s*fun\\s*at\\s*all</em>,\\s*<em>not\\s*really\\s*fun</em>,\\s*<em>okay</em>,\\s*<em>fun</em>,\\s*or\\s*<em>really\\s*fun</em>[^<]*(?:<(?!/step>)[^<]*)*</step>\\s*)<step questionType="goal"', 'gi'), '<step defaultResponse="appeal"$1<step questionType="appeal"');
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*[^<]*(?:<(?!/step>)[^<]*)*how well you think you can[^<]*(?:<(?!/step>)[^<]*)*</step>\\s*)', 'gi'), '<step defaultResponse="efficacy"$1');
    steps = steps.replace(new RegExp('<step defaultResponse="goal"([^>]*>\\s*[^<]*(?:<(?!/step>)[^<]*)*<em>I\\s*couldn.t\\s*do\\s*it</em>,\\s*<em>I\\s*could\\s*do\\s*it\\s*with\\s*help</em>,\\s*<em>I\\s*could\\s*do\\s*it\\s*by\\s*myself</em>[^<]*(?:<(?!/step>)[^<]*)*</step>\\s*)<step questionType="goal"', 'gi'), '<step defaultResponse="efficacy"$1<step questionType="efficacy"');
    return `${p1}${steps}${p3}`;
  });
  s = s.replace(new RegExp('(<p class="heading">\\d+\\.\\s*<strong>[^<]+</strong>)\\s*(\\(\\D[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*<ol>\\s*)([^<]*(?:<(?!/ol>)[^<]*)*</ol>)', 'gi'), (match, p1, p2, p3) => {
    let steps = p3.replace(new RegExp('<step[^>]*>\\s*<p>(?:\\w\\. )?([^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)</step>', 'gi'), '<p>$1');
    return `${p1}</p>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">\n<p>${p2}${steps}\n</step>`;
  });
  s = s.replace(new RegExp('</strong>\\s+<strong>', 'gi'), ' ');
  s = s.replace(new RegExp('<step([^>]*)>\\s*<p(?: class="heading")?>(<strong>Think Aloud[^<]*(?:<(?!/strong>)[^<]*)*</strong>\\s*</p>)', 'gi'), '<step class="grey-bg"$1>\n<p class="heading">$2');
  s = s.replace(new RegExp('<step([^>]*)>\\s*<p(?: class="heading")?>(<strong>Think Aloud[^<]*(?:<(?!/strong>)[^<]*)*</strong>\\s*[^\\s<][^<]*(?:<(?!/p>)[^<]*)*</p>)', 'gi'), '<step class="grey-bg"$1>\n<p>$2');
  s = s.replace(new RegExp('(<p><em><strong>Activity Overview:\\s*</strong></em>[^<]*(?:<(?!(?:(?:p class="heading">)|(?:/step>)))[^<]*)*)(?:</step>\\s*)?(<p class="heading")', 'gi'), '<div class="overview">\n$1</div>\n$2');
  s = s.replace(new RegExp('<ul>', 'i'), '<ul class="objectives">');
  s = s.replace(new RegExp('<li>\\s*<step[^>]*>\\s*(<p>\\[Explain to students that we will now[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)</step>', 'gi'), '<li>\n$1');
  s = s.replace(new RegExp('<li>\\s*(<step[^>]*>\\s*)(<p>\\[Explain to students that we will now[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)', 'gi'), '<li>\n$2$1');
  s = s.replace(new RegExp('(</step>\\s*<step[^>]*>\\s*)(<p>\\[Explain to students that we will now[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)', 'gi'), '$2$1');
  s = s.replace(new RegExp('(<div class="overview">[^<]*(?:<(?!/div>)[^<]*)*)<hr/>\\s*([^<]*(?:<(?!/div>)[^<]*)*)', 'gi'), '$1$2');
  s = s.replace(new RegExp('<p>Teacher will bring:\\s*</p>\\s*<ul>', 'gi'), '<p class="no-line-above">Teacher will bring:</p>\n<ul class="no-line-below">');
  s = s.replace(new RegExp('<p class="v-padding">Co-teacher will bring:\\s*</p>\\s*<ul>', 'gi'), '<p>Co-teacher will bring:</p>\n<ul class="no-line-below">');
  s = s.replace(new RegExp('<li>(\\s*<p>Students will bring:\\s*</p>\\s*)</li>', 'gi'), '</ul>$1<ul>');
  s = s.replace(new RegExp('(<p>\\s*<em>Use the following procedure:\\s*</em>\\s*</p>\\s*)<ol>', 'gi'), '$1<ol class="numbers">');
  s = s.replace(new RegExp('<step([^>]*>\\s*<p>\\s*<strong>Teacher Modeling:)', 'gi'), '<step class="grey-bg"$1');
  s = s.replace(new RegExp('<step[^>]*>\\s*(<p><strong>Example #[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), '$1');
  s = s.replace(new RegExp('<step[^>]*>\\s*([^<]*(?:<(?!/step>)[^<]*)*<p>((?:Co-\\s*)?Teacher[:;])[^<]*(?:<(?!/step>)[^<]*)*)</step>', 'gi'), (match, p1) => {
    p1 = p1.replace(new RegExp('<p>((?:Co-\\s*)?Teacher)\\s*[:;]\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), '<div class="left">$1:</div>\n<div class="right">$2</div>');
    p1 = p1.replace(new RegExp('<p>\\s*([^\\[][^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), '<div class="left">&nbsp;</div>\n<div class="right">$1</div>');
    return `${p1}</p>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">\n${p1}\n</step>`;
  });
  s = s.replace(new RegExp('<p class="as-step">(Pass out refrigerator sheets[^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), '<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">\n<p>$1</p>\n</step>');
  s = s.replace(new RegExp('(<step questionType="goal" correctAnswer="goal")([^>]*>)', 'i'), '$1 [practice]="true"$2');
  s = s.replace(new RegExp('(<step questionType="goal" correctAnswer="try")([^>]*>)', 'i'), '$1 [practice]="true"$2');
  s = s.replace(new RegExp('(<step questionType="goal" correctAnswer="outcome-fail")([^>]*>)', 'i'), '$1 [practice]="true"$2');
  s = s.replace(new RegExp('(<step questionType="goal" correctAnswer="outcome-yes")([^>]*>)', 'i'), '$1 [practice]="true"$2');
  s = s.replace(new RegExp('<step[^>]*>\\s*((?:<p>(?!T:)[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)*)((?:<p>T:[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)+)((?:<p>(?!T:)[^<]*(?:<(?!/p>)[^<]*)*</p>\\s*)*)</step>', 'gi'), (match, p1, p2, p3) => {
    let sub = p2;
    sub = sub.replace(new RegExp('<p>T:\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>', 'gi'), '<li><p>$1</p></li>');
    return `<div class="hint">\n${p1}<ul class="t-bullets">\n${sub}\n</ul>\n${p3}</div>`;
  });
  s = s.replace(new RegExp('(<p>[^<]*(?:<(?!/p>)[^<]*)*is a free response period[^<]*(?:<(?!/p>)[^<]*)*</p>)', 'gi'), '<step questionType="goal" [openResponse]="true" (onReady)="stepReady($event)" [session]="session">\n$1\n</step>');
  s = s.replace(new RegExp('<step[^>]*>\\s*(<p>\\s*<strong>[^<]*(?:<(?!/strong>)[^<]*)*</strong>\\s*</p>)\\s*</step>', 'gi'), '$1\n');
  s = s.replace(new RegExp('<step[^>]*>\\s*</step>\\s*', 'gi'), '');
  s = s.replace(new RegExp('(<step[^>]*>)\\s*<p>(\\(\\d\\w\\))\\s*([^<]*(?:<(?!/p>)[^<]*)*)</p>\\s*</step>', 'gi'), '$1\n<div class="left">$2</div>\n<div class="right">$3</div>\n</step>');

  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Lesson \\d+ Appendix)', 'i'), '$1<span class="grey-bg">$2</span>');
  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Technology)\\s*:', 'i'), '$1<span class="grey-bg">$2</span>:');
  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Videos/PowerPoints Needed)\\s*:', 'i'), '$1<span class="grey-bg">$2</span>:');
  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Pre-Printed Cards)', 'i'), '$1<span class="grey-bg">$2</span>');
  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Boards from Previous Lesson\\(s\\))\\s*:', 'i'), '$1<span class="grey-bg">$2</span>:');
  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Additional Materials and Props)', 'i'), '$1<span class="grey-bg">$2</span>');
  s = s.replace(new RegExp('(<hr/>\\s*<p class="v-padding"><strong>)(Magician Materials)', 'i'), '$1<span class="grey-bg">$2</span>');
  s = s.replace(new RegExp('(<step[^>]*>)([^<]*(?:<(?!/step>)[^<]*)*)<ul>\\s*<li>([^<]*(?:<(?!/li>)[^<]*)*)</li>\\s*</ul>\\s*</step>\\s*<ul>', 'gi'), '$2\n<ul>\n<li>$1\n$3\n</step>\n</li>');
  s = s.replace(new RegExp('<div class="hint">\\s*<p>\\s*<em>\\s*<strong>\\s*Prompts[^<]*(?:<(?!/div>)[^<]*)*</div>', 'gi'), (match) => {
    match = match.replace(new RegExp('<p>(\\s*["“])', 'gi'), '<p class="indent">$1');
    return match;
  });
  s = s.replace(new RegExp('</p>\\s*(<p>\\[The free response period is over[^<]*(?:<(?!/p>)[^<]*)*</p>)', 'gi'), '</p>\n<step defaultResponse="goal" (onReady)="stepReady($event)" [session]="session">\n$1\n</step>');
  s = s.replace(new RegExp('(<step[^>]*>)\\s*<p[^>]*><strong>(Continue Reading the Story):?\\s*</strong>\\s*</p>\\s*', 'gi'), '<p><strong>$2:</strong></p>\n$1\n');
  s = s.replace(new RegExp('<p><strong>(Continue Reading the Story):?\\s*</strong>\\s*</p>\\s*', 'gi'), '<p class="deindent"><strong>$1:</strong></p>\n');
  s = s.replace(new RegExp('<p><strong>(Begin Reading the Story):?\\s*</strong>\\s*</p>\\s*', 'gi'), '<p class="deindent"><strong>$1:</strong></p>\n');

  s = s.replace(new RegExp('\\s+\n', 'gi'), '\n');
  console.log(s);


  // trailing markup
  console.log('</div>');

  process.exit(0);
});
