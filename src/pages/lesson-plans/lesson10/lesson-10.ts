import { Component, Input } from '@angular/core';
import { Session } from 'api/models';
import { preloadImage } from '../../../util/preloadImage';
import { BaseLesson } from '../base-lesson';


@Component({
  selector: 'lesson10',
  templateUrl: 'lesson-10.html',
})
export class Lesson10 extends BaseLesson {

  @Input() session: Session;

  constructor() {
    super();
    preloadImage('perspective', 3170, 926, 500);
  }
}
