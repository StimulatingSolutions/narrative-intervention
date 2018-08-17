import {Component} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { EmailService } from '../../services/email';
import { WelcomePage } from '../landing/welcome';
import { MeteorObservable } from 'meteor-rxjs';

import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
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
  public device: string;

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

  studentLogin(): void {
    window.location.href = 'https://narrative-intervention.stimulating-solutions.com/student/';
  }

  about(): void {
    this.navCtrl.push(AboutSoftwarePage, {});
  }

  help(): void {
    this.navCtrl.push(LoginHelpPage, {});
  }

}
