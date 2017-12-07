import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

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

  teacherSessionId: string;
  session: Session;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public navCtrl: NavController,
  ) {
    this.teacherSessionId = navParams.get('sessionId');
    console.log('incoming id', this.teacherSessionId)
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('activeSession').subscribe((result) => {
      MeteorObservable.autorun().subscribe((result1) => {
        this.session = Sessions.findOne({_id: this.teacherSessionId});
      });
    });
  }

  toggleSessionActive(active: boolean): void {
    MeteorObservable.call('setSessionActive', this.teacherSessionId, active).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "Session: " + this.session + ' has been ' + (active ? 'activated.' : 'deactivated'),
          buttons: ['OK']
        });
        alert.present();
      },
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

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.addSession();
    }
  }

}
