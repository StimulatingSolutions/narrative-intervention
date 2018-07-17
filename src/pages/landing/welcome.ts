import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor'
import { LoginPage } from '../login/login';

import {Schools, Sessions} from 'api/collections';
import {School, Session} from 'api/models';

import { UserManagementPage } from '../usermanagement/usermanagement';
import { SchoolManagementPage } from '../schools/schoolmanagement';
import { availableLessons } from './availableLessons';

import {intersection} from 'lodash';
import {TeacherSessionPage} from "../teacherSession/teacherSession";
import * as moment from "moment";
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import {DataManagementPage} from "../dataManagement/dataManagement";
import {VideosPage} from "../videos/videos";

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage extends DestructionAwareComponent implements OnInit {

  public showUserManagement: boolean;
  public showSchoolManagement: boolean;
  public showDataManagement: boolean;
  public showSessionManagement: boolean;
  public isAdmin: boolean;

  public unfinishedSessions;
  public allSchools;
  public userId;


  constructor(
    private navCtrl: NavController,
    private errorAlert: ErrorAlert,
    private alertCtrl: AlertController
  ) {
    super();
    this.showUserManagement = false;
    this.showSchoolManagement = false;
    this.showSessionManagement = false;
    this.showDataManagement = false;
    this.isAdmin = false;

    MeteorObservable.call<string[]>('getUserRoles')
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result: string[]) => {
        this.showUserManagement = result.indexOf('admin') !== -1;
        this.showSchoolManagement = this.showUserManagement;
        this.showDataManagement = !!intersection(result, ['admin', 'researcher']).length;
        this.showSessionManagement = !!intersection(result, ['admin', 'teacher']).length;
        this.isAdmin = result.indexOf('admin') !== -1;
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
        this.userId = Meteor.user()._id;
        let criteria: any = {active: true};
        if (!this.isAdmin) {
          criteria.creatorsId = Meteor.user()._id;
        }
        this.unfinishedSessions = Sessions.find(criteria);
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

  viewDataManagement(): void {
    this.navCtrl.push(DataManagementPage, {});
  }

  logout(): void {
    Meteor.logout( () => {
      this.navCtrl.setRoot(LoginPage, {}, {
        animate: true
      });
    });
  }

  finishSession(session: Session, next?): void {
    MeteorObservable.call('setSessionActive', session._id, false)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (next ? next : () => {}),
      error: this.errorAlert.presenter(3)
    });
  }

  addSession(school: School, lesson: number): void {
    const newSession: Session = {
      creatorsId: '',
      schoolNumber: school.idNumber,
      schoolName: school.name,
      active: true,
      activeStudents: [],
      questionStepId: null,
      correctAnswer: null,
      currentStepId: null,
      questionType: null,
      backupQuestionType: null,
      readyForResponse: false,
      openResponse: false,
      completedSteps: {},
      lesson: lesson,
      questionIterations: {},
      questionResponses: {},
      responses: {},
      cohortNumber: school.cohort
    };
    MeteorObservable.call('createNewSession', newSession)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result) => {
        const newId = Sessions.findOne({schoolNumber: newSession.schoolNumber, active: true})._id;
        this.joinSession(newId);
      },
      error: this.errorAlert.presenter(4)
    });
  }

  joinSessionByGroup(school: School) {
    let activeSessionsForGroup: Session[] = Sessions.find({schoolNumber: school.idNumber, active: true}).fetch();
    if (activeSessionsForGroup.length == 0) {
      this.errorAlert.present(new Error(`Group ${school.idNumber} has no active sessions right now.`), 1);
    } else if (activeSessionsForGroup.length == 1) {
      this.joinSession(activeSessionsForGroup[0]._id);
    } else {
      let sessionAlert = this.alertCtrl.create();
      sessionAlert.setCssClass('wide-input');
      sessionAlert.setTitle('Choose Session:');
      activeSessionsForGroup.forEach((session: Session) => {
        sessionAlert.addInput({
          type: 'radio',
          label: `Lesson ${session.lesson}, created on ${this.timeString(session.creationTimestamp)}`,
          value: session._id
        });
      });
      sessionAlert.addButton('Cancel');
      sessionAlert.addButton({
        text: 'Ok',
        handler: (sessionId: string) => {
          this.joinSession(sessionId);
        }
      });
      sessionAlert.present();
    }
  }

  joinSession(sessionId: string): void {
    if (!sessionId) {
      return;
    }
    this.navCtrl.push(TeacherSessionPage, {sessionId: sessionId});
  }

  chooseSchool(intent: string) {
    let schoolAlert = this.alertCtrl.create();
    schoolAlert.setCssClass('wide-input');
    schoolAlert.setTitle('Choose Group:');
    this.allSchools.forEach((school: School) => {
      schoolAlert.addInput({
        type: 'radio',
        label: `Group ${school.idNumber} (at ${school.name})`,
        value: school.idNumber.toString()
      });
    });
    schoolAlert.addButton('Cancel');
    schoolAlert.addButton({
      text: 'Ok',
      handler: (schoolId: string) => {
        let selectedSchool: School;
        this.allSchools.forEach((school) => {
          if (school.idNumber == schoolId) {
            selectedSchool = school;
          }
        });
        if (intent === 'create') {
          this.checkForConflictSession(selectedSchool);
        } else {
          this.joinSessionByGroup(selectedSchool);
        }
      }
    });
    schoolAlert.present();
  }

  checkForConflictSession(school: School) {
    let activeSessionsForGroup: Session[] = Sessions.find({schoolNumber: school.idNumber, active: true}).fetch();
    let today: string = moment().format('YYYY/MM/DD');
    for (let session of activeSessionsForGroup) {
      if (moment(session.creationTimestamp).format('YYYY/MM/DD') < today) {
        this.finishSession(session);
      } else {
        let conflictAlert = this.alertCtrl.create();
        conflictAlert.setCssClass('wide-input');
        conflictAlert.setTitle('Oops! Session Conflict!');
        conflictAlert.setMessage(`Group ${school.idNumber} already has an active session: lesson ${session.lesson}, created on ${this.timeString(session.creationTimestamp)}. If you continue, that session will be marked as finished.`);
        conflictAlert.addButton('Cancel');
        conflictAlert.addButton({
          text: 'Ok',
          handler: () => {
            this.finishSession(session, () => {this.checkForConflictSession(school)});
          }
        });
        conflictAlert.present();
        return;
      }
    }
    this.chooseLesson(school);
  }

  chooseLesson(school ?: School) {
    let lessonAlert = this.alertCtrl.create();
    lessonAlert.setCssClass('wide-input');
    lessonAlert.setTitle('Choose Lesson:');
    availableLessons.forEach((lesson: string) => {
      lessonAlert.addInput({
        type: 'radio',
        label: `Lesson ${lesson}`,
        value: lesson
      });
    });
    lessonAlert.addButton('Cancel');
    lessonAlert.addButton({
      text: 'Ok',
      handler: (lessonNumber: string) => {
        if (school) {
          this.addSession(school, parseInt(lessonNumber));
        } else {
          this.review(parseInt(lessonNumber));
        }
      }
    });
    lessonAlert.present();
  }

  review(lesson: number) {
    this.navCtrl.push(TeacherSessionPage, {reviewLesson: lesson});
  }

  timeString(epoch: number) {
    if (!epoch) {
      return null;
    }
    return moment(epoch).format('YYYY/MM/DD[ at ]h:mm a');
  }

  about(): void {
    // go to About page
    //this.navCtrl.push(LoginPage, {});
  }

  videos(): void {
    this.navCtrl.push(VideosPage, {});
  }
}
