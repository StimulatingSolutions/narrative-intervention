import {Component, OnInit} from '@angular/core';
//import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
//import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";

import {Sessions} from "api/collections";
import {Session} from "api/models";

@Component({
  selector: 'dataManagement',
  templateUrl: 'dataManagement.html'
})
export class DataManagementPage extends DestructionAwareComponent implements OnInit {

  allSessions;
  checkboxes: { [k: string]: boolean } = {};

  constructor(
    private errorAlert: ErrorAlert,
    //private alertCtrl: AlertController,
    //private ref: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('users')
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {
        this.allSessions = Sessions.find({}, { sort: {creationTimestamp: 1, } });
      });
    });
  }

  toggleCheckbox(sessionId: string) {
    this.checkboxes[sessionId] = !this.checkboxes[sessionId];
  }

  selectComplete() {
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      this.checkboxes[session._id] = (!session.active && !session.lastDownload);
    }
  }

  selectDownloaded() {
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      this.checkboxes[session._id] = !!session.lastDownload;
    }
  }

  selectAll() {
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      this.checkboxes[session._id] = true;
    }
  }

  selectNone() {
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      this.checkboxes[session._id] = false;
    }
  }

  download() {
    let ids: string[] = [];
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      if (this.checkboxes[session._id]) {
        ids.push(session._id);
      }
    }
    Meteor.call('download', ids, (error, result) => {
      if (error){
        this.errorAlert.present(error, 31);
        return;
      }
    })
  }

  clear() {
    let ids: string[] = [];
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      if (this.checkboxes[session._id]) {
        ids.push(session._id);
      }
    }
    Meteor.call('clear', ids, (error, result) => {
      if (error){
        this.errorAlert.present(error, 32);
        return;
      }
    })
  }

}
