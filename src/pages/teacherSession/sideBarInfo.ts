import { Component, Input, Output, EventEmitter} from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
//import { Observable } from 'rxjs';

import { Session } from 'api/models';

import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'sideBarInfo',
  templateUrl: 'sideBarInfo.html'
})
export class SideBarInfo {

  @Input() session: Session;

  @Output() onFindPlace =  new EventEmitter<void>();

  waitCount: number;
  currentStep: number;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    public navCtrl: NavController,
  ) {
    this.waitCount = 0;
  }

  ngDoCheck () {
    //QUESTION CLOSED IN SIDEBAR
    if (this.session.readyForResponse){

      const stepResponses = this.session.responses.filter( response => {
        return response.step === this.session.questionStepId;
      });
      const ids = stepResponses.map( response => {
        return response.studentId;
      });
      this.waitCount = this.session.activeUsers.length - _.uniq(ids).length;
    }
    this.currentStep = ((_.max(this.session.completedSteps) || 0) + 1);
  }

  findMyPlace (): void {
    this.onFindPlace.emit();
  }

  toggleSessionActive(active: boolean): void {
    MeteorObservable.call('setSessionActive', this.session._id, active).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "Session: " + this.session + ' has been ' + (active ? 'activated.' : 'deactivated'),
          buttons: ['OK']
        });
        alert.present();
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  closeQuestion (): void {
    Meteor.call('updateSessionReadyForResponse', this.session._id, false, -1, (error, result) => {
      if (error){
        this.handleError(error);
        return;
      }
    });
  }

  exitCurrentSession (): void {
    this.navCtrl.pop();
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

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.addSession();
    }
  }

}
