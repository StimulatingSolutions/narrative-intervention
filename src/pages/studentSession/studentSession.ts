import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

import { LoginPage } from '../login/login';


@Component({
  selector: 'studentSession',
  templateUrl: 'studentSession.html'
})
export class StudentSessionPage implements OnInit {

  studentSessionId: string;
  userId: string;
  session: Session;
  selectedCard: string;
  inGetResponsesMode: boolean;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
  ) {
    this.studentSessionId = this.navParams.get('sessionId');
    this.userId = this.navParams.get('userId');
    console.log('incoming id', this.studentSessionId)
    this.inGetResponsesMode = false;
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('activeSession', this.studentSessionId).subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.session = Sessions.findOne({_id: this.studentSessionId});
        //this.inGetResponsesMode = this.session.readyForResponse;
        this.ref.detectChanges();
        if (!this.session.active){
          this.navCtrl.setRoot(LoginPage, {}, {
            animate: true
          });
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

  ngDoCheck () {
    //console.log(this.session)
    console.log('in response mode', this.inGetResponsesMode);
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
      const date = new Date();
      Meteor.call('sendQuestionResponse', this.session._id, this.userId, this.selectedCard, date, (error, result) => {
        if (error){
          this.handleError(error);
          return;
        }
      })
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
