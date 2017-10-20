import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {InterventionPage} from "../intervention/intervention";
@Component({
  selector: 'info-page',
  templateUrl: 'info.html'
})
export class InfoPage {

  text: string;

  constructor(private navParams: NavParams,
              private navCtrl: NavController) {
    this.text= navParams.get('text');
  }

  //TODO text fixen

  okay() {
    this.navCtrl.setRoot(InterventionPage);
  }
}
