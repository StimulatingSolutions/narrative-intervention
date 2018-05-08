
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
  questionIteration?: number;
}
