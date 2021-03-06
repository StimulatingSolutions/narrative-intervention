import { Accounts } from 'meteor/accounts-base';
import {Schools, Sessions, ResponseMetadata, Users, StudentResponses} from './collections';
import {Profile, User, School, Session, LoggedEvent, StudentResponse, DownloadedEvent, MetadataEvent} from './models';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import {includes} from 'lodash';
import moment = require("moment-timezone");
import {buildCsv} from "./buildCsv";
import {getQuestionTypeId, getResponseId} from "./ids";

const nonEmptyString = Match.Where((str) => {
  check(str, String);
  return str.length > 0;
});

let methods = {

  createNewUser(email: string, name: string, role: string): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new user');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
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
      throw new Meteor.Error('unauthorized', 'User must be logged-in to send a reset password email for another user');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }
    Accounts.sendResetPasswordEmail(id);

  },

  updateUser(user: User, profile: Profile, roles: string[]){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to update a user');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }
    const validRoles = [];
    Roles.getAllRoles().forEach( role => {
      if(includes(roles, role.name)){
        validRoles.push(role.name);
      }
    });
    Roles.setUserRoles(user._id, validRoles);

    Meteor.users.update(user._id, {
      $set: {profile, email: profile.email}
    });
  },

  updateUserRoles(userId: string, roles: string[]){

    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in.');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    const validRoles = [];
    Roles.getAllRoles().forEach( role => {
      if(includes(roles, role)){
        validRoles.push(role);
      }
    });

    Roles.setUserRoles(userId, validRoles);

  },

  getUserRoles(id = this.userId): string[] {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized',
        'User must be logged-in to get user roles');
    }
    return Roles.getRolesForUser(id);
  },

  //SCHOOLS
  createNewSchool(school: School): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new school');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
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
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new school');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
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

  deleteSchool(schoolId: string){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to delete a school/cohort');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    Schools.remove(schoolId);
  },

  //SESSIONS
  createNewSession(session: Session): void {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to create a new session');
    }

    if (!Roles.userIsInRole(this.userId, ['admin', 'teacher'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission');
    }

    let conflict = Sessions.findOne({schoolNumber: session.schoolNumber, active: true});
    if (conflict) {
      throw new Meteor.Error('conflict', `There is an existing, unfinished session in the database for group ${session.schoolNumber}, created on ${moment(session.creationTimestamp).format('YYYY/MM/DD[ at ]h:mm a')}. Please wait a few seconds, then try again.`);
    }

    const creator = Users.findOne({_id: this.userId});
    session.creatorsId = this.userId;
    session.creatorsName = creator.profile.name;
    session.creationTimestamp = Date.now();
    Sessions.insert(session);
  },

  setSessionActive(id: string, active: boolean){
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to activate or deactivate a session');
    }
    if (!active){
      Sessions.update(id, {
        $set: {
          activeStudents: []
        }
      });
    }
    Sessions.update(id, {
      $set: {
        active: active
      }
    });
  },

  joinSession(groupNumber: number, studentNumber: number){
    const session = Sessions.findOne({schoolNumber: groupNumber, active: true});
    if (!session){
      throw new Meteor.Error('not found', `Group ${groupNumber} has no active sessions.`);
    }
    Sessions.update(session._id, {
      $addToSet: {
        activeStudents: studentNumber
      }
    });
    return session._id;
  },

  demoSession(groupNumber: number){
    const session = Sessions.findOne({schoolNumber: groupNumber, active: true});
    if (!session){
      throw new Meteor.Error('not found', `Group ${groupNumber} has no active sessions.`);
    }
    return session._id;
  },

  leaveSession(sessionId: string, studentNumber: number){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.active){
      throw new Meteor.Error('Session Error', 'Session is not active');
    }
    Sessions.update(session._id, {
      $pull: {
        activeStudents: studentNumber
      }
    });
  },

  startQuestion(sessionId: string, stepId: number, questionId: number, questionType: string, correctAnswer: string, openResponse: boolean, practice: boolean, fidelityCount: number, totalSteps: number) {
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (session.questionId === questionId) {
      return;
    }

    let iteration = (session.questionIterations[questionId] || 0) + 1;
    let update: any = {
      $set: {
        readyForResponse: true,
        questionStepId: stepId,
        questionType: questionType,
        questionId: questionId,
        correctAnswer: correctAnswer,
        currentStepId: stepId,
        openResponse: openResponse,
        responses: session.questionResponses[questionId] || {},
        questionIteration: iteration,
        practice: practice,
        headTeacherFidelity: fidelityCount,
        totalSteps: totalSteps
      }
    };
    update.$set[`completedSteps.${stepId}`] = true;
    update.$set[`questionIterations.${questionId}`] = iteration;
    update.$set[`questionResponses.${questionId}`] = update.$set.responses;
    Sessions.update(sessionId, update);

    let event: MetadataEvent = {
      type: "question-start",
      timestamp: new Date(),
      questionType: questionType,
      correctResponse: correctAnswer,
      SessionID: sessionId,
      QuestionNumber: questionId,
      QuestionIteration: iteration,
      openResponse: openResponse,
      practice: practice
    };
    ResponseMetadata.insert(event);
  },

  timerReset(sessionId: string){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }

    let originalIteration = session.questionIteration;
    let update: any = {
      $set: {
        responses: {},
        headTeacherFidelity: session.headTeacherFidelity-1
      }
    };
    update.$set[`completedSteps.${session.questionStepId}`] = false;
    update.$set[`questionResponses.${session.questionId}`] = {};
    Sessions.update(sessionId, update);

    let event: MetadataEvent = {
      type: "timer-reset",
      timestamp: new Date(),
      SessionID: sessionId,
      QuestionNumber: session.questionId,
      QuestionIteration: originalIteration
    };
    ResponseMetadata.insert(event);

    methods.finishQuestion(sessionId);
  },

  finishQuestion(sessionId: string){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (session.questionId == null) {
      return;
    }

    let originalIteration = session.questionIteration;
    let update: any = {
      $set: {
        readyForResponse: false,
        questionStepId: null,
        correctAnswer: null,
        openResponse: null,
        backupQuestionType: null,
        questionIteration: null,
        questionId: null,
        practice: false,
        responses: {}
      }
    };
    if (session.backupQuestionType) {
      update.$set.questionType = session.backupQuestionType;
    }
    Sessions.update(sessionId, update);

    let event: MetadataEvent = {
      type: "question-end",
      timestamp: new Date(),
      SessionID: sessionId,
      QuestionNumber: session.questionId,
      QuestionIteration: originalIteration
    };
    ResponseMetadata.insert(event);
  },

  sendQuestionResponse(sessionId: string, studentNumber: number, selectedCard: string){
    const session = Sessions.findOne({_id: sessionId});
    if (!session){
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    if (!session.readyForResponse){
      throw new Meteor.Error('Session Error', 'Session is not receiving responses');
    }
    let studentId: string = `${session.schoolNumber}-${session.cohortNumber}-${studentNumber}`;

    let update = {
      $set: {}
    };
    update.$set[`questionResponses.${session.questionId}.${studentNumber}`] = selectedCard;
    update.$set[`responses.${studentNumber}`] = selectedCard;

    Sessions.update(sessionId, update);

    let event: StudentResponse = {
      timestamp: new Date(),
      SessionID: sessionId,
      QuestionNumber: session.questionId,
      QuestionIteration: session.questionIteration,
      StudentID: studentId,
      StudentResponse: selectedCard
    };
    StudentResponses.insert(event);
  },

  setCurrentStep(sessionId: string, stepId: number, completed: boolean, questionType: string, fidelityCount: number, totalSteps: number) {
    const session = Sessions.findOne({_id: sessionId});
    if (!session) {
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    let update: any = {
      $set: {
        currentStepId: stepId,
        headTeacherFidelity: fidelityCount,
        totalSteps: totalSteps
      }
    };
    update.$set[`completedSteps.${stepId}`] = completed;
    if (session.openResponse) {
      update.$set.backupQuestionType = questionType;
    } else {
      update.$set.questionType = questionType;
    }
    Sessions.update(sessionId, update);
  },

  coTeacherFidelity(sessionId: string, fidelityCount: number, totalSteps: number) {
    const session = Sessions.findOne({_id: sessionId});
    if (!session) {
      throw new Meteor.Error('Session Error', 'Session does not exist');
    }
    let update: any = {
      $set: {
        coTeacherFidelity: fidelityCount,
        totalSteps: totalSteps
      }
    };
    Sessions.update(sessionId, update);
  },

  download(sessionIds: string[]) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to download data');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission to download data');
    }

    let columns: string[] = [
      'SessionID',
      'SessionDate',
      'SessionTime',
      'HeadTeacherID',
      'HeadTeacherName',
      'SchoolName',
      'GroupNumber',
      'CohortNumber',
      'Lesson',
      'QuestionNumber',
      'QuestionIteration',
      'QuestionTypeID',
      'QuestionType',
      'OpenResponse',
      'Practice',
      'CorrectResponseID',
      'CorrectResponse',
      'StudentID',
      'StudentResponseCount',
      'StudentResponseID',
      'StudentResponse',
      'Correct',
      'ResponseTime',
      'Invalidated',
      'TotalFidelityBoxes',
      'HeadTeacherFidelity',
      'CoTeacherFidelity'
    ];
    let dataset: DownloadedEvent[] = [];

    let sessions: { [k:string]: Session } = {};
    for (let session of Sessions.find({_id: {$in: sessionIds}}).fetch()) {
      sessions[session._id] = session;
      if (!session.headTeacherFidelity) {
        session.headTeacherFidelity = 0;
        for (let i of Object.keys(session.completedSteps)) {
          if (session.completedSteps[i]) {
            session.headTeacherFidelity++;
          }
        }
      }
    }
    let metadata: MetadataEvent[] = ResponseMetadata.find({SessionID: {$in: sessionIds}}, {sort: {timestamp: 1}}).fetch();
    let questionMetadata: { [k: string]: MetadataEvent } = {};
    let responseCounts: { [k: string]: { [k: string]: number } } = {};
    for (let event of metadata) {
      let key = `${event.SessionID} / ${event.QuestionNumber} / ${event.QuestionIteration}`;
      if (event.type === 'question-start') {
        questionMetadata[key] = event;
      } else if (event.type === 'question-end') {
        let md: MetadataEvent = questionMetadata[key];
        md.duration = event.timestamp.getTime() - md.timestamp.getTime();
      } else if (event.type === 'timer-reset') {
        let md: MetadataEvent = questionMetadata[key];
        md.reset = true;
      }
    }

    let responses: StudentResponse[] = StudentResponses.find({SessionID: {$in: sessionIds}}, {sort: {timestamp: 1}}).fetch();
    for (let response of responses) {
      let key = `${response.SessionID} / ${response.QuestionNumber} / ${response.QuestionIteration}`;
      let md: MetadataEvent = questionMetadata[key];
      let mdPrior: MetadataEvent = questionMetadata[`${response.SessionID} / ${response.QuestionNumber} / ${response.QuestionIteration-1}`];
      let data: DownloadedEvent = <DownloadedEvent>response;
      data.HeadTeacherFidelity = sessions[data.SessionID].headTeacherFidelity || 0;
      data.CoTeacherFidelity = sessions[data.SessionID].coTeacherFidelity || 0;
      data.TotalFidelityBoxes = sessions[data.SessionID].totalSteps || 0;
      data.HeadTeacherID = sessions[data.SessionID].creatorsId;
      data.HeadTeacherName = sessions[data.SessionID].creatorsName;
      data.SchoolName = sessions[data.SessionID].schoolName;
      data.GroupNumber = sessions[data.SessionID].schoolNumber;
      data.CohortNumber = sessions[data.SessionID].cohortNumber;
      data.Lesson = sessions[data.SessionID].lesson;
      let timestamp = moment(sessions[data.SessionID].creationTimestamp).tz('America/New_York');
      data.SessionDate = timestamp.format('YYYY/MM/DD');
      data.SessionTime = timestamp.format('HH:mm');
      data.QuestionType = sessions[data.SessionID].questionType;
      data.QuestionTypeID = getQuestionTypeId(sessions[data.SessionID].questionType);
      data.OpenResponse = md.openResponse;
      data.Practice = md.practice;
      data.CorrectResponse = md.correctResponse;
      data.CorrectResponseID = getResponseId(md.correctResponse);
      data.StudentResponseID = getResponseId(data.StudentResponse);
      data.Correct = (data.CorrectResponse == null ? null : data.CorrectResponse === data.StudentResponse);
      if ((mdPrior && mdPrior.reset) || !responseCounts[`${response.SessionID} / ${response.QuestionNumber}`]) {
        responseCounts[`${response.SessionID} / ${response.QuestionNumber}`] = {};
      }
      let duration = data.timestamp.getTime() - md.timestamp.getTime();
      for (let i=data.QuestionIteration-1; i >= 1; i--) {
        let md2: MetadataEvent = questionMetadata[`${response.SessionID} / ${response.QuestionNumber} / ${i}`];
        if (md2.reset) {
          break;
        }
        duration += (md2.duration || 0);
      }
      responseCounts[`${response.SessionID} / ${response.QuestionNumber}`][response.StudentID] = (responseCounts[`${response.SessionID} / ${response.QuestionNumber}`][response.StudentID] || 0) +1;
      data.ResponseTime = (duration/1000).toFixed(3);
      data.Invalidated = false;
      for (let i=data.QuestionIteration; questionMetadata[`${response.SessionID} / ${response.QuestionNumber} / ${i}`]; i++) {
        let md2: MetadataEvent = questionMetadata[`${response.SessionID} / ${response.QuestionNumber} / ${i}`];
        if (md2.reset) {
          data.Invalidated = true;
          break;
        }
      }
      data.StudentResponseCount = responseCounts[`${response.SessionID} / ${response.QuestionNumber}`][response.StudentID];

      dataset.push(data);
    }

    let csv: string = buildCsv(dataset, columns);
    Sessions.update({_id: {$in: sessionIds}}, {$set: {lastDownload: Date.now()}}, {multi: true});
    return csv;
  },

  clear(sessionIds: string[]) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'User must be logged-in to download data');
    }

    if (!Roles.userIsInRole(this.userId, ['admin'])){
      throw new Meteor.Error('unauthorized',
        'User does not have permission to download data');
    }

    ResponseMetadata.remove({SessionID: {$in: sessionIds}});
    StudentResponses.remove({SessionID: {$in: sessionIds}});
    Sessions.remove({_id: {$in: sessionIds}});
  }
};

Meteor.methods(methods);
