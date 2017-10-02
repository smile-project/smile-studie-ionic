import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {TutorialPage} from "../tutorial/tutorial";
@Component({
  selector: 'terms-page',
  templateUrl: 'terms.html'
})
export class TermsPage{

  constructor(public navCtrl: NavController){

  }

  back(){
    this.navCtrl.setRoot(TutorialPage);
  }
}
