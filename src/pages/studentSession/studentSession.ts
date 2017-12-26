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
  session: Session;
  selectedCard: string;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
  ) {
    this.studentSessionId = this.navParams.get('sessionId');
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
      });
    });
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
