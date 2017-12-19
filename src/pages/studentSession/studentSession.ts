import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
//import { Observable } from 'rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

import { LandingPage } from '../landing/landing';

//import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'studentSession',
  templateUrl: 'studentSession.html'
})
export class StudentSessionPage implements OnInit {

  studentSessionId: string;
  userId: string;
  session: Session;
  selectedCard: string;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
  ) {
    this.studentSessionId = navParams.get('sessionId');
    this.userId = navParams.get('userId');
    console.log('incoming id', this.studentSessionId)
  }

  ngOnInit(): void {
    console.log('init', this.session);
    MeteorObservable.subscribe('activeSession', this.studentSessionId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.session = Sessions.findOne({_id: this.studentSessionId});
        console.log('SESSION', this.session);
        if (!this.session.active){
          this.navCtrl.setRoot(LandingPage, {}, {
            animate: true
          });
        }
        if (this.session.readyForResponse) {
          console.log('Sending Response!', this.selectedCard)
          Meteor.call('sendQuestionResponse', this.session._id, this.userId, this.selectedCard, (error, result) => {
            if (error){
              this.handleError(error);
              return;
            }
          })
        }
      });
    });
    Meteor.call('joinSession', this.studentSessionId, this.userId, (error, result) => {
      if (error){
        this.handleError(error);
        return;
      }
    })
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
    console.log('card selected!', cardName);
    this.selectedCard = cardName;
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
