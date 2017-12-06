import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './collections/users';
import { Roles } from 'meteor/alanning:roles';
import initializeEmailTemplates from './emailTemplates';

import * as _ from 'lodash';

import { Sessions } from './collections/sessions';

Meteor.startup(() => {

  //VARIABLES
  //BE SURE TO SET MAIL_RUL
  //process.env.MAIL_URL

  //Sessions.remove({})

  if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
  }

  //SETUP USER ROLES
  const rolesList = ['teacher', 'researcher', 'manager', 'admin', 'active', 'deactive'];
  const currentRoles = Roles.getAllRoles().map( role => {return role.name});
  const missingRoles = _.difference(rolesList, currentRoles);
  missingRoles.forEach( missingRole => {
    Roles.createRole(missingRole);
  })

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
    const newAdminUser = Accounts.findUserByEmail(process.env.NAR_INN_ADMIN_EMAIL);
    Accounts.sendEnrollmentEmail(newAdminUser._id, process.env.NAR_INN_ADMIN_EMAIL);
    Roles.setUserRoles(newAdminUser._id, ['admin', 'active']);
  }

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

  })

  initializeEmailTemplates();

});
