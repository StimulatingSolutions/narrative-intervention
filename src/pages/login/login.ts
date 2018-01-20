import {Component} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { EmailService } from '../../services/email';
import { WelcomePage } from '../landing/welcome';
import { MeteorObservable } from 'meteor-rxjs';

import { StudentSessionPage } from '../studentSession/studentSession';


@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginEmail = '';
  private loginPassword = '';
  private loginSession = '';
  private sessionUserId = '';
  private device;

  constructor(
    private alertCtrl: AlertController,
    private emailService: EmailService,
    private navCtrl: NavController
  ) {
    if (window.location.search.length > 1) {
      this.device = window.location.search.substring(1);
      return;
    }
    let dims = ''+window.screen.width+'x'+window.screen.height;
    if (dims === '1024x600') {
      this.device = 'student';
    } else if (dims === '800x1280') {
      this.device = 'teacher';
    } else {
      this.device = 'web';
    }
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
    }).catch((e) => {
      this.handleError(e, 9);
    })
  }

  resetUserPassword(): void {
    MeteorObservable.call('sendResetUserPasswordEmail', this.loginEmail.trim()).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Password Reset!',
          message: "Password Reset instructions have been sent to " + this.loginEmail.trim() + '.',
          buttons: ['OK']
        });
        return alert.present();
      },
      error: (e: Error) => {
        this.handleError(e, 10);
      }
    });
  }

  joinSession(): void {
    if (this.sessionUserId === ''){
      const alert = this.alertCtrl.create({
        title: 'Join Session',
        message: 'User Id is required.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    Meteor.call('findSessionByShortId', this.loginSession, this.sessionUserId, (error, result) => {
      if (error){
        this.handleError(error, 11);
        return;
      }
      return this.navCtrl.push(StudentSessionPage, {
        sessionId: result,
        userId: this.sessionUserId
      });
    })
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

  info(): void {
    // go to info page
    //this.navCtrl.push(LoginPage, {});
  }

}
