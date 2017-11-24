import { Component, OnInit } from '@angular/core';
//import { NavController } from 'ionic-angular';

@Component({
  selector: 'usermanagement',
  templateUrl: 'usermanagement.html'
})
export class UserManagementPage implements OnInit {

  addUserVisible: boolean;

  constructor(
    //private navCtrl: NavController
  ) {
    this.addUserVisible = false;
  }

  ngOnInit(): void {
  }

  showAddUser(visible: boolean): void {
    this.addUserVisible = visible;
  }

  addUser(): void {
    this.addUserVisible = false;
  }

  removeUser(): void {

  }

}
