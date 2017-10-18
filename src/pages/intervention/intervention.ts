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
    let time = localStorage.getItem('alertTime');
    let nextIntervention = localStorage.getItem('nextIntervention');
    let userGroup = localStorage.getItem('userGroup');

    this.handleNotificationActive(active);
    this.handleAlertTime(time);
    this.handleNextInterventionTime(nextIntervention);
    this.handleUserGroup(userGroup);
  }

  private handleNotificationActive(active: string) {
    if (active == 'true') {
      this.alertActive = true;
    } else if (active == 'false') {
      this.alertActive = false;
    } else {
      // unitialized
      this.alertActive = true;
      this.updateAlertActivation();
    }

  }

  private createISOString(date: Date) {
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

  private handleAlertTime(time: string) {
    if (time) {
      // get the hours of the time and set it to
      // the next alarm time
      let savedTime = new Date(time);
      let currentTime = new Date();
      this.alertTime = this.createISOString(savedTime);
    } else {
      // uninitialized -> today 17:00
      //TODO next day if past 17
      //TODO what happens if next day has no intervention (group 3)
      let newDate = new Date();
      newDate.setHours(17);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      this.alertTime = this.createISOString(newDate);
      this.updateAlertTime();
    }
  }

  private handleNextInterventionTime(nextIntervention: string) {
    if (nextIntervention) {
      let nextDate = new Date(Number(nextIntervention));
      let currentDate = new Date();
      let timeHasPassed = currentDate > nextDate;

      if (timeHasPassed) {
        this.interventionReadyTime = true;
      }
    } else {
      this.smileQueryService.getNextInterventionTime().subscribe(result => {
        localStorage.setItem('nextIntervention', result);
        let nextDate = new Date(result);
        let currentDate = new Date();
        let timeHasPassed = currentDate > nextDate;

        if (timeHasPassed) {
          this.interventionReadyTime = true;
        }
      })
    }
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
    let updatedDate = new Date(this.alertTime);
    updatedDate.getUTCHours();
    updatedDate.getUTCMinutes();

    localStorage.setItem('alertTime', this.alertTime);
    this.setNotification();
  }

  setNotification() {
    if (this.alertActive && this.alertTime) {
      this.localNotifications.clear(73468);
      this.localNotifications.schedule({
        id: 73468,
        text: 'Deine Intervention für heute ist bereit!',
        title: "Smile Studie",
        //TODO icon doesn't work :(
        icon: "https://smile-studie.de/static/images/favicon.ico",
        at: new Date(this.alertTime)
      })
    }
  }

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
