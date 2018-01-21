import * as fs from "fs";
import * as getStdin from "get-stdin";
import * as RegexEscape from "regex-escape";



let lessonNumber: number =  parseInt(process.argv[2]);
let labels: any = [
  {                 // lesson 1
    main: "identify causes and events",
    efficacy: ["identify events in a story", "identify causes in a story"]
  }, {              // lesson 2
    main: "identify goals",
    efficacy: ["identify a goal in a story"]
  }, {              // lesson 3
    main: "identify tries",
    efficacy: ["identify a goal in a story", "identify what a character does to try to get their goal in a story"]
  }, {              // lesson 4
    main: "identify outcomes",
    efficacy: ["identify a goal in a story", "identify what a character does to try to get their goal in a story", "identify the outcome in a story"]
  }, {              // lesson 5
    main: "identify goals, tries, and outcomes",
    efficacy: ["identify a goal in a story", "identify what a character does to try to get their goal in a story", "identify the outcome in a story"]
  }, {              // lesson 6
    main: "make inferences",
    efficacy: ["make an inference in a story"]
  }, {              // lesson 7
    main: "identify causal chains",
    efficacy: ["identify a causal chain in a story"]
  }, {              // lesson 8
    main: "identify causal chains",
    efficacy: ["identify a causal chain in a story"]
  }, {              // lesson 9
    main: "identify goals, tries and outcomes from two perspectives",
    efficacy: ["identify the goal from two perspectives in a story in a story", "identify what two characters do to try to get their goals in a story in a story", "identify the outcome in a story from two perspectives"]
  }, {              // lesson 10
    main: "identify distal causes",
    efficacy: ["identify a distal cause in a story"]
  }, {              // lesson 11
    main: "identify important events",
    efficacy: ["identify important events in a story"]
  }, {              // lesson 12
    main: "identify distal causes",
    efficacy: ["identify a distal cause in a story"]
  }, {              // lesson 13
    main: "identify all kinds of causal connections and goals, tries, and outcomes in the same story",
    efficacy: ["identify all kinds of causal connections and goals, tries, and outcomes in the same story"]
  }, {              // lesson 14
    main: "identify all kinds of causal connections and goals, tries, and outcomes in the same story",
    efficacy: ["identify all kinds of causal connections and goals, tries, and outcomes in the same story"]
  }, {              // lesson 15
    main: "identify all kinds of causal connections and goals, tries, and outcomes in the same story",
    efficacy: ["identify all kinds of causal connections and goals, tries, and outcomes in the same story"]
  }
][lessonNumber-1];

