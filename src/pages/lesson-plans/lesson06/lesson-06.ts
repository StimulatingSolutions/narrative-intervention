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
    (<any>window).uncheckQuestion = () => {
      this.steps[this.session.questionStepId].done = false;
    };
    this.headTeacher = (Meteor.userId() == this.session.creatorsId);

    if (!this.headTeacher) {
      return;
    }

    for (let i in this.session.completedSteps) {
      if (this.steps[i]) {
        this.steps[i].done = this.session.completedSteps[i];
      }
    }
  }

  stepReady(step: Step) {
    step.done = this.session.completedSteps[step.stepId];
    this.steps[step.stepId] = step;
  }

  stepClicked(event: any) {
    if (this.session.review) {
      this.session.completedSteps[event.stepId] = event.checked;
      this.session.currentStepId = event.stepId;

      if (this.steps[event.stepId].questionType) {
        this.session.readyForResponse = true;
        this.session.questionStepId = event.stepId;
        this.session.questionType = this.steps[event.stepId].questionType;
        this.session.correctAnswer = this.steps[event.stepId].correctAnswer;
        this.session.openResponse = this.steps[event.stepId].openResponse;
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

    if (this.session.questionStepId || this.session.openResponse && this.steps[event.stepId].questionType) {
      // in regular question mode when clicking any step, or open response mode when clicking a question, animate and block
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

    if (this.steps[event.stepId].questionType) {
      Meteor.call('startQuestion', this.session._id, event.stepId, this.steps[event.stepId].questionId, this.steps[event.stepId].questionType, this.steps[event.stepId].correctAnswer, this.steps[event.stepId].openResponse, this.errorAlert.handler(6));
      return;
    }

    Meteor.call('setCurrentStep', this.session._id, event.stepId, event.checked, this.steps[event.stepId].defaultResponse, this.errorAlert.handler(7));
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
    let count: number = 0;
    for (let i=0; i<this.steps.length; i++) {
      if (this.session.completedSteps[i]) {
        count++;
      }
    }
    return `${count} checked, out of ${this.steps.length}`
  }

}
