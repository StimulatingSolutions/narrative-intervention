import { Component } from '@angular/core';
import { Step } from '../step';
//import { Observable } from 'rxjs';


//import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'lesson06',
  templateUrl: 'lesson-06.html',
})
export class Lesson06 {

  // allSteps: any[];  // there might be a better way of doing this
  // questionType?: string;
  // correctAnswer?: string;  // sometimes, a question will not have a correct answer
  // highlightedStepId: number;
  // currentQuestionStepId: number;

  steps: Step[];
  suggestedStepId: number;
  gettingResponsesFor: number;


  constructor() {
    this.steps = [];
  }


}
