import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { BaseLesson } from '../base-lesson';
import { preloadImage } from '../../../util/preloadImage';


@Component({
  selector: 'lesson12',
  templateUrl: 'lesson-12.html',
})
export class Lesson12 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
    preloadImage('boards2', 2670, 1024, 500);
  }
}
