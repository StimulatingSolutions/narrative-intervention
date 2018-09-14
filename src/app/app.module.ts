import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { StudentLoginPage } from '../pages/studentLogin/studentLogin';
import { MomentModule } from 'angular2-moment';
import { ErrorAlert } from "../services/errorAlert";
import { StudentSessionPage } from '../pages/studentSession/studentSession';
import { MyApp } from './app.component';
import { AboutSoftwarePage } from "../pages/about-software/about-software";
import { AboutNpmPage } from "../pages/about-software/about-npm";
import { AboutMeteorPage } from "../pages/about-software/about-meteor";
import { ModuleInfo } from "../pages/about-software/module-info";


@NgModule({
  declarations: [
    MyApp,
    StudentLoginPage,
    StudentSessionPage,
    AboutSoftwarePage,
    ModuleInfo,
    AboutNpmPage,
    AboutMeteorPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StudentLoginPage,
    StudentSessionPage,
    AboutSoftwarePage,
    ModuleInfo,
    AboutNpmPage,
    AboutMeteorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ErrorAlert
  ]
})
export class AppModule {}
