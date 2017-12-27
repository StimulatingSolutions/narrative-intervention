export const DEFAULT_PICTURE_URL = '/assets/default-profile-pic.svg';

export interface Profile {
  name?: string;
  picture?: string;
  email?: string;
}

export enum MessageType {
  TEXT = <any>'text'
}

export interface Chat {
  _id?: string;
  title?: string;
  picture?: string;
  lastMessage?: Message;
  memberIds?: string[];
}

export interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  content?: string;
  createdAt?: Date;
  type?: MessageType,
  ownership?: string;
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
  currentStep: number;
  readyForResponse: boolean;
  responses: any[];
}
