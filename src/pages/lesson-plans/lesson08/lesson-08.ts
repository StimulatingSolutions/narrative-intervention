import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson08',
  templateUrl: 'lesson-08.html',
})
export class Lesson08 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
