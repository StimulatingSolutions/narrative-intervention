import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

import { LoginPage } from '../login/login';

import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
@Component({
  selector: 'studentSession',
  templateUrl: 'studentSession.html'
})
export class StudentSessionPage extends DestructionAwareComponent implements OnInit {

  studentSessionId: string;
  studentNumber: number;
  session: Session;
  preloads: any = {};

  constructor(
    private navParams: NavParams,
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
  ) {
    super();
    this.preloadImage('try', 500);
    this.preloadImage('goal', 500);
    this.preloadImage('outcome-fail', 500);
    this.preloadImage('outcome-yes', 500);
  }

  preloadImage(name: string, delay: number) {
    let img: HTMLImageElement = new Image();
    this.preloads[name] = img;
    let timeout = setTimeout(img.onerror, 1000+delay);
    img.onerror = () => {
      img.onerror = null;
      img.onabort = null;
      img.onload = null;
      clearTimeout(timeout);
      setTimeout(this.preloadImage.bind(this, name, Math.min(delay+100, 5000)), delay);
    };
    img.onabort = <(UIError)=>any> img.onerror;
    img.onload = () => {
      if (img.width !== 1104 || img.width !== 1104) {
        img.onerror(null);
      }
    };
    img.src = `/assets/imgs/${name}.png`;
  }

  ngDoCheck(): void {
    //need to know what to display
    console.log('SESSION QUESTION!', this.session);
  }

  ngOnInit(): void {
    this.studentSessionId = this.navParams.get('sessionId');
    this.studentNumber = this.navParams.get('studentNumber');

    MeteorObservable.subscribe('activeSession', this.studentSessionId)
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {

        const updatedSession = Sessions.findOne({_id: this.studentSessionId});
        console.log(updatedSession);
        this.updateSessionChanges(this.session, updatedSession);
        this.session = updatedSession;

        this.ref.detectChanges();
        if (!this.session.active){
          this.navCtrl.setRoot(LoginPage, {}, {
            animate: true
          });
        }
      });
    });
  }

  updateSessionChanges (oldSession: Session, newSession: Session): void {
  }

  ngOnDestroy(): void {
    Meteor.call('leaveSession', this.studentSessionId, this.studentNumber, (error, result) => {
      if (error && error.reason != "Session does not exist"){
        this.handleError(error, 19);
        return;
      }
    })
  }

  selectCard(cardName: string): void {
    if (this.session && this.session.readyForResponse) {
      Meteor.call('sendQuestionResponse', this.session._id, this.studentNumber, cardName, (error, result) => {
        if (error){
          this.handleError(error, 20);
          return;
        }
      })
    }

    this.ref.detectChanges();
  }

  handleError(e: Error, id: number): void {
    console.error(e);
    //  don't show an alert on the student tablets, too confusing for them
  }

}
