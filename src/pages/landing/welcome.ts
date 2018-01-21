import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor'
import { LoginPage } from '../login/login';

import {Schools, Sessions} from 'api/collections';
import { Session } from 'api/models';

import { UserManagementPage } from '../usermanagement/usermanagement';
import { SchoolManagementPage } from '../schools/schoolmanagement';
import { SessionManagementPage } from '../sessions/sessionmanagement';
import { availableLessons } from './availableLessons';

import * as _ from 'lodash';
import {TeacherSessionPage} from "../teacherSession/teacherSession";
import * as moment from "moment";

function generateNumId() {
  const min = 0;
  const max = 999999;
  return _.padStart(Math.floor(Math.random()*(max-min+1)+min).toString(), 6, '0');
}

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  addSessionVisible: boolean;
  addSessionName: string;
  addSessionSchoolId: string;
  addSessionLessonNumber: number;

  joinSessionVisible: boolean;
  joinSessionCode: string;

  public roles: string[];
  public showUserManagement: boolean;
  public showSchoolManagement: boolean;
  public showSessionManagement: boolean;

  public unfinishedSessions;
  public allSchools;
  public allSessionIds: string[];


  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private ref: ChangeDetectorRef,
  ) {
    this.roles = [];
    this.showUserManagement = false;
    this.showSchoolManagement = false;
    this.showSessionManagement = false;
    this.allSessionIds = availableLessons;

    MeteorObservable.call<string[]>('getUserRoles').subscribe({
      next: (result: string[]) => {
        this.roles = result;
        this.showUserManagement = !!_.intersection(result, ['admin', 'researcher']).length;
        this.showSchoolManagement = !!_.intersection(result, ['admin', 'researcher', 'manager']).length;
        this.showSessionManagement = !!_.intersection(result, ['admin', 'researcher']).length;

        console.log('tools', this.showUserManagement, this.showSchoolManagement, this.showSessionManagement)
      },
      error: (e: Error) => {
        this.handleError(e, 2);
      }
    });
  }

  ngOnInit() {
    MeteorObservable.subscribe('sessions').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.unfinishedSessions = Sessions.find({active: true, creatersId: Meteor.user()._id});
      });
    });
    MeteorObservable.subscribe('schools').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allSchools = Schools.find({});
      });
    });
  }

  viewUserManagement(): void {
    this.navCtrl.push(UserManagementPage, {});
  }

  viewSchoolManagement(): void {
    this.navCtrl.push(SchoolManagementPage, {});
  }

  viewSessionManagement(): void {
    this.navCtrl.push(SessionManagementPage, {});
  }

  logout(): void {
    Meteor.logout( () => {
      this.navCtrl.setRoot(LoginPage, {}, {
        animate: true
      });
    });
  }

  finishSession(session: Session): void {
    MeteorObservable.call('setSessionActive', session._id, false).subscribe({
      next: () => {},
      error: (e: Error) => {
        this.handleError(e, 3);
      }
    });
  }

  viewSession(session: Session): void {
    this.navCtrl.push(TeacherSessionPage, {sessionId: session._id});
  }

  showAddSession(visible: boolean): void {
    this.addSessionVisible = visible;
    this.ref.detectChanges();
  }

  showJoinSession(visible: boolean): void {
    this.joinSessionVisible = visible;
    this.ref.detectChanges();
  }

  addSession(): void {
    //CHECK EMPTYS
    if(this.addSessionLessonNumber === undefined || this.addSessionSchoolId === undefined){
      this.handleError(new Error("All fields are required."), 27);
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
      correctAnswer: null,
      currentStepId: null,
      questionType: 'defaultResponse',
      readyForResponse: false,
      responses: [],
      completedSteps: [],
      lesson: this.addSessionLessonNumber
    };
    MeteorObservable.call('createNewSession', newSession).subscribe({
      next: (result) => {

        this.addSessionVisible = false;
        this.addSessionName = '';
        this.addSessionSchoolId = '';
        this.addSessionLessonNumber = null;

        const newId = Sessions.findOne({shortId: newSession.shortId})._id;
        this.navCtrl.push(TeacherSessionPage, {sessionId: newId});
      },
      error: (e: Error) => {
        this.handleError(e, 4);
      }
    });

    //this.addSessionVisible = false;
  }

  joinSession(): void {
    Meteor.call('findSessionByShortId', this.joinSessionCode, (error, result) => {
      if (error) {
        this.handleError(error, 5);
        return;
      }
      this.navCtrl.push(TeacherSessionPage, {sessionId: result});
    });
  }

  handleError(e: Error, id: number): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: `Oops! (#${ id })`,
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }

}
