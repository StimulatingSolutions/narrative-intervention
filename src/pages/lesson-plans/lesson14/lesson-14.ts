import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson14',
  templateUrl: 'lesson-14.html',
})
export class Lesson14 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
