import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UserManagementPage } from '../usermanagement/usermanagement';

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  viewUserManagement(): void {
    this.navCtrl.push(UserManagementPage, {});
  }

}
