import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson02',
  templateUrl: 'lesson-02.html',
})
export class Lesson02 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
  }
}
