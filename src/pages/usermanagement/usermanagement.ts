import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Users } from 'api/collections';
import { User } from 'api/models';

import * as _ from 'lodash';

@Component({
  selector: 'usermanagement',
  templateUrl: 'usermanagement.html'
})
export class UserManagementPage implements OnInit {

  private accountTypeRoles = ['admin', 'researcher', 'teacher'];
  private accountActiveRoles = ['active', 'deactive'];

  addUserVisible: boolean;
  addUserName: string;
  addUserEmail: string;
  addUserAccountType: string = 'teacher';

  editUserVisible: boolean;
  editUserName: string;
  editUserAccountActive: string;
  editUserAccountType: string;
  editUserEmail: string;
  userToEdit: User;

  allUsers;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
    private ref: ChangeDetectorRef,
  ) {
    this.addUserVisible = false;
    this.editUserVisible = false;
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('users').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allUsers = this.findUsers();
      });
    });
  }

  findUsers(): Observable<User[]> {
    return Users.find({ 'profile.email': { $exists: true }});
  }

  showAddUser(visible: boolean): void {
    this.addUserVisible = visible;
    this.ref.detectChanges();
  }

  addUser(): void {

    //CHECK EMPTYS
    const validEmail = this.addUserEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(this.addUserEmail === '' || !validEmail){
      this.handleError(new Error("Valid Email and password required."), 30);
      return
    }

    MeteorObservable.call('createNewUser', this.addUserEmail, this.addUserName, this.addUserAccountType).subscribe({
      next: (result) => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "User: " + this.addUserEmail + ' has been added.',
          buttons: ['OK']
        });
        alert.present();

        this.addUserEmail = '';
        this.addUserAccountType = 'teacher';
      },
      error: (e: Error) => {
        this.handleError(e, 23);
      }
    });

    this.addUserVisible = false;
  }

  resetUserPassword(): void {
    console.log('USER!: ', this.userToEdit);

    MeteorObservable.call('sendResetUserPasswordEmailFromId', this.userToEdit._id).subscribe({
      next: (result) => {
        const alert = this.alertCtrl.create({
          title: 'Password Reset Sent',
          message: "Password Reset instructions have been sent to " + this.userToEdit.profile.email + '.',
          buttons: ['OK']
        });
        alert.present();
      },
      error: (e: Error) => {
        this.handleError(e, 24);
      }
    });
  }

  selectUserToEdit(user): void {
    console.log('selected user: ', user);
    this.userToEdit = user;
    this.editUserName = user.profile.name;
    this.editUserEmail = user.profile.email;
    this.editUserAccountType = null;
    this.editUserAccountActive = null;

    MeteorObservable.call<string[]>('getUserRoles', user._id).subscribe({
      next: (result: string[]) => {
        this.accountTypeRoles.forEach( accountTypeRole => {
          if (_.includes(result, accountTypeRole)){
            this.editUserAccountType = accountTypeRole;
          }
        });
        this.accountActiveRoles.forEach( accountActiveRole => {
          if (_.includes(result, accountActiveRole)){
            this.editUserAccountActive = accountActiveRole;
          }
        })
      },
      error: (e: Error) => {
        this.handleError(e, 25);
      }
    });



    this.editUserVisible = true;
  }

  hideUserEdit(): void {
    this.editUserVisible = false;
  }

  updateUser(user): void {

    const profile = {
      name: this.editUserName,
      email: this.userToEdit.profile.email,
      picture: ''
    };

    const accountRoles = [this.editUserAccountActive, this.editUserAccountType];

    MeteorObservable.call('updateUser', this.userToEdit, profile, accountRoles).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "User: " + this.editUserEmail + ' has been updated.',
          buttons: ['OK']
        });
        alert.present();

        this.editUserVisible = false;
        this.editUserEmail = '';
        this.editUserName = '';
        this.editUserAccountActive = '';
        this.editUserAccountType = '';
      },
      error: (e: Error) => {
        this.handleError(e, 26);
      }
    });
  }

  removeUser(): void {

  }

  handleError(e: Error, id: number): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: `Oops! (#${ id })`,
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.addUser();
    }
  }

}
