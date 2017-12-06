import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor'
import { LandingPage } from '../../pages/landing/landing';

import { UserManagementPage } from '../usermanagement/usermanagement';
import { SchoolManagementPage } from '../schools/schoolmanagement';

import * as _ from 'lodash';

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  public roles: string[];
  public showUserManagement: boolean;
  public showSchoolManagement: boolean;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
  ) {
    this.roles = [];
    this.showUserManagement = false;
    this.showSchoolManagement = false;

    MeteorObservable.call<string[]>('getUserRoles').subscribe({
      next: (result: string[]) => {
        this.roles = result;
        this.showUserManagement = !!_.intersection(result, ['admin', 'researcher']).length;
        this.showSchoolManagement = !!_.intersection(result, ['admin', 'researcher', 'manager']).length;
        console.log('tools', this.showUserManagement, this.showSchoolManagement)
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  ngOnInit() {}

  viewUserManagement(): void {
    this.navCtrl.push(UserManagementPage, {});
  }

  viewSchoolManagement(): void {
    this.navCtrl.push(SchoolManagementPage, {});
  }

  logout(): void {
    Meteor.logout( () => {
      this.navCtrl.setRoot(LandingPage, {}, {
        animate: true
      });
    });
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

}
