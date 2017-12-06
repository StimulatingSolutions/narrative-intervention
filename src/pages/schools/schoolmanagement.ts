import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Schools } from 'api/collections';
import { School } from 'api/models';

//import * as _ from 'lodash';

@Component({
  selector: 'schoolmanagement',
  templateUrl: 'schoolmanagement.html'
})
export class SchoolManagementPage implements OnInit {

  addSchoolVisible: boolean;
  addSchoolName: string;

  editSchoolVisible: boolean;
  editSchoolName: string;
  schoolToEdit: School;

  allSchools: Observable<School[]>;

  constructor(
    //private navCtrl: NavController
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
    MeteorObservable.subscribe('schools').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.allSchools = this.findSchools();
      });
    });
  }

  findSchools(): Observable<School[]> {
    Schools.find({}).forEach( school => {
      console.log('school! ', school);
    })
    return Schools.find({});
  }

  addSchool(): void {

    //CHECK EMPTYS
    if(this.addSchoolName === ''){
      const alert = this.alertCtrl.create({
        title: 'Oops!',
        message: 'Valid School Name isrequired.',
        buttons: ['OK']
      });
      alert.present();
      return
    }

    const newSchool = {
      name: this.addSchoolName
    }
    MeteorObservable.call('createNewSchool', newSchool).subscribe({
      next: (result) => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "School: " + this.addSchoolName,
          buttons: ['OK']
        });
        alert.present();

        this.addSchoolVisible = false;
        this.addSchoolName = '';
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });

    //this.addSchoolVisible = false;
  }

  selectSchoolToEdit(school): void {
    console.log('selected school: ', school)
    this.schoolToEdit = school;
    this.editSchoolName = school.name;
    this.editSchoolVisible = true;
  }

  hideSchoolEdit(): void {
    this.editSchoolVisible = false;
  }

  updateSchool(school): void {

    var updates = {
      name: this.editSchoolName
    }
    MeteorObservable.call('updateSchool', this.schoolToEdit, updates).subscribe({
      next: () => {
        const alert = this.alertCtrl.create({
          title: 'Success!',
          message: "School: " + this.editSchoolName,
          buttons: ['OK']
        });
        alert.present();

        this.editSchoolVisible = false;
        this.editSchoolName = '';
      },
      error: (e: Error) => {
        this.handleError(e);
      }
    });
  }

  showAddSchool(visible: boolean): void {
    this.addSchoolVisible = visible;
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

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      //this.addSchool();
    }
  }

}
