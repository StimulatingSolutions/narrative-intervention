import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Schools } from 'api/collections';
import { Sessions } from 'api/collections';
import { Session, School } from 'api/models';

//import * as _ from 'lodash';
import * as moment from 'moment';
import * as shortid from 'shortid';

@Component({
  selector: 'sessionmanagement',
  templateUrl: 'sessionmanagement.html'
})
export class SessionManagementPage implements OnInit {

  addSessionVisible: boolean;
  addSessionName: string;
  addSessionSchoolId: string;

  editSessionVisible: boolean;
  editSessionName: string;
  editSessionSchoolId: string;
  editSessionActive: boolean;
  sessionToEdit: Session;

  allSchools;
  allSessions;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
    MeteorObservable.subscribe('sessions').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        console.log('all sessions before', this.allSessions)
        this.allSessions = this.findSessions();
        console.log('all sessions', this.allSessions)
      });
    });
    MeteorObservable.subscribe('schools').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allSchools = this.findSchools();
      });
    });
  }

  findSchools(): Observable<School[]> {
    Schools.find({}).forEach( school => {
      console.log('school! ', school);
    })
    return Schools.find({});
  }

  findSessions(): Observable<Session[]> {
    console.log('finding sessions', Sessions.find({}))
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
      //date: moment().utc().toDate(),
      shortId: shortid.generate(),
      creatersId: '',
      schoolId: this.addSessionSchoolId,
      active: true
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
    this.editSessionSchoolId = session.schoolId;
    this.editSessionActive = session.active;
    this.editSessionVisible = true;
  }

  hideSessionEdit(): void {
    this.editSessionVisible = false;
  }

  updateSession(session): void {

    var updates = {
      name: this.editSessionName,
      schoolId: this.editSessionSchoolId
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

  toggleSessionActive(active: boolean): void {
    MeteorObservable.call('setSessionActive', this.sessionToEdit._id, active).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "Session: " + this.editSessionName + ' has been ' + (active ? 'activated.' : 'deactivated'),
          buttons: ['OK']
        });
        alert.present();

        this.editSessionVisible = false;
        this.editSessionName = '';
        this.editSessionSchoolId = '';
        this.editSessionActive = false;
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
