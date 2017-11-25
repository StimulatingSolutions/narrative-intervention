import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './collections/users';

Meteor.startup(() => {
  if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
  }

  console.log('Users', Users.collection.find().count())
  //Users.remove({});

  if (Users.collection.find().count() > 0) {
    return;
  }

  Accounts.createUser({
    email: 'admin@gmail.com',
    password: 'admin',
    profile: {
      name: 'admin',
      email: 'admin@gmail.com',
      picture: ''
    }
  })
});
