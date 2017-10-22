import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {InterventionPage} from "../intervention/intervention";
@Component({
  selector: 'info-page',
  templateUrl: 'info.html'
})
export class InfoPage {

  text: string;
  title: string;

  constructor(private navParams: NavParams,
              private navCtrl: NavController) {
    this.text = navParams.get('text');
    this.title = navParams.get('title');
  }

  okay() {
    this.navCtrl.setRoot(InterventionPage);
  }
}
