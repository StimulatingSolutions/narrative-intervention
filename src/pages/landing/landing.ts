import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'verification',
  templateUrl: 'landing.html'
})
export class LandingPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) {}

  ngOnInit() {

  }

  login(): void {
    this.navCtrl.push(LoginPage, {});
  }
}
