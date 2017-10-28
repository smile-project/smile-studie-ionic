import {Component, OnInit} from "@angular/core";
import {SmileQueryService} from "../../services/SmileQueryService";
import {NavController, ToastController} from "ionic-angular";
import {QuestionairePage} from "../questionaire/questionaire";
import {InterventionPage} from "../intervention/intervention";
import {NativeStorage} from "@ionic-native/native-storage";
@Component({
  selector: 'loading-page',
  templateUrl: 'loading.html'
})
export class LoadingPage implements OnInit {

  constructor(private smileQueryService: SmileQueryService,
              private navCtrl: NavController,
              private toastCtrl: ToastController,
              private nativeStorage: NativeStorage) {
  }


  ngOnInit() {
    console.log("Getting new Questionaires");
    this.smileQueryService.getQuestionaire().subscribe(result => {
      if (result.id != null) {
        console.log("Got questionaire " + result.id);
        this.navCtrl.setRoot(QuestionairePage, {questionaire: result});
      } else {
        console.log("No questionaires to do right now, next questionaire time:");
        console.log(result.nextQuestionaireTime);
        //TODO do something with this
        this.getGroup();
      }
    }, error => {
      this.smileQueryService.catchErrorHandling(error, this.navCtrl, this.toastCtrl, this.nativeStorage);
    });
  }

  getGroup() {
    console.log("Getting group since it might have changed");
    this.smileQueryService.getInterventionGroup().subscribe(result => {
      console.log('Group gotten from server:');
      console.log(result);
      this.nativeStorage.setItem('userGroup', result).then(() => {
        this.navCtrl.setRoot(InterventionPage);
      });
    }, error => {
      this.smileQueryService.catchErrorHandling(error, this.navCtrl, this.toastCtrl, this.nativeStorage);
    });
  }
}
