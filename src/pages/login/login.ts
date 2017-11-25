import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { EmailService } from '../../services/email';
import { WelcomePage } from '../landing/welcome';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginEmail = '';
  private loginPassword = '';

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
