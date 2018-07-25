import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LoginPage } from '../pages/login/login';
import { MomentModule } from 'angular2-moment';
import { WelcomePage } from '../pages/landing/welcome';
import { ErrorAlert } from "../services/errorAlert";
import { DataManagementPage } from "../pages/dataManagement/dataManagement";
import { SchoolManagementPage } from '../pages/schools/schoolmanagement';
import { EmailService } from '../services/email';
import { UserManagementPage } from '../pages/usermanagement/usermanagement';
import { TeacherSessionPage } from '../pages/teacherSession/teacherSession';
import { StudentSessionPage } from '../pages/studentSession/studentSession';
import { SideBarInfo } from '../pages/teacherSession/sideBarInfo';
import { LessonPlans } from '../pages/lesson-plans/lessonPlans';
import { Step } from '../pages/lesson-plans/step';
import { MyApp } from './app.component';
import { LoginHelpPage } from "../pages/loginHelp/loginHelp";
import { VideosPage } from "../pages/videos/videos";
import {AboutSoftwarePage} from "../pages/about-software/about-software";
import {AboutNpmPage} from "../pages/about-software/about-npm";
import {AboutMeteorPage} from "../pages/about-software/about-meteor";
import {ModuleInfo} from "../pages/about-software/module-info";
import { Lesson01 } from '../pages/lesson-plans/lesson01/lesson-01';
import { Lesson02 } from '../pages/lesson-plans/lesson02/lesson-02';
import { Lesson05 } from '../pages/lesson-plans/lesson05/lesson-05';
import { Lesson06 } from '../pages/lesson-plans/lesson06/lesson-06';


require('raf');
require('smoothscroll-polyfill').polyfill();


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    WelcomePage,
    DataManagementPage,
    UserManagementPage,
    SchoolManagementPage,
    TeacherSessionPage,
    StudentSessionPage,
    SideBarInfo,
    LoginHelpPage,
    VideosPage,
    AboutSoftwarePage,
    ModuleInfo,
    AboutNpmPage,
    AboutMeteorPage,
    LessonPlans,
    Lesson01,
    Lesson02,
    Lesson05,
    Lesson06,
    Step
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    WelcomePage,
    DataManagementPage,
    UserManagementPage,
    SchoolManagementPage,
    TeacherSessionPage,
    StudentSessionPage,
    SideBarInfo,
    LoginHelpPage,
    VideosPage,
    AboutSoftwarePage,
    ModuleInfo,
    AboutNpmPage,
    AboutMeteorPage,
    LessonPlans,
    Lesson01,
    Lesson02,
    Lesson05,
    Lesson06,
    Step
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmailService,
    ErrorAlert
  ]
})
export class AppModule {}
