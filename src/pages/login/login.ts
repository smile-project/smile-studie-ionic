import {Component, OnInit} from "@angular/core";
import {NavController, ToastController} from "ionic-angular";
import {TranslateService} from '@ngx-translate/core';
import {TutorialPage} from "../tutorial/tutorial";
import {AuthenticationService} from "../../services/AuthenticationService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ScreenOrientation} from "@ionic-native/screen-orientation";


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public authenticationService: AuthenticationService,
              public toastCtrl: ToastController,
              private screenOrientation: ScreenOrientation) {
    try {
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    } catch (error) {
    }
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    })
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe(result => {
          if (result) {
            this.navCtrl.push(TutorialPage)
          } else {
            this.showError(this.loginErrorString);
          }
        }, error => {
          this.showError(error);
        })
    }
  }

  showError(error: string) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 3000
    });
    toast.present();
  }
}
