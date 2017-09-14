import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {RegisterPage} from "../register/register";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../services/AuthenticationService";
import {InterventionPage} from "../intervention/intervention";
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
      this.navCtrl.setRoot(InterventionPage);
    }
  }

  signup() {
    this.navCtrl.push(RegisterPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
