import { OnInit } from '@angular/core';
import { Step } from './step';
import { Session } from 'api/models';


export abstract class BaseLesson implements OnInit {

  abstract session: Session;

  steps: Step[] = [];
  headTeacher: boolean;

  protected constructor() {
  }

  ngOnInit(): void {
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
    this.steps[step.stepId] = step;
    if (!this.headTeacher) {
      return;
    }
    step.done = this.session.completedSteps[step.stepId];
  }

  getCounts(): string {
    let count: number = 0;
    for (let i = 0; i < this.steps.length; i++) {
      if (this.headTeacher ? this.session.completedSteps[i] : this.steps[i].done) {
        count++;
      }
    }
    return `${count} checked, out of ${this.steps.length}`
  }

}
