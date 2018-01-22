import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor'
import { LoginPage } from '../login/login';

import {Schools, Sessions} from 'api/collections';
import { Session } from 'api/models';

import { UserManagementPage } from '../usermanagement/usermanagement';
import { SchoolManagementPage } from '../schools/schoolmanagement';
import { availableLessons } from './availableLessons';

import * as _ from 'lodash';
import {TeacherSessionPage} from "../teacherSession/teacherSession";
import * as moment from "moment";
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";

function generateNumId() {
  const min = 0;
  const max = 999999;
  return _.padStart(Math.floor(Math.random()*(max-min+1)+min).toString(), 6, '0');
}

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage extends DestructionAwareComponent implements OnInit {

  inputVars: any = {};

  joinSessionVisible: boolean;
  joinSessionCode: string;

  public roles: string[];
  public showUserManagement: boolean;
  public showSchoolManagement: boolean;

  public unfinishedSessions;
  public allSchools;
  public allSessionIds: string[];
  public activeSessionsForGroup: Session[];


  constructor(
    private navCtrl: NavController,
    private errorAlert: ErrorAlert,
    private ref: ChangeDetectorRef,
    private alertCtrl: AlertController
  ) {
    super();
    this.roles = [];
    this.showUserManagement = false;
    this.showSchoolManagement = false;
    this.allSessionIds = availableLessons;

    MeteorObservable.call<string[]>('getUserRoles')
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result: string[]) => {
        this.roles = result;
        this.showUserManagement = !!_.intersection(result, ['admin', 'researcher']).length;
        this.showSchoolManagement = this.showUserManagement;
      },
      error: this.errorAlert.presenter(2)
    });
  }

  ngOnInit() {
    MeteorObservable.subscribe('sessions')
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {
        this.unfinishedSessions = Sessions.find({active: true, creatorsId: Meteor.user()._id});
      });
    });
    MeteorObservable.subscribe('schools')
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {
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

  logout(): void {
    Meteor.logout( () => {
      this.navCtrl.setRoot(LoginPage, {}, {
        animate: true
      });
    });
  }

  finishSession(session: Session): void {
    MeteorObservable.call('setSessionActive', session._id, false)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: () => {},
      error: this.errorAlert.presenter(3)
    });
  }

  viewSession(session: Session): void {
    this.navCtrl.push(TeacherSessionPage, {sessionId: session._id});
  }

  showJoinSession(visible: boolean): void {
    this.joinSessionVisible = visible;
    this.ref.detectChanges();
  }

  addSession(): void {
    //CHECK EMPTYS
    if(!this.inputVars['school-select'] || !this.inputVars['lesson-number-select']){
      return
    }

    let schoolName;
    this.allSchools.forEach((school) => {
      if (school.idNumber === this.inputVars['school-select']) {
        schoolName = school.name;
      }
    });
    const newSession: Session = {
      creationDate: moment().format('YYYY/MM/DD'),
      //date: moment().utc().toDate(),
      shortId: generateNumId(),
      creatorsId: '',
      schoolNumber: this.inputVars['school-select'],
      schoolName: schoolName,
      active: true,
      activeUsers: [],
      questionStepId: null,
      correctAnswer: null,
      currentStepId: null,
      questionType: null,
      backupQuestionType: null,
      readyForResponse: false,
      openResponse: false,
      responses: [],
      completedSteps: [],
      lesson: this.inputVars['lesson-number-select']
    };
    this.resetCreateSessionFlow();
    MeteorObservable.call('createNewSession', newSession)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result) => {
        const newId = Sessions.findOne({shortId: newSession.shortId})._id;
        this.navCtrl.push(TeacherSessionPage, {sessionId: newId});
      },
      error: this.errorAlert.presenter(4)
    });
  }

  maybeAutoJoinSession() {
    let schoolNum = this.inputVars['school-select-join'];
    if (!schoolNum) {
      return;
    }
    this.activeSessionsForGroup = Sessions.find({schoolNumber: schoolNum, active: true}).fetch();
    if (this.activeSessionsForGroup.length == 0) {
      this.resetJoinSessionFlow();
      this.alertCtrl.create({title: 'Oops!', message: `Group ${schoolNum} has no active sessions right now.`, buttons: ['OK']}).present();
    } else if (this.activeSessionsForGroup.length == 1) {
      this.resetJoinSessionFlow();
      this.navCtrl.push(TeacherSessionPage, {sessionId: this.activeSessionsForGroup[0]._id});
    } else {
      this.inputVars['session-select'] = null;
      this.ref.detectChanges();
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@ "+JSON.stringify(this.inputVars));
      this.forceClick('session-select');
    }
  }

  resetCreateSessionFlow() {
    this.inputVars['school-select'] = null;
    this.inputVars['lesson-number-select'] = null;
  }

  resetJoinSessionFlow() {
    this.inputVars['school-select-join'] = null;
    this.inputVars['session-select'] = null;
  }

  forceClick(selectId: string): void {
    this.inputVars[selectId] = null;
    document.getElementById(selectId).click();
  }

  joinSession(): void {
    if (!this.inputVars['session-select']) {
      return;
    }
    console.log("========================= "+JSON.stringify(this.inputVars));
    this.resetJoinSessionFlow();
    this.navCtrl.push(TeacherSessionPage, {sessionId: this.inputVars['session-select']});
  }
}
