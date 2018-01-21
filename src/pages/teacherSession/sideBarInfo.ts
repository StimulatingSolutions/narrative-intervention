import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';

import { Session } from 'api/models';

import * as _ from 'lodash';
import {ErrorAlert} from "../../services/errorAlert";


@Component({
  selector: 'sideBarInfo',
  templateUrl: 'sideBarInfo.html'
})
export class SideBarInfo implements OnInit {

  @Input() session: Session;

  @Output() onFindPlace =  new EventEmitter<void>();

  waitCount: number;
  idsWithAnswer: number[];
  currentResponses: {};
  headTeacher: boolean;

  constructor(
    private errorAlert: ErrorAlert,
    public navCtrl: NavController,
  ) {
    this.waitCount = 0;
    this.idsWithAnswer = [];
    this.currentResponses = {};
  }

  ngOnInit() {
    this.headTeacher = (Meteor.userId() == this.session.creatersId);
  }

  ngDoCheck () {
    //QUESTION CLOSED IN SIDEBAR

    const stepResponses = this.session.responses.filter( response => {
      return response.step === this.session.questionStepId;
    });

    const newResponses = {};
    stepResponses.forEach( response => {
      if (!newResponses.hasOwnProperty(response.studentId)){
        newResponses[response.studentId] = {
          response: response.response,
          date: response.date
        }
      }
      if (response.date > newResponses[response.studentId].date){
        newResponses[response.studentId] = response;
      }
    });
    this.currentResponses = newResponses;
    const ids = stepResponses.map( response => {
      return response.studentId;
    });
    this.idsWithAnswer = _.uniq(ids);
    this.waitCount = this.session.activeUsers.length - _.uniq(ids).length;
  }

  findMyPlace (): void {
    this.onFindPlace.emit();
  }

  closeQuestion (): void {
    Meteor.call('finishQuestion', this.session._id, (error, result) => {
      if (error){
        this.errorAlert.present(error, 22);
        return;
      }
    });
  }

  exitCurrentSession (): void {
    this.navCtrl.pop();
  }
}
