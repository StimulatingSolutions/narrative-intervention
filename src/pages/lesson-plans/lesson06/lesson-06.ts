import {Component, Input, OnInit} from '@angular/core';
import { Step } from '../step';
import { Session } from 'api/models';
import {ErrorAlert} from "../../../services/errorAlert";


@Component({
  selector: 'lesson06',
  templateUrl: 'lesson-06.html',
})
export class Lesson06 implements OnInit {

  @Input() session: Session;

  steps: Step[];
  headTeacher: boolean;

  constructor(
    private errorAlert: ErrorAlert
  ) {
    this.steps = [];
  }

  ngOnInit():void {
    this.headTeacher = (Meteor.userId() == this.session.creatorsId);

    if (!this.headTeacher) {
      return;
    }
  }

  stepReady(step: Step) {
    this.steps[step.stepId] = step;
  }

  stepClicked(stepId) {
    if (this.session.review) {
      this.session.completedSteps[stepId] = true;
      this.session.currentStepId = stepId;

      if (this.steps[stepId].questionType) {
        this.session.readyForResponse = true;
        this.session.questionStepId = stepId;
        this.session.questionType = this.steps[stepId].questionType;
        this.session.correctAnswer = this.steps[stepId].correctAnswer;
        this.session.openResponse = this.steps[stepId].openResponse;
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
      return;
    }

    if (this.session.openResponse) {
      // in open response mode, we only block clicking on questions
      if (this.steps[stepId].questionType) {
        return;
      }
    } else {
      // in regular question mode, we block clicking on any step
      if (this.session.questionStepId) {
        this.doneAdd('show-warning');
        setTimeout(() => {
          this.doneAdd('down');
          setTimeout(() => {
            this.doneRemove('down');
            setTimeout(() => {
              this.doneAdd('down');
              setTimeout(() => {
                this.doneRemove('down');
                this.doneRemove('show-warning');
              }, 300);
            }, 200);
          }, 200);
        }, 200);
        return
      }
    }

    if (this.steps[stepId].questionType) {
      Meteor.call('startQuestion', this.session._id, stepId, this.steps[stepId].questionId, this.steps[stepId].questionType, this.steps[stepId].correctAnswer, this.steps[stepId].openResponse, this.errorAlert.handler(6));
      return;
    }

    Meteor.call('setCurrentStep', this.session._id, stepId, this.steps[stepId].defaultResponse, this.errorAlert.handler(7));
  }

  doneAdd(c) {
    let button = window.document.getElementById('done-button');
    if (!button) {
      return;
    }
    button.classList.add(c);
  }

  doneRemove(c) {
    let button = window.document.getElementById('done-button');
    if (!button) {
      return;
    }
    button.classList.remove(c);
  }

  getCounts(): string {
    return `${Object.keys(this.session.completedSteps).length} checked, out of ${this.steps.length}`
  }

}
