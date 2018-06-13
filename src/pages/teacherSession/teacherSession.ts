import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';

import { Sessions } from 'api/collections';
import { Session } from 'api/models';
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import {Step} from "../lesson-plans/step";


@Component({
  selector: 'teacherSession',
  templateUrl: 'teacherSession.html'
})
export class TeacherSessionPage extends DestructionAwareComponent implements OnInit, OnDestroy {

  incomingSessionId: string;
  reviewLesson: number;
  session: Session;

  constructor(
    private navParams: NavParams,
    private ref: ChangeDetectorRef
  ) {
    super();
    this.incomingSessionId = this.navParams.get('sessionId');
    this.reviewLesson = this.navParams.get('reviewLesson');
  }

  ngOnInit(): void {
    if (this.reviewLesson) {
      this.session = {
        lesson: this.reviewLesson,
        review: true,
        completedSteps: {},
        activeStudents: [],
        questionIterations: {},
        questionResponses: {},
        responses: {},
        cohortNumber: 0
      };
      return;
    }
    MeteorObservable.subscribe('activeSession', this.incomingSessionId)
    .subscribe((result) => {
      MeteorObservable.autorun()
      .subscribe((result1) => {
        this.session = Sessions.findOne({_id: this.incomingSessionId});
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      });
    });
  }

  ngOnDestroy(): void {
    Step.resetIds();
  }

  handleFindPlace (): void {
    let currentStep:number;
    if (this.session.currentStepId != null) {
      currentStep = this.session.currentStepId;
    } else {
      currentStep = 0;
      for (let step in this.session.completedSteps) {
        if (this.session.completedSteps[step]) {
          currentStep = Math.max(currentStep, <any>step);
        }
      }
    }
    let steps = document.getElementsByTagName('step');
    let highlightedDiv: HTMLElement = <HTMLElement>steps[currentStep];
    if (highlightedDiv) {
      const offset = highlightedDiv.offsetTop;
      const scrollDiv = document.getElementsByClassName('session-container')[0];
      scrollDiv.scrollTo({top: offset - 250, left: 0, behavior: "smooth"});
    }
  }
}
