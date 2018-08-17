import {Component} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { StudentSessionPage } from '../studentSession/studentSession';
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import {School} from "api/models";
import {Schools} from "api/collections";
import {DeviceDetector} from "../../util/deviceDetector";
import {AboutSoftwarePage} from "../about-software/about-software";


@Component({
  selector: 'studentLogin',
  templateUrl: 'studentLogin.html'
})
export class StudentLoginPage extends DestructionAwareComponent {
  private allSchools;
  public device: string;

  constructor(
    private alertCtrl: AlertController,
    private errorAlert: ErrorAlert,
    private navCtrl: NavController
  ) {
    super();
    this.device = DeviceDetector.device;
  }

  ngOnInit() {
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

  chooseStudent(selectedSchool: School) {
    let studentAlert = this.alertCtrl.create();
    studentAlert.setCssClass('wide-input');
    studentAlert.setTitle('Enter Student Number:');
    studentAlert.addInput({
      type: 'number',
      name: 'studentNumber',
      placeholder: 'Student Number'
    });
    studentAlert.addButton('Cancel');
    studentAlert.addButton({
      text: 'Ok',
      handler: (data) => {
        this.joinSession(selectedSchool, data.studentNumber);
      }
    });
    studentAlert.present();
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
        if (intent === 'join') {
          this.chooseStudent(selectedSchool);
        } else {
          this.startDemo(selectedSchool);
        }
      }
    });
    schoolAlert.present();
  }

  startDemo(selectedSchool: School): void {
    Meteor.call('demoSession', selectedSchool.idNumber, (error, result) => {
      if (error){
        this.errorAlert.present(error, 12);
        return;
      }
      return this.navCtrl.push(StudentSessionPage, {
        sessionId: result,
        demo: true
      });
    })
  }

  joinSession(selectedSchool: School, studentNumber: number): void {
    Meteor.call('joinSession', selectedSchool.idNumber, studentNumber, (error, result) => {
      if (error){
        this.errorAlert.present(error, 11);
        return;
      }
      return this.navCtrl.push(StudentSessionPage, {
        sessionId: result,
        studentNumber: studentNumber
      });
    })
  }

  about(): void {
    this.navCtrl.push(AboutSoftwarePage, {});
  }

}
