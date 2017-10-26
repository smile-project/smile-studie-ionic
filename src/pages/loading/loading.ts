import {Component, OnInit} from "@angular/core";
import {SmileQueryService} from "../../services/SmileQueryService";
import {NavController} from "ionic-angular";
import {QuestionairePage} from "../questionaire/questionaire";
import {InterventionPage} from "../intervention/intervention";
@Component({
  selector: 'loading-page',
  templateUrl: 'loading.html'
})
export class LoadingPage implements OnInit {

  constructor(private smileQueryService: SmileQueryService,
              private navCtrl: NavController) {
  }

  //TODO quokka logo statt text

  ngOnInit() {
    this.smileQueryService.getQuestionaire().subscribe(result => {
      if (result && result.id != null) {
        this.navCtrl.setRoot(QuestionairePage, {questionaire: result});
      } else {
        this.navCtrl.setRoot(InterventionPage);
      }
    })
  }

}
