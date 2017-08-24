import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'questionaire-page',
  templateUrl: 'questionaire.html'
})
export class QuestionairePage {

  constructor(public navCtr: NavController, public navParams: NavParams, public translateService: TranslateService) {

  }

  //TODO build questionaire depending on item in navparams
}
