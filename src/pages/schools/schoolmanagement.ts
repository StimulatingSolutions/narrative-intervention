import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MeteorObservable} from 'meteor-rxjs';

import { Schools } from 'api/collections';
import { School } from 'api/models';
import {ErrorAlert} from "../../services/errorAlert";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'schoolmanagement',
  templateUrl: 'schoolmanagement.html'
})
export class SchoolManagementPage extends DestructionAwareComponent implements OnInit {

  addSchoolVisible: boolean;
  addSchoolName: string;
  addSchoolNumber: number;
  addSchoolCohort: number;

  editSchoolVisible: boolean;
  editSchoolName: string;
  editSchoolNumber: number;
  editSchoolCohort: number;
  schoolToEdit: School;

  allSchools;

  constructor(
    private errorAlert: ErrorAlert,
    private ref: ChangeDetectorRef,
    private alertCtrl: AlertController
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
        this.allSchools = Schools.find({});
      });
    });
  }

  addSchool(retry: boolean = false): void {

    //CHECK EMPTYS
    if(!this.addSchoolName || !this.addSchoolNumber || !this.addSchoolCohort){
      if (!retry) {
        this.ref.detectChanges();
        setTimeout(()=>{
          this.addSchool(true);
        }, 0);
      } else {
        this.errorAlert.present(new Error("Group Number, School Name, and Cohort are required."), 28);
      }
      return;
    }

    const newSchool = {
      name: this.addSchoolName,
      idNumber: this.addSchoolNumber,
      cohort: this.addSchoolCohort
    };
    MeteorObservable.call('createNewSchool', newSchool)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result) => {
        this.addSchoolVisible = false;
        this.addSchoolName = null;
        this.addSchoolNumber = null;
        this.addSchoolCohort = null;
      },
      error: this.errorAlert.presenter(13)
    });
  }

  selectSchoolToEdit(school): void {
    this.schoolToEdit = school;
    this.editSchoolName = school.name;
    this.editSchoolNumber = school.idNumber;
    this.editSchoolVisible = true;
    this.editSchoolCohort = school.cohort;
  }

  hideSchoolEdit(): void {
    this.editSchoolVisible = false;
  }

  updateSchool(retry: boolean = false): void {

    //CHECK EMPTYS
    if (!this.editSchoolName || !this.editSchoolNumber || !this.editSchoolCohort) {
      if (!retry) {
        this.ref.detectChanges();
        setTimeout(()=>{
          this.updateSchool(true);
        }, 0);
      } else {
        this.errorAlert.present(new Error("Group Number, School Name, and Cohort are required."), 14);
      }
      return;
    }

    let updates = {
      name: this.editSchoolName,
      idNumber: this.editSchoolNumber,
      cohort: this.editSchoolCohort
    };
    MeteorObservable.call('updateSchool', this.schoolToEdit._id, updates)
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: () => {
        this.editSchoolVisible = false;
        this.editSchoolName = null;
        this.editSchoolNumber = null;
        this.editSchoolCohort = null;
      },
      error: this.errorAlert.presenter(14)
    });
  }

  showAddSchool(visible: boolean): void {
    this.addSchoolVisible = visible;
    this.ref.detectChanges();
  }

  deleteSchool(): void {
    let content:any = {
      title: "Are you sure?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: `Delete Group ${this.schoolToEdit.idNumber} at ${this.schoolToEdit.name}`,
          handler: () => {
            MeteorObservable.call('deleteSchool', this.schoolToEdit._id)
            .takeUntil(this.componentDestroyed$)
            .subscribe({
              next: () => {
                this.editSchoolVisible = false;
                this.editSchoolName = null;
                this.editSchoolNumber = null;
                this.editSchoolCohort = null;
              },
              error: this.errorAlert.presenter(114)
            });
          }
        }
      ],
      cssClass: 'error-alert',
      message: `You are about to delete Group ${this.schoolToEdit.idNumber} at ${this.schoolToEdit.name} (Cohort ${this.schoolToEdit.cohort})!`
    };
    const alert = this.alertCtrl.create(content);
    alert.present();
  }
}
