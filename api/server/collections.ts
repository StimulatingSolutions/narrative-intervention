import {MetadataEvent, School, Session, StudentResponse, User} from "./models";
import {MongoObservable} from "meteor-rxjs";

export const Schools = new MongoObservable.Collection<School>('schools');
export const Sessions = new MongoObservable.Collection<Session>('sessions');
export const Users = MongoObservable.fromExisting<User>(Meteor.users);
export const StudentResponses = new MongoObservable.Collection<StudentResponse>('studentResponses');
export const ResponseMetadata = new MongoObservable.Collection<MetadataEvent>('responseMetadata');
