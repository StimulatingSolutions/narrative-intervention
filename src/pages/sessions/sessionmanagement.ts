import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

//import * as _ from 'lodash';
import moment from 'moment';
import shortid from 'shortid';

@Component({
  selector: 'sessionmanagement',
  templateUrl: 'sessionmanagement.html'
})
export class SessionManagementPage implements OnInit {

  addSessionVisible: boolean;
  addSessionName: string;

  editSessionVisible: boolean;
  editSessionName: string;
  sessionToEdit: Session;

  allSessions: Observable<Session[]>;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
    MeteorObservable.subscribe('sessions').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allSessions = this.findSessions();
      });
    });
  }

  findSessions(): Observable<Session[]> {
    Sessions.find({}).forEach( session => {
      console.log('session! ', session);
    })
    return Sessions.find({});
  }

  addSession(): void {

    //CHECK EMPTYS
    if(this.addSessionName === ''){
      const alert = this.alertCtrl.create({
        title: 'Oops!',
        message: 'Valid Session Name isrequired.',
        buttons: ['OK']
      });
      alert.present();
      return
    }

    const newSession: Session = {
      name: this.addSessionName,
      date: moment().utc().toDate(),
      shortId: shortid.generate()
    }
    MeteorObservable.call('createNewSession', newSession).subscribe({
      next: (result) => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "Session: " + this.addSessionName,
          buttons: ['OK']
        });
        alert.present();

        this.addSessionVisible = false;
        this.addSessionName = '';
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });

    //this.addSessionVisible = false;
  }

  selectSessionToEdit(session): void {
    console.log('selected session: ', session)
    this.sessionToEdit = session;
    this.editSessionName = session.name;
    this.editSessionVisible = true;
  }

  hideSessionEdit(): void {
    this.editSessionVisible = false;
  }

  updateSession(session): void {

    var updates = {
      name: this.editSessionName
    }
    MeteorObservable.call('updateSession', this.sessionToEdit, updates).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "Session: " + this.editSessionName,
          buttons: ['OK']
        });
        alert.present();

        this.editSessionVisible = false;
        this.editSessionName = '';
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  showAddSession(visible: boolean): void {
    this.addSessionVisible = visible;
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
