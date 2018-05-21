import {LoggedEvent, School, Session, User} from "./models";
import {MongoObservable} from "meteor-rxjs";

export const Schools = new MongoObservable.Collection<School>('schools');
export const Sessions = new MongoObservable.Collection<Session>('sessions');
export const Users = MongoObservable.fromExisting<User>(Meteor.users);
export const LoggedEvents = new MongoObservable.Collection<LoggedEvent>('loggedEvents');
