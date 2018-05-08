import {Component, Input, OnInit} from '@angular/core';
import { Step } from '../step';
import { Session } from 'api/models';
import {ErrorAlert} from "../../../services/errorAlert";


@Component({
  selector: 'lesson05',
  templateUrl: 'lesson-05.html',
})
export class Lesson05 implements OnInit {

  @Input() session: Session;

  steps: Step[];
  completedStatuses: any;
  headTeacher: boolean;

  constructor(
    private errorAlert: ErrorAlert
  ) {
    this.steps = [];
    this.completedStatuses = {};
  }

  ngOnInit():void {
    this.headTeacher = (Meteor.userId() == this.session.creatorsId);

    if (!this.headTeacher) {
      return;
    }

    for (let completedStep of this.session.completedSteps) {
      this.completedStatuses[completedStep] = true;
    }
  }

  stepReady(step: Step) {
    this.steps[step.stepId] = step;
    step.done = !!this.completedStatuses[step.stepId];
  }

  stepClicked(stepId) {
    if (this.session.review) {
      let alreadyDone: boolean = this.steps[stepId].done;
      this.steps[stepId].done = true;

      if (this.steps[stepId].questionType) {
        this.session.readyForResponse = true;
        this.session.questionStepId = stepId;
        this.session.questionType = this.steps[stepId].questionType;
        this.session.correctAnswer = this.steps[stepId].correctAnswer;
        this.session.currentStepId = stepId;
        this.session.openResponse = this.steps[stepId].openResponse;
        if (!alreadyDone) {
          this.session.completedSteps.push(stepId);
        }
        return;
      }

      this.session.currentStepId = stepId;
      this.session.readyForResponse = false;
      this.session.questionStepId = null;
      this.session.questionType = null;
      this.session.correctAnswer = null;
      this.session.openResponse = false;
      if (!alreadyDone) {
        this.session.completedSteps.push(stepId);
      }
      return;
    }

    if (!this.headTeacher) {
      this.steps[stepId].setDone(!this.steps[stepId].done);
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
        return
      }
    }

    this.steps[stepId].done = true;
    this.steps[stepId].iteration++;

    if (this.steps[stepId].questionType) {
      Meteor.call('startQuestion', this.session._id, stepId, this.steps[stepId].iteration, this.steps[stepId].questionType, this.steps[stepId].correctAnswer, this.steps[stepId].openResponse, this.errorAlert.handler(6));
      return;
    }

    Meteor.call('setCurrentStep', this.session._id, stepId, this.steps[stepId].iteration, this.steps[stepId].defaultResponse, this.errorAlert.handler(7));
  }

}
