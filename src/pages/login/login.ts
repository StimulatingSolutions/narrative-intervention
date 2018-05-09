import {Component} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { EmailService } from '../../services/email';
import { WelcomePage } from '../landing/welcome';
import { MeteorObservable } from 'meteor-rxjs';

import { StudentSessionPage } from '../studentSession/studentSession';
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";


@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage extends DestructionAwareComponent {
  private loginEmail = '';
  private loginPassword = '';
  private sessionGroupNumber = '';
  private sessionStudentNumber = '';
  private device;

  constructor(
    private alertCtrl: AlertController,
    private errorAlert: ErrorAlert,
    private emailService: EmailService,
    private navCtrl: NavController
  ) {
    super();
    let dims = ''+window.screen.width+'x'+window.screen.height;
    if (dims === '1024x600') {
      this.device = 'student';
    } else if (dims === '800x1280') {
      this.device = 'teacher';
    } else {
      this.device = 'web';
    }
    console.log(`=========== ${this.device} device detected`);
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

  joinSession(): void {
    if (this.sessionGroupNumber === '' || this.sessionStudentNumber === ''){
      const alert = this.alertCtrl.create({
        title: 'Oops!',
        message: `${this.sessionGroupNumber === '' ? 'Group Number' : 'Student Number'} is required`,
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    let groupNumber = parseInt(this.sessionGroupNumber).toString();
    let studentNumber = parseInt(this.sessionStudentNumber).toString();
    let userId: string = `${groupNumber}-${studentNumber}`;

    Meteor.call('joinSession', userId, (error, result) => {
      if (error){
        this.errorAlert.present(error, 11);
        return;
      }
      return this.navCtrl.push(StudentSessionPage, {
        sessionId: result,
        userId: userId
      });
    })
  }

  info(): void {
    // go to info page
    //this.navCtrl.push(LoginPage, {});
  }

}
