import { Component, Input } from '@angular/core';
import { Session } from 'api/models';


@Component({
  selector: 'lessonplans',
  templateUrl: 'lessonplans.html',
})
export class LessonPlans {

  @Input() session: Session;

  constructor() {

  }


}
