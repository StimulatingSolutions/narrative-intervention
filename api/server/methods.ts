import { Accounts } from 'meteor/accounts-base';
import { Schools, Sessions, LoggedEvents } from './collections';
import {Profile, User, School, Session, LoggedEvent, StudentResponse} from './models';
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
    return Roles.getRolesForUser(id);
  },


  updateProfile(user: User, profile: Profile): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    Meteor.users.update(user._id, {
      $set: {profile}
    });
  },

  //SCHOOLS
  createNewSchool(school: School): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    let conflict = Schools.findOne({idNumber: school.idNumber});
    if (conflict) {
      throw new Meteor.Error('conflict', `Another Group with the id number ${school.idNumber} already exists.`)
    }

    Schools.insert(school);
  },

  updateSchool(schoolId: string, updates: any){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    let conflict = Schools.findOne({idNumber: updates.idNumber});
    if (conflict && conflict._id != schoolId) {
      throw new Meteor.Error('conflict', `Another Group with the id number ${updates.idNumber} already exists.`)
    }

    Schools.update(schoolId, {
      $set: {
        name: updates.name,
        idNumber: updates.idNumber,
        cohort: updates.cohort
      }
    });
  },

  //SESSIONS
  createNewSession(session: Session): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'researcher', 'teacher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    let conflict = Sessions.findOne({schoolNumber: session.schoolNumber, active: true});
    if (conflict) {
      throw new Meteor.Error('conflict', `There is an existing, unfinished session in the database for group ${session.schoolNumber}, created on ${session.creationDate} at ${session.creationTime}. Please wait a few seconds, then try again.`);
    }

    session.creatorsId = this.userId;
    Sessions.insert(session);
  },

  setSessionActive(id: string, active: boolean){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new chat');
    }
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

  joinSession(userId: string){
    let parts = userId.split('-');
    let groupNumber = parseInt(parts[0]).toString();
    let studentNumber = parseInt(parts[1]).toString();
    const session = Sessions.findOne({schoolNumber: groupNumber, active: true});
    if (!session){
      throw new Meteor.Error('not found', `Group ${groupNumber} has no active sessions.`);
    }
    Sessions.update(session._id, {
      $addToSet: {
        activeUsers: `${groupNumber}-${studentNumber}`
      }
    });
    return session._id;
  },

  leaveSession(sessionId: string, userId: string){
    let parts = userId.split('-');
    let groupNumber = parseInt(parts[0]).toString();
    let studentNumber = parseInt(parts[1]).toString();
    const session = Sessions.findOne({shortId: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }
    Sessions.update(session._id, {
      $pull: {
        activeUsers: `${groupNumber}-${studentNumber}`
      }
    });
  },

  startQuestion(sessionId: string, stepId: number, questionId: number, questionType: string, correctAnswer: string, openResponse: boolean){
    console.log('starting question: ', stepId);
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }

    let iteration = (session.questionIterations[questionId] || 0) + 1;
    let update: any = {
      $set: {
        readyForResponse: true,
        questionStepId: stepId,
        questionType: questionType,
        correctAnswer: correctAnswer,
        currentStepId: stepId,
        openResponse: openResponse,
        questionIteration: iteration,
        didReset: false
      },
      $addToSet: {
        completedSteps: stepId
      },
    };
    update.$set[`questionIterations.${questionId}`] = update.$set.questionIteration;
    Sessions.update(sessionId, update);

    let event: LoggedEvent = {
      type: "question-start",
      timestamp: new Date(),
      "Session ID": sessionId,
      "Question Number": questionId,
      "Question Iteration": iteration,
      questionType: questionType,
      correctResponse: correctAnswer
    };
    LoggedEvents.insert(event);
  },

  timerReset(sessionId: string){
    console.log('timer reset');
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }

    let event: LoggedEvent = {
      type: "timer-reset",
      timestamp: new Date(),
      "Session ID": sessionId,
      "Question Number": session.questionId,
      "Question Iteration": session.questionIteration
    };

    let update: any = {
      $set: {
        didReset: true
      }
    };
    Sessions.update(sessionId, update);

    LoggedEvents.insert(event);
  },

  finishQuestion(sessionId: string){
    console.log('finishing question');
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }

    let event: LoggedEvent = {
      type: "question-end",
      timestamp: new Date(),
      "Session ID": sessionId,
      "Question Number": session.questionId,
      "Question Iteration": session.questionIteration,
      questionType: session.questionType,
      correctResponse: session.correctAnswer
    };

    let update: any = {
      $set: {
        readyForResponse: false,
        questionStepId: null,
        correctAnswer: null,
        openResponse: false,
        backupQuestionType: null,
        questionIteration: null,
        questionId: null,
        didReset: null
      },
      $addToSet: {
        completedSteps: session.currentStepId
      }
    };
    if (session.backupQuestionType) {
      update.$set.questionType = session.backupQuestionType;
    }
    Sessions.update(sessionId, update);

    LoggedEvents.insert(event);
  },

  sendQuestionResponse(sessionId: string, studentId: string, selectedCard: string, date: Date, count: number){
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
      $addToSet: {
        responses: newResponse
      }
    });

    let event: StudentResponse = {
      type: "student-response",
      timestamp: new Date(),
      "Session ID": sessionId,
      "Question Number": session.questionId,
      "Question Iteration": session.questionIteration,
      "Student ID": studentId,
      "Student Response": selectedCard,
      "Response Count": count
    };
    LoggedEvents.insert(event);
  },

  setCurrentStep(sessionId: string, stepId: number, questionType: string) {
    console.log('setting current step: ', stepId);
    const session = Sessions.findOne({_id: sessionId});
    if (!session) {
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    let update: any = {
      $set: {
        currentStepId: stepId
      },
      $addToSet: {
        completedSteps: stepId
      }
    };
    if (session.openResponse) {
      update.$set.backupQuestionType = questionType;
    } else {
      update.$set.questionType = questionType;
    }
    Sessions.update(sessionId, update);
  }
});
