- remove `<ol>` and `</li>` from `As you watch, Model/Think Aloud how to`
- add `<div class="instructions">` to `Use the following procedure throughout Guided Practice`
- fix `<ol>` stuff in `8. Closure`
- remove `<step>` before `Students may try to get up`
- ratings
- remove `CCSS.ELA-Literacy.SL.4.4` anchor span

```angular2html
<step
  questionType=""
  correctAnswer=""
  (onGetResponses)="getResponses($event)"
  
  [allSteps]="steps"
  [highlightedStepId]="suggestedStepId"
  [currentQuestionStepId]="gettingResponsesFor">
</step>
```

```
(onGetResponses)="getResponses($event)" questionType="goal" correctAnswer="" 
```
