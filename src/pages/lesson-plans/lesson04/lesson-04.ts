import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson04',
  templateUrl: 'lesson-04.html',
})
export class Lesson04 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
