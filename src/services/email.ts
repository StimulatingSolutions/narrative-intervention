import { Injectable } from '@angular/core';
import { Meteor } from 'meteor/meteor';

@Injectable()
export class EmailService {

  login(email: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword({email: email}, password, (e: Error) => {
        if (e) {
          return reject(e);
        }
        resolve();
      });
    });
  }

  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Meteor.logout((e: Error) => {
        if (e) {
          return reject(e);
        }
        resolve();
      });
    });
  }
}
