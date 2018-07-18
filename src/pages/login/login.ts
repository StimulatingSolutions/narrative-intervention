import {Component} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { EmailService } from '../../services/email';
import { WelcomePage } from '../landing/welcome';
import { MeteorObservable } from 'meteor-rxjs';

import { StudentSessionPage } from '../studentSession/studentSession';
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import {School} from "api/models";
import {Schools} from "api/collections";
import {DeviceDetector} from "../../util/deviceDetector";
import {LoginHelpPage} from "../loginHelp/loginHelp";
import {AboutSoftwarePage} from "../about-software/about-software";


@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage extends DestructionAwareComponent {
  private loginEmail = '';
  private loginPassword = '';
  private allSchools;
  private device: string;

  constructor(
    private alertCtrl: AlertController,
    private errorAlert: ErrorAlert,
    private emailService: EmailService,
    private navCtrl: NavController
  ) {
    super();
    this.device = DeviceDetector.device;
    console.log(`=========== ${this.device} device detected`);
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

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.login();
    }
  }

  login(): void {
    this.emailService.login(this.loginEmail.trim(), this.loginPassword).then(() => {
      return this.navCtrl.setRoot(WelcomePage, {}, {
        animate: true
      });
    }).catch(this.errorAlert.presenter(9));
  }

  resetUserPassword(): void {
    MeteorObservable.call('sendResetUserPasswordEmail', this.loginEmail.trim())
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Password Reset!',
          message: "Password Reset instructions have been sent to " + this.loginEmail.trim() + '.',
          buttons: ['OK']
        });
        return alert.present();
      },
      error: this.errorAlert.presenter(10)
    });
  }

  chooseStudent(selectedSchool: School) {
    let studentAlert = this.alertCtrl.create();
    studentAlert.setCssClass('wide-input');
    studentAlert.setTitle('Choose Group:');
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

  help(): void {
    this.navCtrl.push(LoginHelpPage, {});
  }

}
