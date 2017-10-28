import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavController, ToastController} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {InterventionPage} from "../intervention/intervention";
import {NativeStorage} from "@ionic-native/native-storage";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'intervention-action',
  templateUrl: 'intervention-action.html'
})
export class InterventionActionPage {

  interventionForm: FormGroup;
  renderTime: Date;
  userGroup: number;

  constructor(private navCtrl: NavController,
              private smileQueryService: SmileQueryService,
              private toastCtrl: ToastController,
              private nativeStorage: NativeStorage,
              private translateService: TranslateService) {
    this.interventionForm = new FormGroup({
      'input1': new FormControl('', Validators.required),
      'input2': new FormControl('',),
      'input3': new FormControl('',)
    });

    this.renderTime = new Date();
    this.nativeStorage.getItem('userGroup').then((value: number) => {
      console.log("Loaded userGroup: ");
      console.log(value);
      this.userGroup = value;
    });
  }

  submitIntervention() {
    if (this.interventionForm.valid) {
      this.smileQueryService.postInterventionAnswer({
        'answerInput1': this.interventionForm.value.input1,
        'answerInput2': this.interventionForm.value.input2,
        'answerInput3': this.interventionForm.value.input3,
        'submissionDuration': new Date().getTime() - this.renderTime.getTime()
      }).subscribe((result) => {
        //this will always be a good result, since we restrict postings in client
        console.log("Intervention answers posted", result);
        this.navCtrl.setRoot(InterventionPage);
      }, error => {
        this.smileQueryService.catchErrorHandling(error, this.navCtrl, this.toastCtrl, this.nativeStorage);
      })
    }
  }

}
