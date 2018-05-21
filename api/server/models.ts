
export interface Profile {
  name?: string;
  picture?: string;
  email?: string;
}

export interface User extends Meteor.User {
 profile?: Profile;
}

export interface School {
  _id?: string;
  name: string;
  idNumber: number;
  cohort?: number;
}

export interface Session {
  _id?: string;
  shortId?: string;
  creatorsId?: string;
  creationDate?: string;
  creationTime?: string;
  schoolNumber?: number;
  schoolName?: string;
  active?: boolean;
  activeUsers: string[];
  questionStepId?: number;
  correctAnswer?: string;
  questionType?: string;
  backupQuestionType?: string;
  currentStepId?: number;
  readyForResponse?: boolean;
  responses: any[];
  completedSteps: number[];
  lesson: number;
  openResponse?: boolean;
  review?: boolean;
  questionIterations: { [s: number]: number };
  questionIteration?: number;
  questionId?: number;
  didReset?: true;
  cohortNumber: number;
}

export interface LoggedEvent {
  type: string,
  timestamp: Date,
  "Session ID": string
  "Question Number": number,
  "Question Iteration": number,
  questionType?: string,
  correctResponse?: string
}

export interface StudentResponse extends LoggedEvent {
  "Student ID": string,
  "Student Response": string,
  "Response Count": number,
}

export interface DownloadedEvent extends StudentResponse {
  "Head Teacher ID": string,
  "Head Teacher Name": string,
  "School Name": string,
  "Group Number": number,
  "Cohort Number": number,
  "Lesson": number,
  "Session Date": string,
  "Question Type ID": number,
  "Question Type": string,
  "Correct Response": string,
  "Correct Response ID": number,
  "Student Response ID": number,
  "Correct": number,
  "Response Time": number,
  "Invalidated": number
}
