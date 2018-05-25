import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import initializeEmailTemplates from './emailTemplates';

import * as _ from 'lodash';
import {User} from "./models";
import {ResponseMetadata, Schools, Sessions, StudentResponses} from "./collections";

Meteor.startup(() => {

  //SETUP USER ROLES
  const rolesList = ['teacher', 'researcher', 'admin', 'active', 'deactive'];
  const currentRoles = Roles.getAllRoles().map( role => {return role.name});
  const missingRoles = _.difference(rolesList, currentRoles);
  missingRoles.forEach( missingRole => {
    Roles.createRole(missingRole);
  });
  const extraRoles = _.difference(currentRoles, rolesList);
  extraRoles.forEach( extraRole => {
    let usersWithExtraRole: User[] = Roles.getUsersInRole(extraRole).fetch();
    Roles.removeUsersFromRoles(usersWithExtraRole, extraRole);
    Roles.deleteRole(extraRole);
  });

  //BOOTSTRAP INITIAL ADMIN USER
  if (Accounts.findUserByEmail(process.env.NAR_INN_ADMIN_EMAIL) === undefined) {
    Accounts.createUser({
      email: process.env.NAR_INN_ADMIN_EMAIL,
      profile: {
        name: 'admin',
        email: process.env.NAR_INN_ADMIN_EMAIL,
        picture: ''
      }
    });
    const newAdminUser: MongoObject = Accounts.findUserByEmail(process.env.NAR_INN_ADMIN_EMAIL);
    Accounts.sendEnrollmentEmail(newAdminUser._id, process.env.NAR_INN_ADMIN_EMAIL);
    Roles.setUserRoles(newAdminUser._id, ['admin', 'active']);
  }

  // indexes
  StudentResponses.rawCollection().createIndex({SessionID: 1, timestamp: 1});
  ResponseMetadata.rawCollection().createIndex({SessionID: 1, timestamp: 1});
  Schools.rawCollection().createIndex({idNumber: 1});
  Sessions.rawCollection().createIndex({schoolNumber: 1, active: 1});

  Accounts.validateLoginAttempt( attempt => {

    //console.log('LOGIN', attempt)

    if (attempt.type === 'password'){
      if (!attempt.allowed){
        return false;
      }
      return _.includes(attempt.user.roles, 'active');
    }

    if (attempt.type === 'resume'){
      return attempt.allowed;
    }

  });

  initializeEmailTemplates();

});
