import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Step } from '../step';
//import { Observable } from 'rxjs';
import { Session } from 'api/models';


//import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'lesson06',
  templateUrl: 'lesson-06.html',
})
export class Lesson06 implements OnInit {

  // allSteps: any[];  // there might be a better way of doing this
  // questionType?: string;
  // correctAnswer?: string;  // sometimes, a question will not have a correct answer
  // highlightedStepId: number;
  // currentQuestionStepId: number;

  @Input() session: Session;

  steps: Step[];
  suggestedStepId: number;
  gettingResponsesFor: number;


  constructor(
    private alertCtrl: AlertController
  ) {

  }

  ngOnInit() {
    this.steps = [];
    this.suggestedStepId = this.session.currentStep;
    this.gettingResponsesFor = this.session.currentStep;
  }

  stepClicked(stepId) {

    if (stepId !== this.suggestedStepId){
      return;
    }

    //IF CURRENT QUESTION - FINISH IT
    if (this.steps[stepId].questionType){
      Meteor.call('updateSessionReadyForResponse', this.session._id, false, (error, result) => {
        if (error){
          this.handleError(error);
          return;
        }
      })
    }

    //UPDATE TO NEXT STEP
    this.suggestedStepId++;
    this.gettingResponsesFor++;

    Meteor.call('updateSessionStep', this.session._id, this.gettingResponsesFor, (error, result) => {
      if (error){
        this.handleError(error);
        return;
      }
      //IF NEW STEP IS QUSTION READY RESPONSES;
      if(this.steps[this.gettingResponsesFor].questionType){
        Meteor.call('updateSessionReadyForResponse', this.session._id, true, (error, result) => {
          if (error){
            this.handleError(error);
            return;
          }
        });
      }
    });
  }

  getResponses(stepId) {

    if (stepId !== this.suggestedStepId){
      return;
    }

    this.suggestedStepId++;
    this.gettingResponsesFor++;

    Meteor.call('updateSessionReadyForResponse', this.session._id, true, (error, result) => {
      if (error){
        this.handleError(error);
        return;
      }
      Meteor.call('updateSessionReadyForResponse', this.session._id, false, (error, result) => {
        if (error){
          this.handleError(error);
          return;
        }
      })
    })
  }

  handleCompleteNonQuestion(stepId) {

    if (stepId !== this.suggestedStepId){
      return;
    }

    this.suggestedStepId++;
    this.gettingResponsesFor++;

    Meteor.call('updateSessionStep', this.session._id, this.gettingResponsesFor, (error, result) => {
      if (error){
        this.handleError(error);
        return;
      }
    })
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }


}
