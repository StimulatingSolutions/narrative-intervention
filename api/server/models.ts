
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
  lesson: number;
  openResponse?: boolean;
  review?: boolean;
  questionIterations: { [s: number]: number };
  questionIteration?: number;
  questionResponses: { [s: number]: { [s: number]: string } };
  responses: { [s: number]: string },
  completedSteps: { [s: number]: boolean };
  questionId?: number;
  cohortNumber: number;
  lastDownload?: number;
  practice?: boolean;
  totalSteps?: number;
  headTeacherFidelity?: number;
  coTeacherFidelity?: number;
}

export interface LoggedEvent {
  timestamp: Date,
  SessionID: string,
  QuestionNumber: number,
  QuestionIteration: number,
}

export interface MetadataEvent extends LoggedEvent {
  type: string,
  questionType?: string,
  correctResponse?: string,
  openResponse?: boolean,
  practice?: boolean,
  duration?: number,
  reset?: boolean
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
  OpenResponse: boolean,
  CorrectResponse: string,
  CorrectResponseID: number,
  StudentResponseID: number,
  Correct: boolean,
  ResponseTime: string,
  Invalidated: boolean,
  StudentResponseCount: number,
  Practice?: boolean,
  HeadTeacherFidelity: number,
  CoTeacherFidelity: number,
  TotalFidelityBoxes: number
}
