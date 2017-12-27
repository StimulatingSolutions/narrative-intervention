import { Component } from '@angular/core';
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

  constructor(
    private alertCtrl: AlertController,
    private emailService: EmailService,
    private navCtrl: NavController
  ) {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.login();
    }
  }

  login(): void {
    this.emailService.login(this.loginEmail, this.loginPassword).then(() => {
      this.navCtrl.setRoot(WelcomePage, {}, {
        animate: true
      });
    }).catch((e) => {
      this.handleError(e);
    })
  }

  resetUserPassword(): void {
    MeteorObservable.call('sendRestUserPasswordEmail', this.loginEmail).subscribe({
      next: (result) => {
        const alert = this.alertCtrl.create({
          title: 'Password Reset!',
          message: "Password Rest instrutions have been sent to " + this.loginEmail + '.',
          buttons: ['OK']
        });
        alert.present();
      },
      error: (e: Error) => {
        this.handleError(e);
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
        this.handleError(error);
        return;
      }
      this.navCtrl.push(StudentSessionPage, {
        sessionId: result,
        userId: this.sessionUserId
      });
    })
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
}
