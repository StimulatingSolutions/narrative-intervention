import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { preloadImage } from '../../../util/preloadImage';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson01',
  templateUrl: 'lesson-01.html',
})
export class Lesson01 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
    preloadImage('because', 1814, 914, 500);
    preloadImage('what', 1814, 914, 500);
    preloadImage('why', 1815, 914, 500);
  }
}
