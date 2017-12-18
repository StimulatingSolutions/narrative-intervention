import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";


let nextStepId: number = 0;
let nextQuestionId: number = 0;

@Component({
  selector: 'step',
  templateUrl: 'step.html'
})
export class Step implements OnInit {

  stepId: number;
  questionId?: number;
  done: boolean = false;

  @Input() allSteps: Step[];  // there might be a better way of doing this
  @Input() questionType?: string;
  @Input() correctAnswer?: string;  // sometimes, a question will not have a correct answer
  @Input() highlightedStepId: number;
  @Input() currentQuestionStepId: number;

  @Output() onGetResponses = new EventEmitter<number>();


  constructor() {
  }

  ngOnInit(): void {
    this.stepId = nextStepId++;
    if (this.questionType) {
      // not all steps are questions
      this.questionId = nextQuestionId++;
    }
    this.allSteps[this.stepId] = this;
  }


  clickStep() {
    if (!this.questionType) {
      this.done = !this.done;
      return;
    }
    this.onGetResponses.emit(this.stepId);
  }
}
