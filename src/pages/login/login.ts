import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { EmailService } from '../../services/email';
import { WelcomePage } from '../landing/welcome';
import { MeteorObservable } from 'meteor-rxjs';

import { StudentSessionPage } from '../studentSession/studentSession';

declare var KioskPlugin: any;


@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginEmail = '';
  private loginPassword = '';
  private loginSession = '';
  private sessionUserId = '';
  private events = [];
  private counter = 0;

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
    this.counter++;
    if (this.counter == 3) {
      this.events.push("TEST MODE ON");
      document.addEventListener("deviceready", () => { this.events.push("deviceready") }, false);
      document.addEventListener("pause", () => { this.events.push("pause") }, false);
      document.addEventListener("resume", () => { this.events.push("resume") }, false);
      document.addEventListener("backbutton", () => { this.events.push("backbutton") }, false);
      document.addEventListener("menubutton", () => { this.events.push("menubutton") }, false);
      document.addEventListener("searchbutton", () => { this.events.push("searchbutton") }, false);
      document.addEventListener("volumedownbutton", () => { this.events.push("volumedownbutton") }, false);
      document.addEventListener("volumeupbutton", () => { this.events.push("volumeupbutton") }, false);
    } else if (this.counter == 6) {
      KioskPlugin.isInKiosk((isInKiosk) => {
        this.events.push("KIOSK MODE: "+isInKiosk);
        if (isInKiosk) {
          KioskPlugin.exitKiosk();
        }
      });
    }
    // go to info page
    //this.navCtrl.push(LoginPage, {});
  }
}
