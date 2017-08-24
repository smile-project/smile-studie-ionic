import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InterventionPage} from "../intervention/intervention";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    //TODO: mit server checken was es zu tun gibt, ggf questionaire anzeigen, falls nicht intervention screen
    if(true){
      this.navCtrl.push(InterventionPage);
    }
  }

}
