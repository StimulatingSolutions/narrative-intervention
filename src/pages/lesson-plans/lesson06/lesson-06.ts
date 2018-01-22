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

    let alreadyDone: boolean = this.steps[stepId].done;
    this.steps[stepId].done = true;

    if (this.steps[stepId].questionType) {
      Meteor.call('startQuestion', this.session._id, stepId, alreadyDone, this.steps[stepId].questionType, this.steps[stepId].correctAnswer, this.steps[stepId].openResponse, this.errorAlert.handler(6));
      return;
    }

    Meteor.call('setCurrentStep', this.session._id, stepId, alreadyDone, this.steps[stepId].defaultResponse, this.errorAlert.handler(7));
  }

}
