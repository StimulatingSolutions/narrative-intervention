import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';

import { LoginPage } from '../login/login';

import * as _ from 'lodash';
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
@Component({
  selector: 'studentSession',
  templateUrl: 'studentSession.html'
})
export class StudentSessionPage extends DestructionAwareComponent implements OnInit {

  studentSessionId: string;
  userId: string;
  session: Session;
  selectedCard: string = null;
  questionType: string = null;
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
    this.userId = this.navParams.get('userId');

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

      const session = Sessions.findOne({_id: this.studentSessionId});
      if (session.readyForResponse) {
        // IF STARTING UP IN RESPONSE MODE SET SELECTED CARD
        const thisStepsResponses = session.responses.filter( response => {
          return response.step === session.questionStepId && response.studentId === this.userId;
        });
        const latestResponse = _.maxBy(thisStepsResponses, (o) => {
          return o.date;
        });
        if (latestResponse){
          this.selectedCard = latestResponse.response;
        }
      }
    });
  }

  updateSessionChanges (oldSession: Session, newSession: Session): void {
    if (oldSession === undefined || newSession === undefined){
      return;
    }

    if(!oldSession.readyForResponse && newSession.readyForResponse){
      const thisStepsResponses = newSession.responses.filter( response => {
        return response.step === newSession.questionStepId && response.studentId === this.userId;
      });
      const latestResponse = _.maxBy(thisStepsResponses, (o) => {
        return o.date;
      });
      if (latestResponse){
        this.selectedCard = latestResponse.response;
      }

    }

    if (!newSession.readyForResponse){
      this.selectedCard = null;
    }
    this.questionType = newSession.questionType;
  }

  ngOnDestroy(): void {
    Meteor.call('leaveSession', this.studentSessionId, this.userId, (error, result) => {
      if (error && error.reason != "Session does not exist"){
        this.handleError(error, 19);
        return;
      }
    })
  }

  selectCard(cardName: string): void {
    this.selectedCard = cardName;
    if (this.session && this.session.readyForResponse) {
      this.selectedCard = cardName;
      const date = new Date();
      Meteor.call('sendQuestionResponse', this.session._id, this.userId, this.selectedCard, date, (error, result) => {
        if (error){
          this.handleError(error, 20);
          return;
        }
      })
    } else {
      this.selectedCard = null;
    }

    this.ref.detectChanges();
  }

  handleError(e: Error, id: number): void {
    console.error(e);
    //  don't show an alert on the student tablets, too confusing for them
  }

}
