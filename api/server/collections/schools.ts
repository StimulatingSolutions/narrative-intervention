import { MongoObservable } from 'meteor-rxjs';
import { School } from '../models';

export const Schools = new MongoObservable.Collection<School>('schools');
