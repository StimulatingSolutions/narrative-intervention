
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
  creatorsName?: string;
  creationTimestamp?: number;
  schoolNumber?: number;
  schoolName?: string;
  active?: boolean;
  activeStudents: number[];
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
  lastDownload?: number;
}

export interface LoggedEvent {
  type: string,
  timestamp: Date,
  questionType?: string,
  correctResponse?: string,
  SessionID: string,
  QuestionNumber: number,
  QuestionIteration: number,
  openResponse?: boolean
}

export interface StudentResponse extends LoggedEvent {
  StudentID: string,
  StudentResponse: string
}

export interface DownloadedEvent extends StudentResponse {
  HeadTeacherID: string,
  HeadTeacherName: string,
  SchoolName: string,
  GroupNumber: number,
  CohortNumber: number,
  Lesson: number,
  SessionDate: string,
  SessionTime: string,
  QuestionTypeID: number,
  QuestionType: string,
  CorrectResponse: string,
  CorrectResponseID: number,
  StudentResponseID: number,
  Correct: boolean,
  ResponseTime: number,
  Invalidated: boolean,
  StudentResponseCount: number
}
