import { MongoObservable } from 'meteor-rxjs';
import { Session } from '../models';

export const Sessions = new MongoObservable.Collection<Session>('sessions');
