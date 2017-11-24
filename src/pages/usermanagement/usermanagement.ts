import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Users } from 'api/collections';
import { User } from 'api/models';

@Component({
  selector: 'usermanagement',
  templateUrl: 'usermanagement.html'
})
export class UserManagementPage implements OnInit {

  addUserVisible: boolean;
  addUserEmail: string;
  addUserPassword: string;

  allUsers;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
  ) {
    this.addUserVisible = false;
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('users').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allUsers = this.findUsers();
      });
    });
  }

  findUsers(): Observable<User[]> {
    Users.find({ 'profile.email': { $exists: true }}).forEach( user => {
      console.log('users has email in profile', user);
    })
    return Users.find({ 'profile.email': { $exists: true }});
  }

  showAddUser(visible: boolean): void {
    this.addUserVisible = visible;
  }

  addUser(): void {

    //CHECK EMPTYS
    const validEmail = this.addUserEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(this.addUserEmail === '' || this.addUserPassword === '' || !validEmail){
      const alert = this.alertCtrl.create({
        title: 'Oops!',
        message: 'Valid Email and password required.',
        buttons: ['OK']
      });
      alert.present();
      return
    }

    MeteorObservable.call('createNewUser', this.addUserEmail, this.addUserPassword).subscribe({
      next: (result) => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "User: " + this.addUserEmail + ' has been added.',
          buttons: ['OK']
        });
        alert.present();

        this.addUserVisible = false;
        this.addUserEmail = '';
        this.addUserPassword = '';
      },
      error: (e: Error) => {
        debugger
        const alert = this.alertCtrl.create({
          title: 'Oops!',
          message: e.message,
          buttons: ['OK']
        });
        alert.present();
      }
    });

    //this.addUserVisible = false;
  }

  removeUser(): void {

  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.addUser();
    }
  }

}
