import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";
import {Session} from "api/models";
import {DeviceDetector} from "../../util/deviceDetector";


let nextStepId: number = 0;
let nextQuestionId: number = 1;

@Component({
  selector: 'step',
  templateUrl: 'step.html'
})
export class Step implements OnInit {

  stepId: number;
  questionId?: number;
  done: boolean;

  @Input() allSteps: Step[];  // there might be a better way of doing this
  @Input() questionType?: string;
  @Input() practice?: string;
  @Input() correctAnswer?: string;  // sometimes, a question will not have a correct answer
  @Input() session: Session;
  @Input() defaultResponse: string;
  @Input() openResponse: boolean;

  @Output() onStepClicked =  new EventEmitter<any>();
  @Output() onReady =  new EventEmitter<Step>();

  constructor(
  ) {
  }

  ngOnInit(): void {
    this.stepId = nextStepId++;
    if (this.questionType) {
      // not all steps are questions
      this.questionId = nextQuestionId++;
    }
    this.onReady.emit(this);
  }

  public static resetIds(): void {
    nextStepId = 0;
    nextQuestionId = 1;
  }

  clickStep(type: string) {
    if (type === 'click' && DeviceDetector.device != 'web' || type === 'touch' && DeviceDetector.device === 'web') {
      return;
    }
    this.done = this.questionId ? true : !this.done;
    this.onStepClicked.emit({stepId: this.stepId, checked: this.done});
  }

}
