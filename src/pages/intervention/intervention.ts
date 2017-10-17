import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Settings} from "../../providers/settings";
import {SmileQueryService} from "../../services/SmileQueryService";
import {AuthenticationService} from "../../services/AuthenticationService";
import {WelcomePage} from "../welcome/welcome";
import {QuestionairePage} from "../questionaire/questionaire";
import {InterventionActionPage} from "../intervention-action/intervention-action";
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
              public authenticationService: AuthenticationService) {

    this.getLocalstorageValues();
  }

  ngOnInit(): void {
    this.checkForQuestionaire();
  }

  getLocalstorageValues() {
    let active = localStorage.getItem('alertActive');
    let time = localStorage.getItem('alertTime');
    let lastIntervention = localStorage.getItem('lastInterventionSubmission');
    let userGroup = localStorage.getItem('userGroup');

    this.handleNotificationActive(active);
    this.handleAlertTime(time);
    this.handleLastInterventionTime(lastIntervention);
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

  private handleAlertTime(time: string) {
    if (time) {
      this.alertTime = time;
    } else {
      // uninitialized

      let newDate = new Date();
      newDate.setHours(17);
      newDate.setMinutes(0);
      this.alertTime = (newDate).toISOString();
      this.updateAlertTime();
    }
  }

  private handleLastInterventionTime(lastIntervention: string) {
    if (lastIntervention) {
      let lastInterventionTime = Date.parse(lastIntervention);
      //TODO check if it is past 17:00 the next day
      this.interventionReadyTime = true;
    } else {
      this.interventionReadyTime = true;
    }
  }

  private handleUserGroup(userGroup: string) {
    if (Number(userGroup) >= 1) {
      console.log('usergroup valid?', userGroup);
      this.interventionReadyGroup = true;
      // we have a group and it is initialized -> all is well
    } else {
      // check our group, it may be > -1 now
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
  }

  updateAlertTime() {
    localStorage.setItem('alertTime', this.alertTime);
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
