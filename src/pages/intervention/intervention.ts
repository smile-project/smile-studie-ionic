import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Settings} from "../../providers/settings";
import {SmileQueryService} from "../../services/SmileQueryService";
import {AuthenticationService} from "../../services/AuthenticationService";
import {WelcomePage} from "../welcome/welcome";
import {QuestionairePage} from "../questionaire/questionaire";
@Component({
  selector: 'intervention-page',
  templateUrl: 'intervention.html'
})
export class InterventionPage implements OnInit {

  alertTime: string;
  alertActive: boolean;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public setting: Settings,
              public smileQueryService: SmileQueryService,
              public authenticationService: AuthenticationService) {
    //TODO get values from local config
    this.alertTime = new Date().toUTCString();
  }

  ngOnInit(): void {
    this.checkForQuestionaire();
  }

  private checkForQuestionaire() {
    this.smileQueryService.getQuestionaire().subscribe((result) => {
      if (result) {
        console.log("Good result!", result);
        this.openQuestionaire(result);
      } else {
        // Not sure when this happens
        console.log("Bad result!", result);
        this.authenticationService.clearSavedAccount();
        this.navCtrl.setRoot(WelcomePage);
      }
    }, error => {
      // probably 401 unauthorized
      console.log("Error result!", error);
      this.authenticationService.clearSavedAccount();
      this.navCtrl.setRoot(WelcomePage);
    });
  }

  private openQuestionaire(result: any) {
    if(result.id != 0){
      // we have a questionaire!
      console.log("Valid questionaire! Opening page");
      this.navCtrl.setRoot(QuestionairePage, {questionaire: result});
    } else {
      console.log("Empty questionaire found, nothing to do!")
    }
  }

  test() {
    console.log(this.alertTime);
  }
}
