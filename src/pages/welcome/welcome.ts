import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {RegisterPage} from "../register/register";
import {AuthenticationService} from "../../services/AuthenticationService";
import {TutorialPage} from "../tutorial/tutorial";
import {InterventionPage} from "../intervention/intervention";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  constructor(public navCtrl: NavController,
              public authenticationService: AuthenticationService,
              private screenOrientation: ScreenOrientation) {
    try {
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    } catch (error) {
    }
  };

  ngOnInit() {
    if (this.authenticationService.getToken()) {
      if (localStorage.getItem('termsAccepted') && localStorage.getItem('tutorialAccepted')) {
        this.navCtrl.setRoot(InterventionPage);
      } else {
        this.navCtrl.setRoot(TutorialPage);
      }
    }
  }

  signup() {
    this.navCtrl.push(RegisterPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
