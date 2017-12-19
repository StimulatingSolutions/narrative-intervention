import { Accounts } from 'meteor/accounts-base';
import { Chats } from './collections/chats';
import { Messages } from './collections/messages';
import { Schools } from './collections/schools';
import { Sessions } from './collections/sessions';
import { MessageType, Profile, User, School, Session } from './models';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import * as _ from 'lodash';

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

Meteor.methods({

  createNewUser(email: string, name: string): void {
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
    })

    const newUser = Accounts.findUserByEmail(email);
    Accounts.sendEnrollmentEmail(newUser._id, email);
    Roles.setUserRoles(newUser._id, ['active']);
  },

  sendRestUserPasswordEmail(email: string): void {

    const newUserId = Accounts.findUserByEmail(email)._id;

    Accounts.sendResetPasswordEmail(newUserId);

  },

  sendRestUserPasswordEmailFromId(id: string): void {
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

  addChat(receiverId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to create a new chat');
    }

    check(receiverId, nonEmptyString);

    if (receiverId === this.userId) {
      throw new Meteor.Error('illegal-receiver',
        'Receiver must be different than the current logged in user');
    }

    const chatExists = !!Chats.collection.find({
      memberIds: { $all: [this.userId, receiverId] }
    }).count();

    if (chatExists) {
      throw new Meteor.Error('chat-exists',
        'Chat already exists');
    }

    const chat = {
      memberIds: [this.userId, receiverId]
    };

    Chats.insert(chat);
  },
  removeChat(chatId: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to remove chat');
    }

    check(chatId, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    Chats.remove(chatId);
  },

  updateProfile(user: User, profile: Profile): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    Meteor.users.update(user._id, {
      $set: {profile}
    });
  },
  addMessage(type: MessageType, chatId: string, content: string) {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');

    check(chatId, nonEmptyString);
    check(content, nonEmptyString);

    const chatExists = !!Chats.collection.find(chatId).count();

    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }

    return {
      messageId: Messages.collection.insert({
        chatId: chatId,
        senderId: this.userId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
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

  updateSessionStep(sessionId: string, stepNumber: number){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }

    Sessions.update(sessionId, {
      $set: {
        currentStep: stepNumber
      }
    });
  },

  updateSessionReadyForResponse(sessionId: string, ready: boolean){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }

    Sessions.update(sessionId, {
      $set: {
        readyForResponse: ready
      }
    });
  },

  sendQuestionResponse(sessionId: string, studentId: string, selectedCard: string){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }

    const dup = session.responses.slice();
    const removed = _.remove(dup, response => {
      return response.studentId === studentId && response.step === session.currentStep ;
    });

    dup.push({
      step: session.currentStep,
      studentId: studentId,
      response: selectedCard
    });

    console.log("SETTING RESPONSES", dup)
    Sessions.update(sessionId, {
      $set: {
        responses: dup
      }
    });
  }
});
