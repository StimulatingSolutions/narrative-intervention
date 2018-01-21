import { Accounts } from 'meteor/accounts-base';
import { Schools } from './collections/schools';
import { Sessions } from './collections/sessions';
import { Profile, User, School, Session } from './models';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import * as _ from 'lodash';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

Meteor.methods({

  createNewUser(email: string, name: string, role: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    Accounts.createUser({
      email: email,
      profile: {
        name: name,
        email: email,
        picture: ''
      }
    });

    const validRoles = ['active'];
    Roles.getAllRoles().forEach( testRole => {
      console.log('role', testRole);
      if(testRole.name === role) {
        validRoles.push(role);
      }
    });

    const newUser: MongoObject = Accounts.findUserByEmail(email);
    Accounts.sendEnrollmentEmail(newUser._id, email);
    Roles.setUserRoles(newUser._id, validRoles);
  },

  sendResetUserPasswordEmail(email: string): void {

    if (!email) {
      throw new Meteor.Error('no email entered', 'Please enter the email address of the account you need to reset');
    }
    const newUser: MongoObject = Accounts.findUserByEmail(email);
    if (!newUser) {
      throw new Meteor.Error('account not found', 'Please double-check the email address you entered.');
    }
    Accounts.sendResetPasswordEmail(newUser._id);

  },

  sendResetUserPasswordEmailFromId(id: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }
    Accounts.sendResetPasswordEmail(id);

  },

  updateUser(user: User, profile: Profile, roles: string[]){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }
    const validRoles = [];
    Roles.getAllRoles().forEach( role => {
      if(_.includes(roles, role.name)){
        validRoles.push(role.name);
      }
    });
      console.log('UPDATE USER ROLES', user._id, validRoles);
    Roles.setUserRoles(user._id, validRoles);

    Meteor.users.update(user._id, {
      $set: {profile}
    });
  },

  updateUserRoles(userId: string, roles: string[]){

    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in.');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    const validRoles = [];
    Roles.getAllRoles().forEach( role => {
      console.log('role', role);
      if(_.includes(roles, role)){
        validRoles.push(role);
      }
    });

    Roles.setUserRoles(userId, validRoles);

  },

  getUserRoles(id = this.userId): string[] {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new chat');
    }
    var roles = Roles.getRolesForUser(id);
    return roles;
  },


  updateProfile(user: User, profile: Profile): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    Meteor.users.update(user._id, {
      $set: {profile}
    });
  },

  //SCHOOOLS
  createNewSchool(school: School): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher', 'manager'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    Schools.insert(school);
  },

  updateSchool(school: School, updates: any){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher', 'manager'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    Schools.update(school._id, {
      $set: {
        name: updates.name
      }
    });
  },

  //SESSIONS
  createNewSession(session: Session): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher', 'manager', 'teacher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    session.creatersId = this.userId;

    console.log('creating session: ', session)
    Sessions.insert(session);
  },

  updateSession(session: Session, updates: any){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher', 'manager'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    Sessions.update(session._id, {
      $set: {
        name: updates.name,
        schoolId: updates.schoolId,
        active: updates.active
      }
    });
  },

  setSessionActive(id: string, active: boolean){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }
    console.log('updating active:', active)
    if (!active){
      Sessions.update(id, {
        $set: {
          activeUsers: []
        }
      });
    }
    Sessions.update(id, {
      $set: {
        active: active
      }
    });
  },

  findSessionByShortId(sessionId: string){
    const session = Sessions.findOne({shortId: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }
    return session._id;
  },

  joinSession(sessionId: string, userId: string){
    console.log('join session', sessionId, userId);
    const session = Sessions.findOne({_id: sessionId});
    console.log(session);
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }
    if (_.includes(session.activeUsers, userId)){
      return;
    }
    const newUsers = session.activeUsers.slice();
    newUsers.push(userId);
    Sessions.update(sessionId, {
      $set: {
        activeUsers: newUsers
      }
    });

  },

  leaveSession(sessionId: string, userId: string){
    const session = Sessions.findOne({shortId: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }
    let newUsers = session.activeUsers.slice();
    newUsers = _.remove(newUsers, n => {
      return n === userId;
    });
    Sessions.update(sessionId, {
      $set: {
        activeUsers: newUsers
      }
    });
  },

  startQuestion(sessionId: string, stepId: number, alreadyAdded: boolean, questionType: string, correctAnswer: string){
    console.log('starting question: ', stepId);
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }

    let update = {
      $set: {
        readyForResponse: true,
        questionStepId: stepId,
        questionType: questionType,
        correctAnswer: correctAnswer,
        currentStepId: stepId
      }
    };
    if (!alreadyAdded) {
      update["$push"] = {
        completedSteps: stepId
      };
    }
    Sessions.update(sessionId, update);
  },

  finishQuestion(sessionId: string){
    console.log('finishing question');
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }

    Sessions.update(sessionId, {
      $set: {
        readyForResponse: false,
        questionStepId: null,
        correctAnswer: null
      },
      $push: {
        completedSteps: session.currentStepId
      }
    });
  },

  sendQuestionResponse(sessionId: string, studentId: string, selectedCard: string, date: Date){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.readyForResponse){
      throw new Meteor.Error('Session Error', 'Session is not receiving responses');
    }

    const newResponse = {
      step: session.questionStepId,
      studentId: studentId,
      response: selectedCard,
      date: date
    };
    console.log('Recording Response', newResponse);

    Sessions.update(sessionId, {
      $push: {
        responses: newResponse
      }
    });
  },

  setCurrentStep(sessionId: string, stepId: number, alreadyAdded: boolean, questionType: string) {
    console.log('setting current step: ', stepId);
    const session = Sessions.findOne({_id: sessionId});
    if (!session) {
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    let update = {
      $set: {
        questionType: questionType,
        currentStepId: stepId
      }
    };
    if (!alreadyAdded) {
      update["$push"] = {
        completedSteps: stepId
      };
    }
    Sessions.update(sessionId, update);
  }
});
