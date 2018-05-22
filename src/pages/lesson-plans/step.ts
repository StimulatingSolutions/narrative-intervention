import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef} from "@angular/core";
import {Session} from "api/models";


let nextStepId: number = 0;
let nextQuestionId: number = 1;

@Component({
  selector: 'step',
  templateUrl: 'step.html'
})
export class Step implements OnInit {

  stepId: number;
  questionId?: number;
  public done: boolean = false;

  @Input() allSteps: Step[];  // there might be a better way of doing this
  @Input() questionType?: string;
  @Input() correctAnswer?: string;  // sometimes, a question will not have a correct answer
  @Input() session: Session;
  @Input() defaultResponse: string;
  @Input() openResponse: boolean;

  @Output() onStepClicked =  new EventEmitter<number>();
  @Output() onReady =  new EventEmitter<Step>();

  constructor(
    private ref: ChangeDetectorRef
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

  clickStep() {
    this.onStepClicked.emit(this.stepId);
  }

  public setDone(status: boolean) {
    this.done = status;
    this.ref.detectChanges();
  }

}
