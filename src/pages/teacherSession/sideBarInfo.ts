import { Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
//import { Observable } from 'rxjs';

import { Session } from 'api/models';

//import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'sideBarInfo',
  templateUrl: 'sideBarInfo.html'
})
export class SideBarInfo {

  @Input() session: Session;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    public navCtrl: NavController,
  ) {}


  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.addSession();
    }
  }

}
