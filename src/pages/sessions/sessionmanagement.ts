import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Schools } from 'api/collections';
import { Sessions } from 'api/collections';
import { Session, School } from 'api/models';

import { TeacherSessionPage } from '../teacherSession/teacherSession';

import * as _ from 'lodash';
import * as moment from 'moment';
//import * as shortid from 'shortid';

function generateNumId() {
  const min = 0;
  const max = 999999;
  return _.padStart(Math.floor(Math.random()*(max-min+1)+min).toString(), 6, '0');
}

@Component({
  selector: 'sessionmanagement',
  templateUrl: 'sessionmanagement.html'
})
export class SessionManagementPage implements OnInit {

  addSessionVisible: boolean;
  addSessionName: string;
  addSessionSchoolId: string;
  addSessionLessonNumber: number;

  editSessionVisible: boolean;
  editSessionName: string;
  editSessionSchoolId: string;
  editSessionActive: boolean;
  sessionToEdit: Session;

  allSchools;
  allSessions;
  allSessionIds: string[];

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private ref: ChangeDetectorRef,
  ) {
    this.allSessionIds = ['6'];
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('sessions').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allSessions = this.findSessions();
      });
    });
    MeteorObservable.subscribe('schools').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allSchools = this.findSchools();
      });
    });
  }

  findSchools(): Observable<School[]> {
    return Schools.find({});
  }

  findSessions(): Observable<Session[]> {
    return Sessions.find({});
  }

  addSession(): void {
    //CHECK EMPTYS
    if(this.addSessionLessonNumber === undefined || this.addSessionSchoolId === undefined){
      const alert = this.alertCtrl.create({
        title: 'Oops!',
        message: 'All fields are required.',
        buttons: ['OK']
      });
      alert.present();
      return
    }

    const newSession: Session = {
      name: this.addSessionSchoolId + ", Lesson " + this.addSessionLessonNumber + ", " + moment().format('YYYY/MM/DD'),
      //date: moment().utc().toDate(),
      shortId: generateNumId(),
      creatersId: '',
      schoolId: this.addSessionSchoolId,
      active: true,
      activeUsers: [],
      questionStepId: null,
      questionType: 'defaultResponse',
      readyForResponse: false,
      responses: [],
      completedSteps: [],
      lesson: this.addSessionLessonNumber
    };
    MeteorObservable.call('createNewSession', newSession).subscribe({
      next: (result) => {

        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "Session: " + newSession.name,
          buttons: ['OK']
        });
        alert.present();

        this.addSessionVisible = false;
        this.addSessionName = '';
        this.addSessionSchoolId = '';
        this.addSessionLessonNumber = null;

        const newId = Sessions.findOne({shortId: newSession.shortId})._id;
        this.navCtrl.push(TeacherSessionPage, {sessionId: newId});
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });

    //this.addSessionVisible = false;
  }

  selectSessionToEdit(session): void {
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

    let updates = {
      name: this.editSessionName,
      schoolId: this.editSessionSchoolId
    };
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
    //console.log('SHOW ADD SESSION', visible)
    this.addSessionVisible = visible;
    this.ref.detectChanges();
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

  viewSession(session: Session): void {
    this.navCtrl.push(TeacherSessionPage, {sessionId: session._id});
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
