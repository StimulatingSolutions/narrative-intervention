import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import {DeviceDetector} from "../../util/deviceDetector";
import {preloadImage} from "../../util/preloadImage";
import {StudentLoginPage} from "../studentLogin/studentLogin";

@Component({
  selector: 'studentSession',
  templateUrl: 'studentSession.html'
})
export class StudentSessionPage extends DestructionAwareComponent implements OnInit {

  studentSessionId: string;
  studentNumber: number;
  demo: boolean;
  session: Session;
  demoResponse: string;

  constructor(
    private navParams: NavParams,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
  ) {
    super();
    preloadImage('try', 1104, 1104, 500);
    preloadImage('goal', 1104, 1104, 500);
    preloadImage('outcome-fail', 1104, 1104, 500);
    preloadImage('outcome-yes', 1104, 1104, 500);
  }

  ngOnInit(): void {
    this.studentSessionId = this.navParams.get('sessionId');
    this.studentNumber = this.navParams.get('studentNumber');
    this.demo = !!this.navParams.get('demo');

    MeteorObservable.subscribe('activeSession', this.studentSessionId)
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {

        const updatedSession = Sessions.findOne({_id: this.studentSessionId});
        this.session = updatedSession;

        this.ref.detectChanges();
        if (!this.session.active){
          this.navCtrl.setRoot(StudentLoginPage, {}, {
            animate: true
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    Meteor.call('leaveSession', this.studentSessionId, this.studentNumber, (error, result) => {
      if (error && error.reason != "Session does not exist"){
        this.handleError(error, 19);
        return;
      }
    })
  }

  selectCard(type: string, cardName: string): void {
    if (type === 'click' && DeviceDetector.device != 'web' || type === 'touch' && DeviceDetector.device === 'web') {
      return;
    }

    if (this.demo) {
      this.demoResponse = cardName;
      this.ref.detectChanges();
      return;
    }

    if (this.session && this.session.readyForResponse && this.session.responses[this.studentNumber] != cardName) {
      Meteor.call('sendQuestionResponse', this.session._id, this.studentNumber, cardName, (error, result) => {
        if (error){
          this.handleError(error, 20);
          return;
        }
        this.ref.detectChanges();
      });
    }
    this.ref.detectChanges();
  }

  resetDemoResponse(): void {
    this.demoResponse = null;
    this.ref.detectChanges();
  }

  exitDemo(): void {
    this.navCtrl.setRoot(StudentLoginPage, {}, {
      animate: true
    });
  }

  handleError(e: Error, id: number): void {
    console.error(e);
    //  don't show an alert on the student tablets, too confusing for them
  }

}
