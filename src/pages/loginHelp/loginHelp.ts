
import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

@Component({
  selector: 'login-help',
  templateUrl: 'loginHelp.html'
})
export class LoginHelpPage {

  constructor(
    private navCtrl: NavController
  ) { }

  dismiss() {
    this.navCtrl.pop();
  }
}
