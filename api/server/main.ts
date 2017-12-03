import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Users } from './collections/users';
import { Roles } from 'meteor/alanning:roles';

import * as _ from 'lodash';



Meteor.startup(() => {

  //VARIABLES
  process.env.MAIL_URL='smtp://no-reply%40undeadreckoning.com:1FKKte!EXc3CeGAkK_H17qW1bhYvPMrRx7vW62MZUK7*dLjR_Xiz38O_QEOSB9iy@smtp.gmail.com:587';

  if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
  }

  //UNCOMMENT AND RUN TO CLEAR ALL USERS
  //Users.remove({});

  //SETUP USER ROLES
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

  //SETUP ACCOUNTS EMAIL TEMPLATES
  Accounts.emailTemplates.siteName = 'AwesomeSite';
  Accounts.emailTemplates.from = 'Stimulating Solutions <no-reply@stimulating-solutions.com>';
  Accounts.emailTemplates.enrollAccount.subject = (user) => {
    return `Welcome to Awesome Town, ${user.profile.name}`;
  };
  Accounts.emailTemplates.enrollAccount.text = (user, url) => {
    return 'You have been selected to participate in building a better future!'
      + ' To activate your account, simply click the link below:\n\n'
      + url;
  };
  Accounts.emailTemplates.resetPassword.from = () => {
    // Overrides the value set in `Accounts.emailTemplates.from` when resetting
    // passwords.
    return 'Stimulating Solutions Password Reset <no-reply@stimulating-solutions.com>';
  };
  Accounts.emailTemplates.verifyEmail = {
     subject() {
        return "Activate your account now!";
     },
     text(user, url) {
        return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
     }
  };

  Accounts.validateLoginAttempt( attempt => {

    console.log('LOGIN', attempt)

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

});
