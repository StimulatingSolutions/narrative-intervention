import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Step } from '../step';
import { Session } from 'api/models';


@Component({
  selector: 'lesson06',
  templateUrl: 'lesson-06.html',
})
export class Lesson06 implements OnInit {

  @Input() session: Session;

  steps: Step[];
  completedStatuses: any;

  constructor(
    private alertCtrl: AlertController,
    private ref: ChangeDetectorRef
  ) {
    this.steps = [];
    this.completedStatuses = {};
  }

  ngOnInit():void {
    let tmpCompletedStatuses: any = {};
    for (let completedStep of this.session.completedSteps) {
      tmpCompletedStatuses[completedStep] = true;
    }
    this.completedStatuses = tmpCompletedStatuses;
    this.ref.detectChanges();
  }

  stepClicked(stepId) {
    //console.log('Clicked step: ', stepId)
    //If on question dont proceed
    if (this.session.questionStepId){
      //console.log('Clicked Step while in response mode.')
      return
    }

    let alreadyDone: boolean = !!this.completedStatuses[stepId];
    this.completedStatuses[stepId] = true;

    if (this.steps[stepId].questionType) {
      Meteor.call('startQuestion', this.session._id, stepId, alreadyDone, this.steps[stepId].questionType, this.steps[stepId].correctAnswer, (error, result) => {
        if (error){
          this.handleError(error, 6);
          return;
        }
      });
      return;
    }

    Meteor.call('setCurrentStep', this.session._id, stepId, alreadyDone, this.steps[stepId].defaultResponse, (error, result) => {
      if (error){
        this.handleError(error, 7);
        return;
      }
    });
  }

  handleError(e: Error, id: number): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: `Oops! (#${ id })`,
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }

}
