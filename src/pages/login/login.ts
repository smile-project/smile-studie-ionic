import {Component} from "@angular/core";
import {NavController, ToastController} from "ionic-angular";
import {TranslateService} from '@ngx-translate/core';
import {TutorialPage} from "../tutorial/tutorial";
import {AuthenticationService} from "../../services/AuthenticationService";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  account: {
    username: string, password: string
  } = {
    username: '', password: ''
  };

  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public authenticationService: AuthenticationService,
              public toastCtrl: ToastController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

  }

  doLogin() {
    console.log(this.account);
    this.authenticationService.login(this.account.username, this.account.password)
      .subscribe(result => {
        if (result){
          this.navCtrl.push(TutorialPage)
        } else {
          this.showError(this.loginErrorString);
        }
      }, error => {
        this.showError(error);
      })
  }

  showError(error: string) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 3000
    });
    toast.present();
  }
}