let evaluationTemplate: string = `
  <ol>
    <li>
      <p><strong>Read the following directions to students:</strong></p>
      <step [defaultResponse]="'goal'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “Now that we have finished the activity I want you to think about how hard it was for you, how much you liked it, and how much you think you learned.  I will ask you a question, and I want you to hold up the marker that best shows what you think.”</p>
      </step>
    </li>
    <li>
      <p><strong>Difficulty of the Activity</strong></p>
      <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “First, I want you to think about how hard you thought the activity was.”</p>
      </step>
      <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “We are going to use these strips to show what you think about the activity we just did.“</p>
      </step>
      <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Hold up each marker and say] “If you thought what we did just now was really hard I want you to put your chip in the really hard square.  If you thought what we did just now was hard put your chip in the hard square.  If you thought what we did just now was okay put your chip in the okay square.  If you thought what we did right now was easy put your chip in the easy square.  If you thought what we did just now was really easy put your chip in the really easy square.”</p>
      </step>
      <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say]  “I will ask you a question and when I say the magic words ‘Think, Ready, Respond’ you will put your chip in the square that best shows what you think about that question.  Do you have any questions?”</p>
        <p>[Answer any questions]</p>
      </step>
      <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say]  “Now I will pass out the strips and the chips and we will begin.”</p>
      </step>
      <ol>
        <li>
          <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" questionType="difficulty" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
            <p>What we did just now was <u>&nbsp;&nbsp;&nbsp;&nbsp;Think, Ready, Respond&nbsp;&nbsp;&nbsp;&nbsp;</u>.</p>
          </step>
        </li>
        <li>
          <step [defaultResponse]="'difficulty'" (onStepClicked)="stepClicked($event)" questionType="difficulty" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
            <p>Learning how to ${labels.main} was <u>&nbsp;&nbsp;&nbsp;&nbsp;Think, Ready, Respond&nbsp;&nbsp;&nbsp;&nbsp;</u>.</p>
          </step>
        </li>
      </ol>
    </li>
    <li>
      <p><strong>Appeal/Satisfaction</strong></p>
      <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “Now we are going to think about how much we liked the activity we just did.”</p>
      </step>
      <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “We are going to use these strips to show what you think about the activity we just did.“</p>
      </step>
      <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Hold up each marker and say] “If you thought what we did just now was not fun at all I want you to hold up this not fun at all marker.  If you thought what we did just now was not really fun hold up this not really fun marker.  If you thought what we did just now was okay hold up this okay marker.  If you thought what we did right now was fun hold up this fun marker.  If you thought what we did just now was really fun hold up this really fun marker.”</p>
      </step>
      <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say]  “I will ask you a question and when I say the magic words ‘Think, Ready, Respond’ you will put your chip in the square that best shows what you think about that question.  Do you have any questions?”</p>
        <p>[Answer any questions]</p>
      </step>
      <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say]  “Now I will pass out the strips and the chips and we will begin.”</p>
      </step>
      <ol>
        <li>
          <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" questionType="appeal" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
            <p>What we did just now was <u>&nbsp;&nbsp;&nbsp;&nbsp;Think, Ready, Respond&nbsp;&nbsp;&nbsp;&nbsp;</u>.</p>
          </step>
        </li>
        <li>
          <step [defaultResponse]="'appeal'" (onStepClicked)="stepClicked($event)" questionType="appeal" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
            <p>Learning how to ${labels.main} was <u>&nbsp;&nbsp;&nbsp;&nbsp;Think, Ready, Respond&nbsp;&nbsp;&nbsp;&nbsp;</u>.</p>
          </step>
        </li>
      </ol>
    </li>
    <li>
      <p><strong>Efficacy</strong></p>
      <step [defaultResponse]="'efficacy'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “Now we are going to think about how well you think you can ${labels.main} in a story.”</p>
      </step>
      <step [defaultResponse]="'efficacy'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say] “We are going to use these strips to show what you think about the activity we just did.“</p>
      </step>
      <step [defaultResponse]="'efficacy'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Hold up each marker and say] “If you think you couldn’t do it, I want you to hold up this I couldn’t do it marker.  If you think you could do it with a little help, hold up this I could do it with help marker.  If you think you could do it all by yourself, hold up this I could do it all by myself marker.“</p>
      </step>
      <step [defaultResponse]="'efficacy'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say]  “I will ask you a question and when I say the magic words ‘Think, Ready, Respond’ you will put your chip in the square that best shows what you think about that question.  Do you have any questions?”</p>
        <p>[Answer any questions]</p>
      </step>
      <step [defaultResponse]="'efficacy'" (onStepClicked)="stepClicked($event)" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
        <p>[Say]  “Now I will pass out the strips and the chips and we will begin.”</p>
      </step>
      <ol>`;
for (const task of labels.efficacy) {
  evaluationTemplate += `
        <li>
          <step [defaultResponse]="'efficacy'" (onStepClicked)="stepClicked($event)" questionType="efficacy" (onReady)="stepReady($event)" [highlightedStepId]="session.readyForResponse" [currentQuestionStepId]="session.questionStepId">
            <p>If someone asked me to ${task} <u>&nbsp;&nbsp;&nbsp;&nbsp;Think, Ready, Respond&nbsp;&nbsp;&nbsp;&nbsp;</u>.</p>
          </step>
        </li>`;
}
evaluationTemplate += `
      </ol>
    </li>
  </ol>
`;

getStdin().then((s: string) => {
  console.log(s.replace(new RegExp('__EVALUATION_TEMPLATE__', 'gi'), evaluationTemplate));
  process.exit(0);
});
