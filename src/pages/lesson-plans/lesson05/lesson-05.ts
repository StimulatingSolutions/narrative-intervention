import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Step } from '../step';
import { Session } from 'api/models';


import * as _ from 'lodash';

@Component({
  selector: 'lesson05',
  templateUrl: 'lesson-05.html',
})
export class Lesson05 implements OnInit {

  @Input() session: Session;

  steps: Step[];
  suggestedStepId: number;
  gettingResponsesFor: number;
  inGetResponsesMode: boolean;

  constructor(
    private ref: ChangeDetectorRef,
    private alertCtrl: AlertController
  ) {

  }

  ngOnInit() {
    this.steps = [];
    this.gettingResponsesFor = this.session.questionStepId;
    this.inGetResponsesMode = this.session.readyForResponse;
    this.suggestedStepId = this.calculateSuggestedStep();
  }

  ngOnChanges (changes) {
    if (changes.session.previousValue && changes.session.previousValue.readyForResponse && changes.session.previousValue.readyForResponse !== this.gettingResponsesFor){
      //QUESTION CLOSED IN SIDEBAR
      if (this.inGetResponsesMode && !this.session.readyForResponse){
        this.completeReadyForResponse(this.gettingResponsesFor);
        return
      }
    }
    if (changes.session.previousValue &&
        !changes.session.previousValue.readyForResponse &&
        changes.session.currentValue.readyForResponse &&
        (this.gettingResponsesFor === -1 || this.gettingResponsesFor === null)) {
          this.inGetResponsesMode = true;
          this.gettingResponsesFor = changes.session.currentValue.questionStepId;
    }

  }

  ngDoCheck () {
    this.updateSuggestedStep();
  }

  updateSuggestedStep () {
    this.steps.forEach( step => {
      step.setDoneStatus(_.includes(this.session.completedSteps, step.stepId));
    });

    const newStepId = this.calculateSuggestedStep();
    if (newStepId !== this.suggestedStepId){
        //console.log('New suggested Step', newStepId);
        this.suggestedStepId = newStepId;
    }
    if (this.steps[newStepId] && this.steps[newStepId].questionType !== this.session.questionType){
      let questionType = this.steps[newStepId].defaultResponse;
      if(this.steps[newStepId].hasOwnProperty('questionType')){
        questionType = this.steps[newStepId].questionType;
      }
      Meteor.call('updateQuestionType', this.session._id, questionType, (error, result) => {
      });
    }
  }

  handleResponseModeStuff () {
    const questionDiv = <HTMLElement>document.getElementsByClassName('active-question')[0];
    if (this.inGetResponsesMode && questionDiv) {
      // const offset = questionDiv.offsetTop;
      // const scrollDiv = document.getElementsByClassName('session-container')[0];
      // if (!offset) {
      //   return;
      // }
      // scrollDiv.scrollTo({top: offset - 250, left: 0, behavior: "smooth"});
      document.getElementsByClassName("side-bar-info-content")[0].classList.add("response-mode");
    } else {
      document.getElementsByClassName("side-bar-info-content")[0].classList.remove("response-mode");
    }
  }

  ngAfterViewChecked () {
    this.handleResponseModeStuff();
  }

  stepClicked(stepId) {
    //console.log('Clicked step: ', stepId)
    //If on question dont proceed
    if (this.gettingResponsesFor && this.gettingResponsesFor > -1){
      //console.log('Clicked Step while in response mode.')
      return
    }

    this.toggleStep(stepId);
  }

  toggleStep (stepId) {
    //can only complete question type by side bar
    if (!this.steps[stepId].questionType) {
      //locat state b/c its faster than waiting for session update
      //console.log('TESTING NEXT STEP FOR QUESTION')
      //console.log('stepId < this.steps.length - 1', (stepId < this.steps.length - 1))
      //console.log('this.steps[stepId + 1].questionType', (this.steps[stepId + 1].questionType))
      //console.log('this.suggestedStepId <= stepId', (this.suggestedStepId <= stepId))
      //console.log('!this.steps[stepId].done', (!this.steps[stepId].done))
      if (stepId < this.steps.length - 1 && this.steps[stepId + 1].questionType && this.suggestedStepId <= stepId && !this.steps[stepId].done){
        //console.log('Activating question: ', stepId + 1)
        this.setReadyForResponse(stepId + 1);
      }
      //(sessionId: string, add: boolean, stepId: number){
      Meteor.call('updateCompletedStepList', this.session._id, !this.steps[stepId].done, stepId, (error, result) => {
        //console.log('updated step done', result);
        this.ref.detectChanges();
      });
    } else {
      //console.log('Activating question from direct click')
      this.setReadyForResponse(stepId);
    }
  }

  setReadyForResponse (stepId) {
    Meteor.call('updateCompletedStepList', this.session._id, false, stepId, (error, result) => {
      //console.log('updated step done', result);
    });
    //console.log('Activating response mode: ', stepId)
    Meteor.call('updateSessionReadyForResponse', this.session._id, true, stepId, this.steps[stepId].questionType, this.steps[stepId].correctAnswer, (error, result) => {
      if (error){
        this.handleError(error, 6);
        return;
      }
      this.inGetResponsesMode = true;
      this.gettingResponsesFor = stepId;
      this.ref.detectChanges();
    });
  }

  completeReadyForResponse (stepId) {
    Meteor.call('updateCompletedStepList', this.session._id, true, stepId, (error, result) => {
      //console.log('updated step done', result);
      //console.log('Completing Question: ', stepId);
      Meteor.call('updateSessionReadyForResponse', this.session._id, false, -1, 'defaultResponse', null, (error, result) => {
        if (error){
          this.handleError(error, 7);
          return;
        }
        this.inGetResponsesMode = false;
        this.gettingResponsesFor = null;
        this.ref.detectChanges();
        //console.log("-------------------- completeReadyForResponse done");
        this.handleResponseModeStuff();
        //this.updateSuggestedStep();
        if (this.steps[stepId + 1] && this.steps[stepId + 1].questionType && !this.steps[stepId + 1].done) {
          this.setReadyForResponse(stepId + 1);
        }
      });
    });
  }

  calculateSuggestedStep (): number {
    if (this.session.completedSteps.length === 0){
      return 0;
    }

    return _.max(this.session.completedSteps) + 1;
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
