import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';

import { Schools } from 'api/collections';
import { School } from 'api/models';
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";

//import * as _ from 'lodash';

@Component({
  selector: 'schoolmanagement',
  templateUrl: 'schoolmanagement.html'
})
export class SchoolManagementPage extends DestructionAwareComponent implements OnInit {

  addSchoolVisible: boolean;
  addSchoolName: string;

  editSchoolVisible: boolean;
  editSchoolName: string;
  schoolToEdit: School;

  allSchools: Observable<School[]>;

  constructor(
    private errorAlert: ErrorAlert,
    private alertCtrl: AlertController,
    private ref: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    MeteorObservable.subscribe('schools')
    .takeUntil(this.componentDestroyed$)
    .subscribe(() => {
      MeteorObservable.autorun()
      .takeUntil(this.componentDestroyed$)
      .subscribe(() => {
        this.allSchools = this.findSchools();
      });
    });
  }

  findSchools(): Observable<School[]> {
    Schools.find({}).forEach( school => {
      console.log('school! ', school);
    });
    return Schools.find({});
  }

  addSchool(): void {

    //CHECK EMPTYS
    if(this.addSchoolName === ''){
      this.errorAlert.present(new Error("Valid School Name is required."), 28);
      return
    }

    const newSchool = {
      name: this.addSchoolName
    };
    MeteorObservable.call('createNewSchool', newSchool)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
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
      error: this.errorAlert.presenter(13)
    });

    //this.addSchoolVisible = false;
  }

  selectSchoolToEdit(school): void {
    console.log('selected school: ', school);
    this.schoolToEdit = school;
    this.editSchoolName = school.name;
    this.editSchoolVisible = true;
  }

  hideSchoolEdit(): void {
    this.editSchoolVisible = false;
  }

  updateSchool(school): void {

    let updates = {
      name: this.editSchoolName
    };
    MeteorObservable.call('updateSchool', this.schoolToEdit, updates)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
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
      error: this.errorAlert.presenter(14)
    });
  }

  showAddSchool(visible: boolean): void {
    this.addSchoolVisible = visible;
    this.ref.detectChanges();
  }
}
