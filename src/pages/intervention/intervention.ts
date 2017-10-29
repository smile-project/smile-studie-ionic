import {Component, OnInit} from "@angular/core";
import {NavController, ToastController} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {InterventionActionPage} from "../intervention-action/intervention-action";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {TranslateService} from "@ngx-translate/core";
import {TermsPage} from "../terms/terms";
import {NativeStorage} from "@ionic-native/native-storage";
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";
@Component({
  selector: 'intervention-page',
  templateUrl: 'intervention.html'
})
export class InterventionPage implements OnInit {

  alertTime: string;
  alertActive: boolean;

  interventionReadyTime: boolean;
  userGroup: number;

  alertDate: Date;
  nextInterventionDate: Date;
  nextQuestionaireDate: Date;

  infoText: string;
  notificationTitle: string;
  notificationText: string;


  constructor(private navCtrl: NavController,
              private smileQueryService: SmileQueryService,
              private localNotifications: LocalNotifications,
              private translateService: TranslateService,
              private nativeStorage: NativeStorage,
              private toastCtrl: ToastController) {
    this.translateService.get(['NOTIFICATION_TITLE', 'NOTIFICATION_TEXT']).subscribe(values => {
      this.notificationTitle = values['NOTIFICATION_TITLE'];
      this.notificationText = values['NOTIFICATION_TEXT'];
    })
  }

  ngOnInit(): void {
    this.getLocalstorageValues();
  }

