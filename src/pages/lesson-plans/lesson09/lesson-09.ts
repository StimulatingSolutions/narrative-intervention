import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson09',
  templateUrl: 'lesson-09.html',
})
export class Lesson09 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
