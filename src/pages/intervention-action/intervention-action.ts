import {Component, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavController} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";

@Component({
  selector: 'intervention-action',
  templateUrl: 'intervention-action.html'
})
export class InterventionActionPage {

  interventionForm: FormGroup;
  renderTime: Date;
  userGroup: number;

  constructor(private navCtrl: NavController,
              private smileQueryService: SmileQueryService) {
    this.interventionForm = new FormGroup({
      'input1': new FormControl('', Validators.required),
      'input2': new FormControl('',),
      'input3': new FormControl('',)
    });

    this.renderTime = new Date();
    this.userGroup = Number(localStorage.getItem('userGroup'));
  }

  submitIntervention() {
    if (this.interventionForm.valid) {
      this.smileQueryService.postInterventionAnswer({
        'answerInput1': this.interventionForm.value.input1,
        'answerInput2': this.interventionForm.value.input2,
        'answerInput3': this.interventionForm.value.input3,
        'submissionDuration': new Date().getTime() - this.renderTime.getTime()
      }).subscribe((result) => {
          if (result) {
            console.log("Good result!", result);
            localStorage.setItem('lastInterventionSubmission', new Date().toISOString());
            this.navCtrl.pop();
          } else {
            console.log("Bad result!", result);
            //TODO something went wrong
          }
        }, error => {
          console.log("Error result!")
          //TODO something went wrong
        }
      )
    }
  }

}
