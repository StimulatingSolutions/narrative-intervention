import {Component, OnInit} from '@angular/core';
//import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";

import {Sessions} from "api/collections";
import {Session} from "api/models";
import moment = require("moment");
import FileSaver = require('file-saver');

@Component({
  selector: 'dataManagement',
  templateUrl: 'dataManagement.html'
})
export class DataManagementPage extends DestructionAwareComponent implements OnInit {

  allSessions;
  checkboxes: { [k: string]: boolean } = {};
  isAdmin: boolean;

  constructor(
    private errorAlert: ErrorAlert,
    private alertCtrl: AlertController,
    //private ref: ChangeDetectorRef,
  ) {
    super();
    this.isAdmin = false;
    MeteorObservable.call<string[]>('getUserRoles')
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result: string[]) => {
        this.isAdmin = result.indexOf('admin') !== -1;
      },
      error: this.errorAlert.presenter(7)
    });
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('users')
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {
        this.allSessions = Sessions.find({}, { sort: {creationTimestamp: 1 } });
      });
    });
  }

  toggleCheckbox(sessionId: string) {
    this.checkboxes[sessionId] = !this.checkboxes[sessionId];
  }

  selectComplete() {
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1 } }).fetch();
    for (let session of sessions) {
      this.checkboxes[session._id] = (!session.active && !session.lastDownload);
    }
  }

  selectDownloaded() {
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1 } }).fetch();
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
    let incompleteCount = 0;
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      if (this.checkboxes[session._id]) {
        ids.push(session._id);
        if (session.active) {
          incompleteCount++;
        }
      }
    }
    let finish = () => {
      Meteor.call('download', ids, (error, result) => {
        if (error){
          this.errorAlert.present(error, 31);
          return;
        }
        let blob = new Blob([result], {type: "text/csv;charset=utf-8"});
        FileSaver.saveAs(blob, `NS-data-download__${moment().format('YYYY-MM-DD_HH-mm')}.csv`);
      })
    };
    if (incompleteCount) {
      let sessionAlert = this.alertCtrl.create();
      sessionAlert.setCssClass('wide-input');
      sessionAlert.setTitle('Warning!');
      let subtitle: string = `You are about to download data for ${incompleteCount} session${incompleteCount > 1 ? 's' : ''} that ${incompleteCount > 1 ? 'are' : 'is'} not marked as finished!`;
      sessionAlert.setSubTitle(subtitle);
      sessionAlert.setMessage('This could result in analyzing incomplete data, or redundant data if you download it again later. Are you sure?');
      sessionAlert.addButton('Cancel');
      sessionAlert.addButton({
        text: 'Ok',
        handler: finish
      });
      sessionAlert.present();
    } else {
      finish();
    }
  }

  clear() {
    let ids: string[] = [];
    let noDownloadCount = 0;
    let incompleteCount = 0;
    let sessions: Session[] = Sessions.find({}, { sort: {creationTimestamp: 1, } }).fetch();
    for (let session of sessions) {
      if (this.checkboxes[session._id]) {
        ids.push(session._id);
        if (!session.lastDownload) {
          noDownloadCount++;
        }
        if (session.active) {
          incompleteCount++;
        }
      }
    }
    let sessionAlert = this.alertCtrl.create();
    sessionAlert.setCssClass('wide-input');
    if (!ids.length) {
      sessionAlert.setTitle('Oops!');
      let subtitle: string = `No available sessions are selected; please select the sessions you want to delete.`;
      sessionAlert.setSubTitle(subtitle);
      sessionAlert.addButton('Cancel');
    } else if (incompleteCount) {
      sessionAlert.setTitle('Oops!');
      let subtitle: string = `You have selected ${incompleteCount} session${incompleteCount > 1 ? 's' : ''} that ${incompleteCount > 1 ? 'are' : 'is'} not marked finished; if you want to delete this session, you must mark it as finished first.`;
      sessionAlert.setSubTitle(subtitle);
      sessionAlert.addButton('Cancel');
    } else {
      sessionAlert.setTitle('Warning!');
      let subtitle: string = `You are about to delete data for ${ids.length} session${ids.length > 1 ? 's' : ''}`;
      if (noDownloadCount) {
        subtitle += `, and ${noDownloadCount} of them ${noDownloadCount === 1 ? 'has' : 'have'} never been downloaded`;
      }
      subtitle += '!';
      sessionAlert.setSubTitle(subtitle);
      sessionAlert.setMessage('Once you delete session data, it is gone for good, and cannot be recovered. Are you sure?');
      sessionAlert.addButton('Cancel');
      sessionAlert.addButton({
        text: 'Ok',
        handler: () => {
          Meteor.call('clear', ids, (error, result) => {
            if (error){
              this.errorAlert.present(error, 32);
              return;
            }
          })
        }
      });
    }
    sessionAlert.present();
  }

  dayString(epoch: number) {
    if (!epoch) {
      return null;
    }
    return moment(epoch).format('YYYY/MM/DD');
  }

  timeString(epoch: number) {
    if (!epoch) {
      return null;
    }
    return moment(epoch).format('h:mm a');
  }

}
