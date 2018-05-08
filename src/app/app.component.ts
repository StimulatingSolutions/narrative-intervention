import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Meteor } from 'meteor/meteor';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/landing/welcome';
import {LocationStrategy} from "@angular/common";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  backBusterCount: number = 1;

  constructor(location: LocationStrategy, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.rootPage = Meteor.user() ? WelcomePage : LoginPage;
    platform.registerBackButtonAction(() => {});

    let currLoc: string = window.location.href.split('?')[0];
    window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
    window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
    window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
    window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
    window.addEventListener('popstate', (event) => {
      window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
      window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
    });
    window.document.addEventListener("deviceready", () => {
      window.document.addEventListener("backbutton",() => {
        window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
        window.history.pushState(null, null, currLoc+`?backBuster${this.backBusterCount++}`);
        return false;
      }, false);
    }, false);

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
    });
  }
}
