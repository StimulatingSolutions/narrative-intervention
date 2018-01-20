
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
}

export interface Session {
  _id?: string;
  name: string;
  shortId: string;
  creatersId: string;
  schoolId: string;
  active: boolean;
  activeUsers: string[];
  questionStepId: number;
  correctAnswer: string;
  questionType: string;
  readyForResponse: boolean;
  responses: any[];
  completedSteps: number[];
  lesson: number;
}
