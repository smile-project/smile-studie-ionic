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
  redirectTo;

  constructor(private navParams: NavParams,
              private navCtrl: NavController) {
    this.text = navParams.get('text');
    this.title = navParams.get('title');
    this.redirectTo = navParams.get('redirectTo');
  }

  okay() {
    if (this.redirectTo) {
      this.navCtrl.setRoot(this.redirectTo);
    }
    this.navCtrl.setRoot(InterventionPage);
  }
}
