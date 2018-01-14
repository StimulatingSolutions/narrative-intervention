import {Component, Input, OnInit} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Step } from '../step';
import { Session } from 'api/models';


import * as _ from 'lodash';

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

  // clicking toggles complete/incomplete regardless (unless question: requires done)
  // current is always last completed +1

  @Input() session: Session;

  steps: Step[];
  suggestedStepId: number;
  gettingResponsesFor: number;
  inGetResponsesMode: boolean;

  constructor(
    private alertCtrl: AlertController
  ) {

  }

  ngOnInit() {
    this.steps = [];

    //TODO: UPDATE THESE
    //this.suggestedStepId = this.session.currentStep;

    this.gettingResponsesFor = this.session.questionStepId;
    this.inGetResponsesMode = this.session.readyForResponse;
    this.suggestedStepId = this.calculateSuggestedStep();

  }

  ngOnChanges (changes) {
    //console.log('changes', changes);
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
  }

  handleResponseModeStuff () {
    const questionDiv = <HTMLElement>document.getElementsByClassName('active-question')[0];
    if (this.inGetResponsesMode && questionDiv) {
      const offset = questionDiv.offsetTop;
      const scrollDiv = document.getElementsByClassName('session-container')[0];
      if (!offset) {
        return;
      }
      scrollDiv.scrollTo({top: offset - 250, left: 0, behavior: "smooth"});
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ADDING block-scroll ("+this.inGetResponsesMode+")");
      scrollDiv.classList.add("block-scroll");
      document.getElementsByClassName("side-bar-info-content")[0].classList.add("response-mode");
    } else {
      const scrollDiv = document.getElementsByClassName('session-container')[0];
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ REMOVING block-scroll ("+this.inGetResponsesMode+")");
      scrollDiv.classList.remove("block-scroll");
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
      });
    } else {
      //console.log('Activating question from direct click')
      this.setReadyForResponse(stepId);
    }

    if (stepId + 1 === this.steps.length){
      if (this.session.active){
        this.toggleSessionActive(false);
      }
    } else {
      if (!this.session.active){
        this.toggleSessionActive(true);
      }
    }
  }

  setReadyForResponse (stepId) {
    Meteor.call('updateCompletedStepList', this.session._id, false, stepId, (error, result) => {
      //console.log('updated step done', result);
    });
    //console.log('Activating response mode: ', stepId)
    Meteor.call('updateSessionReadyForResponse', this.session._id, true, stepId, (error, result) => {
      if (error){
        this.handleError(error);
        return;
      }
      this.inGetResponsesMode = true;
      this.gettingResponsesFor = stepId;
    });
  }

  completeReadyForResponse (stepId) {
    Meteor.call('updateCompletedStepList', this.session._id, true, stepId, (error, result) => {
      //console.log('updated step done', result);
      //console.log('Completing Question: ', stepId);
      Meteor.call('updateSessionReadyForResponse', this.session._id, false, -1, (error, result) => {
        if (error){
          this.handleError(error);
          return;
        }
        this.inGetResponsesMode = false;
        this.gettingResponsesFor = null;
        //console.log("-------------------- completeReadyForResponse done");
        this.handleResponseModeStuff();
        this.updateSuggestedStep();
        if (this.steps[this.suggestedStepId].questionType) {
          this.setReadyForResponse(this.suggestedStepId);
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

  toggleSessionActive(active: boolean): void {
    MeteorObservable.call('setSessionActive', this.session._id, active).subscribe({
      next: () => {},
      error: (e: Error) => {
        this.handleError(e);
      }
    });
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
