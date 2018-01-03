import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ChatsPage } from '../pages/chats/chats';
import { LoginPage } from '../pages/login/login';
import { NewChatComponent } from '../pages/chats/new-chat';
import { ChatsOptionsComponent } from '../pages/chats/chats-options';
import { MomentModule } from 'angular2-moment';
import { MessagesPage } from '../pages/messages/messages';
import { MessagesOptionsComponent } from '../pages/messages/messages-options';
import { ProfilePage } from '../pages/profile/profile';
import { VerificationPage } from '../pages/verification/verification';
import { LandingPage } from '../pages/landing/landing';
import { WelcomePage } from '../pages/landing/welcome';
import { SchoolManagementPage } from '../pages/schools/schoolmanagement';
import { PhoneService } from '../services/phone';
import { EmailService } from '../services/email';
import { UserManagementPage } from '../pages/usermanagement/usermanagement';
import { SessionManagementPage } from '../pages/sessions/sessionmanagement';
import { TeacherSessionPage } from '../pages/teacherSession/teacherSession';
import { StudentSessionPage } from '../pages/studentSession/studentSession';
import { SideBarInfo } from '../pages/teacherSession/sideBarInfo';
import { LessonPlans } from '../pages/lesson-plans/lessonPlans';
import { Lesson06 } from '../pages/lesson-plans/lesson06/lesson-06';
import { Step } from '../pages/lesson-plans/step';
import { MyApp } from './app.component';

require('raf');
require('smoothscroll-polyfill').polyfill();


@NgModule({
  declarations: [
    MyApp,
    ChatsPage,
    MessagesPage,
    LoginPage,
    VerificationPage,
    ProfilePage,
    ChatsOptionsComponent,
    NewChatComponent,
    MessagesOptionsComponent,
    LandingPage,
    WelcomePage,
    UserManagementPage,
    SchoolManagementPage,
    SessionManagementPage,
    TeacherSessionPage,
    StudentSessionPage,
    SideBarInfo,
    LessonPlans,
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
    ChatsPage,
    MessagesPage,
    LoginPage,
    VerificationPage,
    ProfilePage,
    ChatsOptionsComponent,
    NewChatComponent,
    MessagesOptionsComponent,
    LandingPage,
    WelcomePage,
    UserManagementPage,
    SchoolManagementPage,
    SessionManagementPage,
    TeacherSessionPage,
    StudentSessionPage,
    SideBarInfo,
    LessonPlans,
    Lesson06,
    Step
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PhoneService,
    EmailService
  ]
})
export class AppModule {}
