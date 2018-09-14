import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson05',
  templateUrl: 'lesson-05.html',
})
export class Lesson05 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
