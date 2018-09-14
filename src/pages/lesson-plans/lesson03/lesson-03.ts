import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson03',
  templateUrl: 'lesson-03.html',
})
export class Lesson03 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
