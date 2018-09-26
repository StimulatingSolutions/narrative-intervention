import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson13',
  templateUrl: 'lesson-13.html',
})
export class Lesson13 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
