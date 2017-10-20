import {Component, OnInit} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {NavController, ToastController} from "ionic-angular";
import {TutorialPage} from "../tutorial/tutorial";
import {AuthenticationService} from "../../services/AuthenticationService";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
@Component({
  selector: 'register-page',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {

  registrationForm: FormGroup;

  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public authenticationService: AuthenticationService,
              public toastCtrl: ToastController,
              private screenOrientation: ScreenOrientation) {
    try {
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    } catch (error) {
    }
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  };

  ngOnInit() {
    this.registrationForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    })
  }

  doSignup() {
    if (this.registrationForm.valid) {
      this.authenticationService.register(this.registrationForm.get('email').value, this.registrationForm.get('password').value).subscribe(result => {
        if (result) {
          //registration successful, get an auth token by logging in
          this.authenticationService.login(this.registrationForm.get('email').value, this.registrationForm.get('password').value).subscribe(result => {
            if (result) {
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
  }

  showError(error: string) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 3000
    });
    toast.present();
  }
}
