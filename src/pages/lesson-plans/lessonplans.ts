import { Component, Input } from '@angular/core';
//import { Observable } from 'rxjs';
import { Session } from 'api/models';

//import * as _ from 'lodash';
// import * as moment from 'moment';
// import * as shortid from 'shortid';

@Component({
  selector: 'lessonplans',
  templateUrl: 'lessonplans.html',
})
export class LessonPlans {

  @Input() session: Session;
  
  constructor() {

  }


}
