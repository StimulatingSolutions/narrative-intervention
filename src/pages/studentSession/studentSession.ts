import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
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
    //private navCtrl: NavController
    private alertCtrl: AlertController,
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
        this.handleError(error);
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
      if (error){
        this.handleError(error);
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
          this.handleError(error);
          return;
        }
      })
    } else {
      this.selectedCard = null;
    }

    this.ref.detectChanges();
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

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.addSession();
    }
  }

}

/*
<ion-content padding class="student-session-page-content">
  <div [class.hidden]="!session?.readyForResponse">
    <div class='card-row'>
      <div [class.active]="selectedCard == 'goal' || selectedCard == undefined" class="img-button goal" (click)="selectCard('goal')"></div>
      <div [class.active]="selectedCard == 'try' || selectedCard == undefined" class="img-button try" (click)="selectCard('try')"></div>
    </div>
    <div class='card-row'>
      <div [class.active]="selectedCard == 'outcome-yes' || selectedCard == undefined" class="img-button outcome-yes" (click)="selectCard('outcome-yes')"></div>
      <div [class.active]="selectedCard == 'outcome-fail' || selectedCard == undefined" class="img-button outcome-fail" (click)="selectCard('outcome-fail')"></div>
    </div>
  </div>
  <div [class.hidden]="session?.readyForResponse">
    Waiting for question?
  </div>
</ion-content>
*/
