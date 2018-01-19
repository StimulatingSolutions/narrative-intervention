import {Component, OnInit} from '@angular/core';
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
export class LoginPage implements OnInit {
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
  ) {
  }

  ngOnInit():void {
    document.addEventListener("deviceready", () => {
      if (typeof(KioskPlugin) != "undefined") {
        KioskPlugin.setAllowedKeys([ 24, 25, 26, 4 ]);
      }
    }, false);
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
      this.events.push(`TEST MODE ON: ${window.screen.width}x${window.screen.height}`);
      console.log(this.events[this.events.length-1]);
      document.addEventListener("deviceready", () => { this.events.push("deviceready"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("pause", () => { this.events.push("pause"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("resume", () => { this.events.push("resume"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("backbutton", () => { this.events.push("backbutton"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("menubutton", () => { this.events.push("menubutton"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("searchbutton", () => { this.events.push("searchbutton"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("volumedownbutton", () => { this.events.push("volumedownbutton"); console.log(this.events[this.events.length-1]) }, false);
      document.addEventListener("volumeupbutton", () => { this.events.push("volumeupbutton"); console.log(this.events[this.events.length-1]) }, false);
    } else if (this.counter == 6 && typeof(KioskPlugin) != "undefined") {
      KioskPlugin.isInKiosk((isInKiosk) => {
        this.events.push("KIOSK MODE: "+isInKiosk);
        console.log(this.events[this.events.length-1]);
        if (isInKiosk) {
          console.log("EXITING!!!");
          KioskPlugin.exitKiosk();
        }
      });
    }
    // go to info page
    //this.navCtrl.push(LoginPage, {});
  }
}
