import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { preloadImage } from '../../../util/preloadImage';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson11',
  templateUrl: 'lesson-11.html',
})
export class Lesson11 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
    preloadImage('events1', 1848, 664, 500);
    preloadImage('events2', 1840, 648, 500);
    preloadImage('boards1', 3044, 1114, 500);
  }
}
