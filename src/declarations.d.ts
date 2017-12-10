/*
  Declaration files are how the Typescript compiler knows about the type information(or shape) of an object.
  They're what make intellisense work and make Typescript know all about your code.
  A wildcard module is declared below to allow third party libraries to be used in an app even if they don't
  provide their own type declarations.
  To learn more about using third party libraries in an Ionic app, check out the docs here:
  http://ionicframework.com/docs/v2/resources/third-party-libs/
  For more info on type definition files, check out the Typescript docs here:
  https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
*/

// Generated by typings
// Source: https://raw.githubusercontent.com/meteor-typings/alanning-roles/9960894dba03dbaf0b2a03986ed8d041e6d629e0/main.d.ts

declare module "meteor/alanning:roles"

// interface RolesDAO {
//   _id?: string;
//   name?: string;
// }
//
// declare module Roles {
//   function createRole(roleName: string): string;
//   function deleteRole(roleName: string): void;
//   function addUsersToRoles(users: any, roles: any, groups?: string): void;
//   function removeUsersFromRoles(users: any, roles: any): void;
//    // User can be user ID or user object.
//   function userIsInRole(user: any, roles: any): boolean;
//   function getRolesForUser(userId: string): string[];
//   function getAllRoles(): Mongo.Cursor<RolesDAO>;
//   function getUsersInRole(roleName: string): Mongo.Cursor<RolesDAO>;
//   var GLOBAL_GROUP: string;
// }

declare module '*.png'
