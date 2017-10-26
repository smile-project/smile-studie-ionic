import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {RegisterPage} from "../register/register";
import {AuthenticationService} from "../../services/AuthenticationService";
import {TutorialPage} from "../tutorial/tutorial";
import {InterventionPage} from "../intervention/intervention";
import {LoadingPage} from "../loading/loading";
@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  constructor(public navCtrl: NavController,
              public authenticationService: AuthenticationService) {
  };

  ngOnInit() {
    if (this.authenticationService.getToken()) {
      if (localStorage.getItem('termsAccepted') && localStorage.getItem('tutorialAccepted')) {
        this.navCtrl.setRoot(LoadingPage);
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
