import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MeteorObservable} from 'meteor-rxjs';

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
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ "+JSON.stringify({addSchoolName: this.addSchoolName, addSchoolNumber: this.addSchoolNumber, addSchoolCohort: this.addSchoolCohort}));
      if (!retry) {
        this.ref.detectChanges();
        setTimeout(()=>{
          this.addSchool(true);
        }, 0);
      } else {
        this.errorAlert.present(new Error("Group Number, School Name, and Cohort are required."), 28);
      }
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
    console.log('selected school: ', school);
    this.schoolToEdit = school;
    this.editSchoolName = school.name;
    this.editSchoolNumber = school.idNumber;
    this.editSchoolVisible = true;
    this.editSchoolCohort = school.cohort;
  }

  hideSchoolEdit(): void {
    this.editSchoolVisible = false;
  }

  updateSchool(school): void {

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
}
