
import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import * as licenseInfo from "../../licensing/license-info";
import licenseText from "../../licensing/license-text";
import {AboutNpmPage} from "./about-npm";
import {AboutMeteorPage} from "./about-meteor";

@Component({
  selector: 'about-software',
  templateUrl: 'about-software.html'
})
export class AboutSoftwarePage  {

  public licenseInfo: any = licenseInfo;
  public licenseText: any = licenseText;

  constructor(
    private navCtrl: NavController
  ) {
  }

  dismiss() {
    this.navCtrl.pop();
  }

  npmDetails() {
    this.navCtrl.push(AboutNpmPage, {});
  }

  meteorDetails() {
    this.navCtrl.push(AboutMeteorPage, {});
  }
}
