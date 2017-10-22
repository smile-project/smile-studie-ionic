import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {AuthenticationService} from "../../services/AuthenticationService";
import {WelcomePage} from "../welcome/welcome";
import {QuestionairePage} from "../questionaire/questionaire";
import {InterventionActionPage} from "../intervention-action/intervention-action";
import {LocalNotifications} from "@ionic-native/local-notifications";
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

  constructor(public navCtrl: NavController,
              public smileQueryService: SmileQueryService,
              public authenticationService: AuthenticationService,
              private localNotifications: LocalNotifications) {
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
    } else {
      let newDate = new Date();
      newDate.setSeconds(0);
      newDate.setMinutes(0);
      newDate.setHours(17);
      this.alertTime = InterventionPage.createISOString(newDate);
      this.alertDate = newDate;
      localStorage.setItem('alertDate', newDate.toISOString());
    }
    this.setNotification();
  }


  private handleNextInterventionTime() {
    this.smileQueryService.getNextInterventionTime().subscribe(result => {
      let nextDate = new Date(result);
      let currentDate = new Date();
      let timeHasPassed = currentDate > nextDate;

      if (timeHasPassed) {
        this.interventionReadyTime = true;
      }
    }, error => {
      // probably 401 authorized
      this.interventionReadyTime = false;
      this.authenticationService.clearSavedAccount();
      this.navCtrl.setRoot(WelcomePage);
    });
  }

  private handleUserGroup(userGroup: string) {
    if (Number(userGroup) > 0) {
      this.interventionReadyGroup = true;
    } else {
      this.smileQueryService.getInterventionGroup().subscribe(result => {
        if (result > 0) {
          this.interventionReadyGroup = true;
          localStorage.setItem('userGroup', result);
        }
      })
    }
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
    this.setNotification();
  }

  setNotification() {
    if (this.alertActive && this.alertDate) {
      let date = new Date();

      if (date > this.alertDate) {
        let nextDayDate = new Date(this.alertDate.getTime() + 24 * 60 * 60 * 1000);
        this.alertDate = nextDayDate;
        localStorage.setItem('alertDate', nextDayDate.toISOString());
      }

      this.localNotifications.clear(73468);
      this.localNotifications.schedule({
        id: 73468,
        text: 'Deine Intervention für heute ist bereit!',
        title: "Smile Studie",
        //TODO icon doesn't work :(
        firstAt: this.alertDate,
        every: "day"
      })
    }
  }

  // studienende
  //TODO testen ob neue serverlogik geht

  // general
  //TODO timer anpassen für beta test

  // group 3
  //TODO erklärung falls man grp 3 ist
  //TODO notification für eine woche gruppe 3

  // erklärungen
  //TODO erklärung warum button disabled ist


  private checkForQuestionaire() {
    this.smileQueryService.getQuestionaire().subscribe((result) => {
      if (result) {
        this.openQuestionaire(result);
      } else {
        // Not sure when this happens
        this.authenticationService.clearSavedAccount();
        this.navCtrl.setRoot(WelcomePage);
      }
    }, error => {
      // probably 401 unauthorized
      this.authenticationService.clearSavedAccount();
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


}
