import {Component} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {NavController} from "ionic-angular";
import {TutorialPage} from "../tutorial/tutorial";
@Component({
  selector: 'register-page',
  templateUrl: 'register.html'
})
export class RegisterPage {

  account: {
    username: string, password: string
  } = {
    username: 'examplename', password: ''
  };


  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

  };


  doSignup() {
    this.navCtrl.push(TutorialPage);
  }
}
