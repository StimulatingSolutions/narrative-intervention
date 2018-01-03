import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
//import { Observable } from 'rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

//import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'teacherSession',
  templateUrl: 'teacherSession.html'
})
export class TeacherSessionPage implements OnInit {

  incomingSessionId: string;
  session: Session;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public navCtrl: NavController,
  ) {
    this.incomingSessionId = this.navParams.get('sessionId');
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('activeSession', this.incomingSessionId).subscribe((result) => {
      MeteorObservable.autorun().subscribe((result1) => {
        this.session = Sessions.findOne({_id: this.incomingSessionId});
      });
    });
  }

  handleFindPlace (): void {
    let highlightedDiv = <HTMLElement>document.getElementsByClassName('step-content highlighted')[0];

    if (!highlightedDiv) {
      let steps = document.getElementsByTagName('step');
      highlightedDiv = <HTMLElement>steps[steps.length-1];
    }
    if (highlightedDiv) {
      const offset = highlightedDiv.offsetTop;
      const scrollDiv = document.getElementsByClassName('session-container')[0];
      scrollDiv.scrollTo({top: offset - 100, left: 0, behavior: "smooth"});
    }
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
