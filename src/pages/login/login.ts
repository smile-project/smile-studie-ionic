import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {TranslateService} from '@ngx-translate/core';
import {TutorialPage} from "../tutorial/tutorial";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  account: {
    username: string, password: string
  } = {
    username: 'examplename', password: ''
  };

  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

  }

  doLogin() {
    this.navCtrl.push(TutorialPage);
  }

}
