import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson15',
  templateUrl: 'lesson-15.html',
})
export class Lesson15 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
