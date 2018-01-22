import { User, School, Session } from './models';
import { Users } from './collections/users';
import { Schools } from './collections/schools';
import { Sessions } from './collections/sessions';

import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) {
    return;
  }

  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});


Meteor.publish('schools', function(): Mongo.Cursor<School> {
  if (!this.userId) {
    return;
  }

  return Schools.collection.find({}, {});
});

Meteor.publish('sessions', function(): Mongo.Cursor<Session> {
  if (!this.userId) {
    return;
  }

  return Sessions.collection.find({}, {});
});

Meteor.publish('activeSession', function(sessionId): Mongo.Cursor<Session> {

  return Sessions.collection.find({ _id: sessionId });
  //return Schools.collection.find({}, {});

});
