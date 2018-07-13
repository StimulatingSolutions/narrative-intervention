import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';

import { Session } from 'api/models';

import {ErrorAlert} from "../../services/errorAlert";


@Component({
  selector: 'sideBarInfo',
  templateUrl: 'sideBarInfo.html'
})
export class SideBarInfo implements OnInit {

  @Input() session: Session;

  @Output() onFindPlace =  new EventEmitter<void>();

  waitCount: number;
  incorrectCount: number;
  idsWithAnswer: number[];
  headTeacher: boolean;
  activeStudentsKey: string = '';
  activeStudentsSorted: number[] = [];

  constructor(
    private errorAlert: ErrorAlert,
    public navCtrl: NavController,
  ) {
    this.waitCount = 0;
    this.incorrectCount = 0;
    this.idsWithAnswer = [];
  }

  ngOnInit() {
    this.headTeacher = (Meteor.userId() == this.session.creatorsId);
  }

  ngDoCheck () {
    //QUESTION CLOSED IN SIDEBAR

    this.idsWithAnswer = <any[]>Object.keys(this.session.responses);
    this.waitCount = this.session.activeStudents.length - this.idsWithAnswer.length;
    if (this.session.correctAnswer) {
      this.incorrectCount = 0;
      for (let responseId of this.idsWithAnswer) {
        if (this.session.responses[responseId] != this.session.correctAnswer) {
          this.incorrectCount++;
        }
      }
    }
  }

  doReset (): void {
    (<any>window).uncheckQuestion();
    Meteor.call('timerReset', this.session._id, (error, result) => {
      if (error){
        this.errorAlert.present(error, 6);
        return;
      }
    });
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

  getActiveStudents (): number[] {
    let activeStudentsKey: string = JSON.stringify(this.session.activeStudents);
    if (this.session && activeStudentsKey != this.activeStudentsKey) {
      this.activeStudentsSorted = this.session.activeStudents.slice().sort();
      this.activeStudentsKey = activeStudentsKey;
    }
    return this.activeStudentsSorted;
  }

  json (obj): string {
    return JSON.stringify(obj);
  }
}
