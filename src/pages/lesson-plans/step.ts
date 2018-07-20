import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core";
import {Session} from "api/models";
import {DeviceDetector} from "../../util/deviceDetector";
import {ErrorAlert} from "../../services/errorAlert";


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
  headTeacher: boolean;

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
    private errorAlert: ErrorAlert
  ) {
  }

  ngOnInit(): void {
    this.headTeacher = (Meteor.userId() == this.session.creatorsId);
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
    if (this.session.review) {
      this.done = this.questionId ? true : !this.done;
      this.session.completedSteps[this.stepId] = this.done;
      this.session.currentStepId = this.stepId;

      if (this.questionType) {
        this.session.readyForResponse = true;
        this.session.questionStepId = this.stepId;
        this.session.questionType = this.questionType;
        this.session.correctAnswer = this.correctAnswer;
        this.session.openResponse = this.openResponse;
        return;
      }

      this.session.readyForResponse = false;
      this.session.questionStepId = null;
      this.session.questionType = null;
      this.session.correctAnswer = null;
      this.session.openResponse = false;
      return;
    }

    if (!this.headTeacher) {
      this.done = this.questionId ? true : !this.done;
      return;
    }

    if ((!this.session.openResponse && this.session.questionStepId) || (this.session.openResponse && this.questionType)) {
      // in regular question mode when clicking any step, or open response mode when clicking a question, animate and block
      Step.doneAdd('show-warning');
      setTimeout(() => {
        Step.doneAdd('down');
        setTimeout(() => {
          Step.doneRemove('down');
          setTimeout(() => {
            Step.doneAdd('down');
            setTimeout(() => {
              Step.doneRemove('down');
              Step.doneRemove('show-warning');
            }, 300);
          }, 200);
        }, 200);
      }, 200);
      return
    }

    this.done = this.questionId ? true : !this.done;

    if (this.questionType) {
      Meteor.call('startQuestion', this.session._id, this.stepId, this.questionId, this.questionType, this.correctAnswer, this.openResponse, this.errorAlert.handler(6));
      return;
    }

    Meteor.call('setCurrentStep', this.session._id, this.stepId, this.done, this.defaultResponse, this.errorAlert.handler(7));
  }

  static doneAdd(c) {
    let button = window.document.getElementById('done-button');
    if (!button) {
      return;
    }
    button.classList.add(c);
  }

  static doneRemove(c) {
    let button = window.document.getElementById('done-button');
    if (!button) {
      return;
    }
    button.classList.remove(c);
  }

}
