import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './collections/users';
import { Roles } from 'meteor/alanning:roles';

import * as _ from 'lodash';

Meteor.startup(() => {
  if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
  }

  //Users.remove({});
  const rolesList = ['teacher', 'researcher', 'admin', 'active', 'deactive'];
  const currentRoles = Roles.getAllRoles().map( role => {return role.name});
  const missingRoles = _.difference(rolesList, currentRoles);
  missingRoles.forEach( missingRole => {
    Roles.createRole(missingRole);
  })

  if (Users.collection.find().count() === 0) {
    Accounts.createUser({
      email: 'admin@gmail.com',
      password: 'admin',
      profile: {
        name: 'admin',
        email: 'admin@gmail.com',
        picture: ''
      }
    });
    const newAdminUser = Accounts.findUserByEmail('admin@gmail.com');
    Roles.setUserRoles(newAdminUser._id, ['admin', 'active']);
  }

});
