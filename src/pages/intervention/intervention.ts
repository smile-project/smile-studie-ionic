import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {AuthenticationService} from "../../services/AuthenticationService";
import {WelcomePage} from "../welcome/welcome";
import {QuestionairePage} from "../questionaire/questionaire";
import {InterventionActionPage} from "../intervention-action/intervention-action";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {TranslateService} from "@ngx-translate/core";
import {TermsPage} from "../terms/terms";
@Component({
  selector: 'intervention-page',
  templateUrl: 'intervention.html'
})
export class InterventionPage implements OnInit {

  alertTime: string;
  alertActive: boolean;
  alertDate: Date;
  interventionReadyTime: boolean;
  interventionReadyGroup: boolean;
  userGroup: number;
  infoText: string;

  nextDate: Date;

  //TODO Group 3 no notification
  //TODO text grp3 zentrieren
  //TODO delete grp -1

  //TODO grp 1/2 fragebogen zweite runde datum

  //TODO borders removen am ende der seite: intervention + int
  //TODO revamp all storage and queries

  constructor(public navCtrl: NavController,
              public smileQueryService: SmileQueryService,
              public authenticationService: AuthenticationService,
              private localNotifications: LocalNotifications,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.checkForQuestionaire();
    this.getLocalstorageValues();
  }

  getLocalstorageValues() {
    let active = localStorage.getItem('alertActive');
    let date = localStorage.getItem('alertDate');
    let userGroup = localStorage.getItem('userGroup');

    this.handleNotificationActive(active);
    this.handleAlertTime(date);
    this.handleNextInterventionTime();
    this.handleUserGroup(userGroup);
  }

  private handleNotificationActive(active: string) {
    if (active == 'true') {
      this.alertActive = true;
    } else this.alertActive = active != 'false';
    this.updateAlertActivation();
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

  private handleAlertTime(date: string) {
    if (date) {
      let gmtDate = new Date(date);
      this.alertTime = InterventionPage.createISOString(gmtDate);
      this.alertDate = gmtDate;
      console.log("loaded alertDate", gmtDate);
    } else {
      let newDate = new Date();
      newDate.setSeconds(0);
      newDate.setMinutes(0);
      newDate.setHours(17);
      this.alertTime = InterventionPage.createISOString(newDate);
      this.alertDate = newDate;
      console.log("initialized alertDate", newDate);
      localStorage.setItem('alertDate', newDate.toISOString());
    }
    this.setNotification();
  }


  private handleNextInterventionTime() {
    this.smileQueryService.getNextInterventionTime().subscribe(result => {
      this.nextDate = new Date(result);
      let currentDate = new Date();
      let timeHasPassed = currentDate > this.nextDate;

      console.log("Next intervention at", this.nextDate);

      if (timeHasPassed) {
        this.interventionReadyTime = true;
      }

      // calling these here ensures we have the date ready
      this.getInfoText();
      this.setNotification();
    }, () => {
      // probably 401 authorized
      this.interventionReadyTime = false;
      //this.authenticationService.logoutAndClear();
      this.navCtrl.setRoot(WelcomePage);
    });
  }

  private handleUserGroup(userGroup: string) {
    if (Number(userGroup) > 0) {
      this.interventionReadyGroup = true;
      this.userGroup = Number(userGroup);
      console.log("loaded group", userGroup);

      // calling these so we have them ready
      this.getInfoText();
      this.setNotification();
    } else {
      this.smileQueryService.getInterventionGroup().subscribe(result => {
        if (result > 0) {
          this.interventionReadyGroup = true;
          this.userGroup = result;
          console.log("group gotten from server", result);
          localStorage.setItem('userGroup', result);
          // calling these so we have them ready
          this.getInfoText();
          this.setNotification();
        }
      })
    }
  }

  getInfoText() {
    if (this.userGroup != 3) {
      this.translateService.get('INTERVENTION_BUTTON_' + this.userGroup).subscribe(result => {
        this.infoText = result;
      });
    } else {
      this.translateService.get(['INTERVENTION_BUTTON_3', 'INTERVENTION_BUTTON_3_END']).subscribe(result => {
        this.infoText = result['INTERVENTION_BUTTON_3'] + " " + InterventionPage.formatDate(this.nextDate) + " " + result['INTERVENTION_BUTTON_3_END'];
      });
    }
  }

  static formatDate(date: Date) {
    return date ? date.getDate() + "." + (date.getMonth() + 1) : "";
  }

  updateAlertActivation() {
    localStorage.setItem('alertActive', String(this.alertActive));
    this.setNotification();
  }

  updateAlertTime() {
    let utcDate = new Date(this.alertTime);
    let offset = utcDate.getTimezoneOffset() / 60;
    let gmtDate = new Date(utcDate.getTime() + offset * 60 * 60 * 1000);

    this.alertTime = InterventionPage.createISOString(gmtDate);
    this.alertDate = gmtDate;
    localStorage.setItem('alertDate', gmtDate.toISOString());
    console.log('updated alertDate', gmtDate);
    this.setNotification();
  }

  setNotification() {
    console.log("setNotification: alertactive && alertdate", this.alertActive, this.alertDate);
    if (this.alertActive && this.alertDate && this.userGroup == 3 && this.nextDate) {
      // edge case of group 3 in waiting time
      console.log('setting waiting notification for group 3 during wait week');

      this.localNotifications.clear(73468);
      this.localNotifications.schedule({
        id: 73468,
        text: 'Deine Intervention für heute ist bereit!',
        title: "Smile Studie",
        at: this.nextDate
      });
      return;
    }

    if (this.alertActive && this.alertDate) {
      let date = new Date();

      if (date > this.alertDate) {
        let nextDayDate = new Date(this.alertDate.getTime() + 24 * 60 * 60 * 1000);
        this.alertDate = nextDayDate;
        console.log("updating notification: saved alertDate: ", this.alertDate);
        console.log("updating notification: nextDayDate: ", nextDayDate);
        localStorage.setItem('alertDate', nextDayDate.toISOString());
      } else {
        console.log("updating notification: we are not past that date!");
      }

      this.localNotifications.clear(73468);
      this.localNotifications.schedule({
        id: 73468,
        text: 'Deine Intervention für heute ist bereit!',
        title: "Smile Studie",
        firstAt: this.alertDate,
        every: "day"
      })
    }
  }

  private checkForQuestionaire() {
    this.smileQueryService.getQuestionaire().subscribe((result) => {
      if (result) {
        this.openQuestionaire(result);
      } else {
        // Not sure when this happens
        //this.authenticationService.clearSavedAccount();
        this.navCtrl.setRoot(WelcomePage);
      }
    }, (error) => {
      // probably 401 unauthorized
      // offline case  @todo check error code
      //this.authenticationService.clearSavedAccount();
      this.navCtrl.setRoot(WelcomePage);
    });
  }

  private openQuestionaire(result: any) {
    if (result.id != null) {
      // we have a questionaire!
      this.navCtrl.setRoot(QuestionairePage, {questionaire: result});
    }
  }

  startIntervention() {
    this.navCtrl.push(InterventionActionPage);
  }

  showInfo() {
    if (this.userGroup >= 1 && this.userGroup <= 3) {
      this.translateService.get('GROUP_' + this.userGroup + '_INFO_TEXT').subscribe(result => {
        this.navCtrl.push(TermsPage);
      });
      return;
    }
  }

}
