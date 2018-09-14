import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson07',
  templateUrl: 'lesson-07.html',
})
export class Lesson07 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
