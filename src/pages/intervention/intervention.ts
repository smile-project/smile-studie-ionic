import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Settings} from "../../providers/settings";
@Component({
  selector: 'intervention-page',
  templateUrl: 'intervention.html'
})
export class InterventionPage {
  alertTime: string;
  alertActive: boolean;

  constructor(public navCtrl: NavController, public translateService: TranslateService, public setting: Settings) {
    //TODO get values from local config
    this.alertTime = new Date().toUTCString();
  }



  test(){
    console.log(this.alertTime);
  }
}
