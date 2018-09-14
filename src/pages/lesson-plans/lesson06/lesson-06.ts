import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson06',
  templateUrl: 'lesson-06.html',
})
export class Lesson06 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
