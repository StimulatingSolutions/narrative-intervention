import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

import { LoginPage } from '../login/login';

import * as _ from 'lodash';
@Component({
  selector: 'studentSession',
  templateUrl: 'studentSession.html'
})
export class StudentSessionPage implements OnInit {

  studentSessionId: string;
  userId: string;
  session: Session;
  selectedCard: string;
  questionType: string;

  constructor(
    private navParams: NavParams,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
  ) {
    this.studentSessionId = this.navParams.get('sessionId');
    this.userId = this.navParams.get('userId');
    this.questionType = '';
  }

  ngDoCheck(): void {
    //need to know what to display
    console.log('SESSION QUESTION!', this.session);
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('activeSession', this.studentSessionId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {

        const updatedSession = Sessions.findOne({_id: this.studentSessionId});
        this.updateSessionChanges(this.session, updatedSession);
        this.session = updatedSession;
        this.questionType = this.session.questionType;

        this.ref.detectChanges();
        if (!this.session.active){
          this.navCtrl.setRoot(LoginPage, {}, {
            animate: true
          });
        }
      });

      const session = Sessions.findOne({_id: this.studentSessionId});
      if (session.readyForResponse) {
        // IF STARTING UP IN RESPONSE MODE SET SELECTED CARD
        const thisStepsResponses = session.responses.filter( response => {
          return response.step === session.questionStepId && response.studentId === this.userId;
        });
        const latestResponse = _.maxBy(thisStepsResponses, (o) => {
          return o.date;
        });
        if (latestResponse){
          this.selectedCard = latestResponse.response;
        }
      }
    });
    Meteor.call('joinSession', this.studentSessionId, this.userId, (error, result) => {
      if (error){
        this.handleError(error, 18);
        return;
      }
    })

    console.log('session?', Sessions.findOne({_id: this.studentSessionId}))
  }

  updateSessionChanges (oldSession: Session, newSession: Session): void {
    if (oldSession === undefined || newSession === undefined){
      return;
    }

    if(!oldSession.readyForResponse && newSession.readyForResponse){
      const thisStepsResponses = newSession.responses.filter( response => {
        return response.step === newSession.questionStepId && response.studentId === this.userId;
      });
      const latestResponse = _.maxBy(thisStepsResponses, (o) => {
        return o.date;
      });
      if (latestResponse){
        this.selectedCard = latestResponse.response;
      }

    }

    if (!newSession.readyForResponse){
      this.selectedCard = null;
    }
  }

  ngOnDestroy(): void {
    Meteor.call('leaveSession', this.studentSessionId, this.userId, (error, result) => {
      if (error && error.reason != "Session does not exist"){
        this.handleError(error, 19);
        return;
      }
    })
  }

  selectCard(cardName: string): void {
    this.selectedCard = cardName;
    if (this.session && this.session.readyForResponse) {
      this.selectedCard = cardName;
      const date = new Date();
      Meteor.call('sendQuestionResponse', this.session._id, this.userId, this.selectedCard, date, (error, result) => {
        if (error){
          this.handleError(error, 20);
          return;
        }
      })
    } else {
      this.selectedCard = null;
    }

    this.ref.detectChanges();
  }

  handleError(e: Error, id: number): void {
    console.error(e);
    //  don't show an alert on the student tablets, too confusing for them
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.addSession();
    }
  }

}
