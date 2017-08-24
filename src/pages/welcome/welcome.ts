import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {RegisterPage} from "../register/register";
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
  public translateService: TranslateService) {

  };

  signup() {
    this.navCtrl.push(RegisterPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
}