  /**
   * Load all values from nativeStorage and do some stuff when all is ready.
   */
  getLocalstorageValues() {
    let observable = new Observable(observer => {
      let doneAmount = 0;
      this.nativeStorage.getItem('alertActive').then(value => {
        this.alertActive = value;
        console.log("loaded alertActive", this.alertActive);

        observer.next("alertActive handled");
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }

      }).catch(() => {
        this.initNotificationActive();

        observer.next("alertActive handled");
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }
      });

      this.nativeStorage.getItem('alertDate').then(value => {
        let date = new Date(value);
        this.handleAlertDate(date);

        observer.next("alertDate handled");
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }

      }).catch(() => {
        this.initAlertDate();

        observer.next("alertDate handled");
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }
      });

      this.nativeStorage.getItem('userGroup').then(value => {
        this.handleUserGroup(value);

        observer.next("userGroup handled");
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }
      });

      // this should always be set if we can get to the interventionpage
      this.nativeStorage.getItem('nextQuestionaireDate').then(value => {
        this.nextQuestionaireDate = new Date(value);

        observer.next("nextQuestionaireDate handled");
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }
      });

      this.smileQueryService.getNextInterventionTime().subscribe(result => {
        console.log('Next interventionTime result');
        console.log(result);
        this.nextInterventionDate = new Date(result);
        let currentDate = new Date();
        let timeHasPassed = currentDate > this.nextInterventionDate;

        console.log("Next intervention at", this.nextInterventionDate);

        if (timeHasPassed) {
          this.interventionReadyTime = true;
        }

        observer.next('nextInterventionTime handled');
        doneAmount += 1;
        console.log("doneAmount is " + doneAmount);
        if (doneAmount == 5) {
          observer.complete();
        }
      }, error => {
        this.smileQueryService.catchErrorHandling(error, this.navCtrl, this.toastCtrl, this.nativeStorage);
      })

    });

    observable.subscribe(Subscriber.create((message) => {
      console.log("Subscriber: " + message);
    }, error => {
      console.log("Subscriber: Error happened: " + error);
    }, () => {
      console.log("Subscriber: observable is done");
      this.getInfoText();
      this.setNotification();
    }));
  }

  initNotificationActive() {
    this.alertActive = true;
    console.log("Initialized alertActive", this.alertActive);
    this.nativeStorage.setItem('alertActive', this.alertActive);
  }

  initAlertDate() {
    let currentDate = new Date();
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    currentDate.setHours(17);
    this.alertTime = InterventionPage.createISOString(currentDate);
    this.alertDate = currentDate;
    console.log("Initialized alertDate", currentDate);
    this.nativeStorage.setItem('alertDate', this.alertDate.getTime());
  }

  handleAlertDate(date: Date) {
    this.alertTime = InterventionPage.createISOString(date);
    this.alertDate = date;
    console.log("Loaded alertDate", date);
  }

  handleUserGroup(group: number) {
    this.userGroup = group;
    console.log("Loaded userGroup", this.userGroup);
  }

  private static createISOString(date: Date) {
    // i absolutely hate this
    let day = date.getDate() >= 1 && date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) >= 1 && (date.getMonth() + 1 ) <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let hours = date.getHours() >= 0 && date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() >= 0 && date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() >= 0 && date.getSeconds() <= 9 ? "0" + date.getSeconds() : date.getSeconds();

    return date.getFullYear() + "-" + month + "-" + day
      + "T" + hours + ":" + minutes + ":" +
      seconds + "Z";
  }

  getInfoText() {
    console.log("Called getInfoText()");
    if (this.userGroup != 3) {
      this.translateService.get(['INTERVENTION_BUTTON_NORMAL', 'INTERVENTION_BUTTON_NORMAL_END']).subscribe(result => {
        this.infoText = result['INTERVENTION_BUTTON_NORMAL'] + " " + InterventionPage.formatDate(this.nextQuestionaireDate) + " " + result['INTERVENTION_BUTTON_NORMAL_END'];
      });
    } else {
      this.translateService.get(['INTERVENTION_BUTTON_3', 'INTERVENTION_BUTTON_3_END']).subscribe(result => {
        this.infoText = result['INTERVENTION_BUTTON_3'] + " " + InterventionPage.formatDate(this.nextQuestionaireDate) + " " + result['INTERVENTION_BUTTON_3_END'];
      });
    }
  }

  static formatDate(date: Date) {
    return date ? date.getDate().toString() + "." + (date.getMonth() + 1).toString() : "";
  }

  updateAlertActivation() {
    this.nativeStorage.setItem('alertActive', this.alertActive);
    this.setNotification();
  }

  updateAlertTime() {
    let utcDate = new Date(this.alertTime);
    let offset = utcDate.getTimezoneOffset() / 60;
    let gmtDate = new Date(utcDate.getTime() + offset * 60 * 60 * 1000);

    this.alertTime = InterventionPage.createISOString(gmtDate);
    this.alertDate = gmtDate;
    this.nativeStorage.setItem('alertDate', gmtDate.toString());
    console.log('Updated alertDate', gmtDate.getTime());
    this.setNotification();
  }

  setNotification() {
    console.log("setNotification: alertActive && alertDate", this.alertActive, this.alertDate);
    if (this.alertActive && this.alertDate && this.userGroup != 3) {
      console.log("setNotification: Notification will be set!");
      let date = new Date();

      if (date > this.alertDate) {
        let nextDayDate = new Date(this.alertDate.getTime() + 24 * 60 * 60 * 1000);
        console.log("setNotification: old alertDate: ", this.alertDate);
        this.alertDate = nextDayDate;
        console.log("setNotification: next alertDate: ", this.alertDate);
        this.nativeStorage.setItem('alertDate', this.alertDate);
      } else {
        console.log("setNotification: we are not past the date!", date, this.alertDate);
      }

      this.localNotifications.clear(73468);
      this.localNotifications.schedule({
        id: 73468,
        text: this.notificationTitle,
        title: this.notificationText,
        firstAt: this.alertDate,
        every: "day"
      })
    } else {
      console.log("Notification disabled");
      this.localNotifications.clear(73468);
    }
  }

  startIntervention() {
    this.navCtrl.push(InterventionActionPage);
  }

  showInfo() {
    this.navCtrl.push(TermsPage);
  }

}
