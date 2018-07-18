
import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import * as licenseInfo from "../../licensing/license-info";
import licenseText from "../../licensing/license-text";

@Component({
  selector: 'about-npm',
  templateUrl: 'about-npm.html'
})
export class AboutNpmPage  {

  public licenseInfo: any = licenseInfo;
  public licenseText: any = licenseText;

  constructor(
    private navCtrl: NavController
  ) {
  }

  dismiss() {
    this.navCtrl.pop();
  }
}
