import {Component} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {NavController, ToastController} from "ionic-angular";
import {TutorialPage} from "../tutorial/tutorial";
import {AuthenticationService} from "../../services/AuthenticationService";
@Component({
  selector: 'register-page',
  templateUrl: 'register.html'
})
export class RegisterPage {

  account: {
    email: string, password: string
  } = {
    email: '', password: ''
  };

  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public authenticationService: AuthenticationService,
              public toastCtrl: ToastController) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

  };


  doSignup() {
    this.authenticationService.register(this.account.email, this.account.password).subscribe(result => {
      if (result) {
        //registration successful, get an auth token by logging in
        this.authenticationService.login(this.account.email, this.account.password).subscribe(result => {
          if (result){
            this.navCtrl.push(TutorialPage);
          }
        })
      } else {
        this.showError(this.signupErrorString);
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
