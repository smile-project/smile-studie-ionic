import {Component, OnInit} from "@angular/core";
import {NavController, Platform, ToastController} from "ionic-angular";
import {AuthenticationService} from "../../services/AuthenticationService";
import {TutorialPage} from "../tutorial/tutorial";
import {LoadingPage} from "../loading/loading";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {NativeStorage} from "@ionic-native/native-storage";
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  somethingWentTerriblyWrongError: string;
  deviceNotSupportedError: string;

  constructor(public navCtrl: NavController,
              public authenticationService: AuthenticationService,
              private idService: UniqueDeviceID,
              private nativeStorage: NativeStorage,
              private toastCtrl: ToastController,
              private translateService: TranslateService,
              private platform: Platform) {
    this.translateService.get(['UNKNOWN_ERROR', 'DEVICE_NOT_SUPPORTED_ERROR']).subscribe(values => {
      this.somethingWentTerriblyWrongError = values['UNKNOWN_ERROR'];
      this.deviceNotSupportedError = values['DEVICE_NOT_SUPPORTED_ERROR'];
    })
  };

  //TODO check for version update/reinstall

  ngOnInit() {
    console.log("Calling Welcome.ngOnInit()");
    this.platform.ready().then(readySource => {
      if (readySource === 'cordova') {
        console.log("Cordova is ready, checking storage for token!");
        this.checkForToken();
      }
    });
  }

  checkForToken() {
    this.nativeStorage.getItem('token').then(token => {
      console.log("We already have a token!");
      console.log("Token:");
      console.log(token);
      this.nativeStorage.getItem('tutorialAccepted').then(() => {
        console.log("Tutorial was accepted already, moving to LoadingPage");
        this.navCtrl.setRoot(LoadingPage);
      }).catch(() => {
        console.log("tutorialAccepted is not in storage yet, moving to TutorialPage");
        this.navCtrl.setRoot(TutorialPage);
      })
    }).catch(() => {
      console.log("We don't have a token yet, waiting for user input!");
    })
  }

  /**
   * Beware: async gore.
   */
  login() {
    console.log("Calling Welcome.login()");
    let deviceId;
    this.idService.get().then(result => {
      deviceId = result;
      console.log("This device's id:");
      console.log(result);
      this.authenticationService.login(deviceId, deviceId).subscribe(result => {
        if (result) {
          console.log("Login was successful!");
          this.nativeStorage.getItem('tutorialAccepted').then(value => {
            if (value) {
              console.log("Tutorial was accepted already, moving to LoadingPage");
              this.navCtrl.setRoot(LoadingPage);
            } else {
              console.log("Tutorial not done yet, moving to TutorialPage");
              this.navCtrl.setRoot(TutorialPage);
            }
          }).catch(() => {
            console.log("tutorialAccepted is not in storage yet, moving to TutorialPage");
            this.navCtrl.setRoot(TutorialPage);
          });
        } else {
          console.log("Login was unsuccessful, registering device");
          this.register(deviceId);
        }
      }, error => {
        console.log("Login error, printing toast");
        this.showToast(error);
      })
    }).catch(error => {
        console.log("Can't retrieve UUID error", error);
        this.showToast(this.deviceNotSupportedError);
      }
    );
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).present();
  }

  register(deviceId) {
    console.log('Calling Welcome.register()');
    this.authenticationService.register(deviceId, deviceId).subscribe(result => {
      if (result) {
        console.log("Register was successful, lets try login again");
        this.login();
      } else {
        console.log("Register failed, user already exists. This should never happen, because then login would succeed");
        this.showToast(this.somethingWentTerriblyWrongError);
      }
    }, error => {
      console.log("Register error, printing toast");
      this.showToast(error);
    })
  }
}
