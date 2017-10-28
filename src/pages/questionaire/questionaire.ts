import {Component, OnInit, ViewChild} from "@angular/core";
import {
  AlertController,
  Button, List, NavController, NavParams, Slides, ToastController
} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {InfoPage} from "../info/info";
import {LoadingPage} from "../loading/loading";
import {TranslateService} from "@ngx-translate/core";
import {NativeStorage} from "@ionic-native/native-storage";

export interface Questionaire {
  id: number,
  title: string,
  description: string,
  pages: Page[];
}

export interface Page {
  id: number,
  title: string,
  text: string,
  answers: Answer[]
}

export interface Answer {
  id: number;
  text: string,
  type: string,
  value: number
}

export interface SelectedValues {
  questionaireId: number,
  pageId: number,
  answerId: number,
  valueAnswer: number,
  textAnswer: string
}

@Component({
  selector: 'questionaire-page',
  templateUrl: 'questionaire.html',
})
export class QuestionairePage implements OnInit {

  @ViewChild('slides')
  slides: Slides;
  @ViewChild('nextButton')
  nextButton: Button;

  @ViewChild('list')
  list: List;

  submittedAlready: boolean;

  questionaire: Questionaire;
  selectedAnswers: SelectedValues[] = [];

  currentSelectedValue: number;
  currentTextValue: string;


  alertPlaceholder: string;
  alertOkay: string;
  alertCancel: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private nativeStorage: NativeStorage,
              private alertCtrl: AlertController,
              private smileQueryService: SmileQueryService,
              private translateService: TranslateService) {
    this.translateService.get(['QUESTIONAIRE_ALERT_PLACEHOLDER', 'QUESTIONAIRE_ALERT_OK', 'QUESTIONAIRE_ALERT_CANCEL']).subscribe(values => {
      this.alertPlaceholder = values['QUESTIONAIRE_ALERT_PLACEHOLDER'];
      this.alertOkay = values['QUESTIONAIRE_ALERT_OK'];
      this.alertCancel = values['QUESTIONAIRE_ALERT_CANCEL'];
    })
  }

  ngOnInit() {
    this.questionaire = this.navParams.get('questionaire');
    // sort the id's, because we receive them unsorted from the backend
    this.questionaire.pages.sort((p1, p2) => {
      return p1.id - p2.id
    });
    this.questionaire.pages.forEach((page) => {
      page.answers.sort((a1, a2) => {
        return a1.id - a2.id;
      })
    });

    this.slides.lockSwipes(true);
  }

  nextSlide() {
    if (this.slides.isEnd()) {
      //collect last answer and submit
      this.collectAnswer(this.slides.getActiveIndex() - 1);
      return this.submit();
    }

    this.slides.lockSwipes(false);
    this.slides.slideNext();

    if (this.slides.getActiveIndex() > 1) {
      // collect previous page answer
      this.collectAnswer(this.slides.getActiveIndex() - 2);

      this.currentSelectedValue = null;
      this.currentTextValue = null;

      if (this.questionaire.pages[this.slides.getActiveIndex() - 1].answers[0].type === 'input_text') {
        // this is always 1 for input_text
        this.currentSelectedValue = 1;
      }
    }

    this.slides.lockSwipes(true);
  }

  isRadioType(index: number) {
    return this.questionaire.pages[index].answers[0].type === 'radio' || this.questionaire.pages[index].answers[0].type === 'radio_text';
  }

  isTextType(index: number) {
    if (this.questionaire.pages[index].answers[0].type === 'input_text') {
      return true;
    } else if (this.questionaire.pages[index].answers[0].type === 'input_number') {
      return false;
    } else {
      return this.questionaire.pages[index].answers.find((answer) => {
          return answer.value === this.currentSelectedValue
        }).type === 'radio_text'
    }
  }

  openTextField(answer: any, pageTitle: string) {
    if (answer.type === 'radio_text') {
      let alert = this.alertCtrl.create({
        title: answer.text,
        subTitle: '',
        inputs: [
          {
            name: 'answer',
            placeholder: this.alertPlaceholder
          }
        ],
        buttons: [{
          text: this.alertOkay,
          handler: data => {
            if (data.answer !== "") {
              return data.answer;
            } else {
              return false;
            }
          }
        },
          {
            text: this.alertCancel,
            role: 'cancel',
          }]
      });
      alert.onDidDismiss((data: any, role: string) => {
        console.log("Dismissed alert, received input", data.answer);
        if (data.answer.length > 0 && role !== "cancel") {
          console.log("Dismissed alert, input accepted!");
          this.currentTextValue = data.answer;
        } else {
          this.currentTextValue = null;
          this.currentSelectedValue = null;
        }
      });
      alert.present();
    }
  }

  collectAnswer(index: number) {
    this.selectedAnswers.push({
      questionaireId: this.questionaire.id,
      pageId: this.questionaire.pages[index].id,

      // find the answers id via the selected value, if no radio type its always the first entry
      answerId: this.isRadioType(index) ? this.questionaire.pages[index].answers.find((answer) => {
        return answer.value === this.currentSelectedValue
      }).id : this.questionaire.pages[index].answers[0].id,

      valueAnswer: this.currentSelectedValue,

      textAnswer: this.isTextType(index) ? this.currentTextValue : null
    });

  }

  submit() {
    // prevent double submissions
    if (this.submittedAlready) {
      return;
    }
    console.log("Entered answers", this.selectedAnswers);
    this.smileQueryService.postQuestionaireAnswer(this.selectedAnswers).subscribe((result) => {
      console.log("Posting result", result);

      if (this.shouldShowDepressionWarning()) {
        this.openDepressionWarningPage();
        return;
      }

      if (this.shouldShowStudyEndPage()) {
        this.openStudyFinishPage();
        return;
      }

      this.navCtrl.setRoot(LoadingPage);
    }, error => {
      this.smileQueryService.catchErrorHandling(error, this.navCtrl, this.toastCtrl, this.nativeStorage);
    });
    this.submittedAlready = true;
  }

  shouldShowStudyEndPage() {
    return this.questionaire.id == 7;
  }

  shouldShowDepressionWarning() {
    if (this.questionaire.id == 6) {
      let sum = 0;
      this.selectedAnswers.forEach(selected => {
        sum += selected.valueAnswer;
      });
      if (sum >= 50) {
        return true;
      }
    }
    return false;
  }

  openDepressionWarningPage() {
    this.translateService.get(['DEPRESSION_WARN_TITLE', 'DEPRESSION_WARN_DESCRIPTION',
      'DEPRESSION_WARN_LINK', 'DEPRESSION_WARN_AFTERLINK', 'DEPRESSION_WARN_NUMBER']).subscribe(values => {
      this.navCtrl.setRoot(InfoPage, {
        slides: [{
          title: values['DEPRESSION_WARN_TITLE'],
          description: values['DEPRESSION_WARN_DESCRIPTION'],
          link: values['DEPRESSION_WARN_LINK'],
          afterLink: values['DEPRESSION_WARN_AFTERLINK'],
          phoneNumber: values['DEPRESSION_WARN_NUMBER']
        }],
        redirectTo: LoadingPage
      });
    });
  }

  openStudyFinishPage() {
    this.translateService.get([
      'FINISH_EXPLAIN_1_TITLE',
      'FINISH_EXPLAIN_1_DESCRIPTION',
      'FINISH_EXPLAIN_2_TITLE',
      'FINISH_EXPLAIN_2_DESCRIPTION',
      'FINISH_EXPLAIN_3_TITLE',
      'FINISH_EXPLAIN_3_DESCRIPTION',
      'FINISH_EXPLAIN_4_TITLE',
      'FINISH_EXPLAIN_4_DESCRIPTION',
      'FINISH_EXPLAIN_5_TITLE',
      'FINISH_EXPLAIN_5_DESCRIPTION',
      'FINISH_EXPLAIN_6_TITLE',
      'FINISH_EXPLAIN_6_DESCRIPTION',
      'FINISH_EXPLAIN_7_TITLE',
      'FINISH_EXPLAIN_7_DESCRIPTION'
    ]).subscribe((value) => {
      this.navCtrl.setRoot(InfoPage, {
        slides: [
          {
            title: value['FINISH_EXPLAIN_1_TITLE'],
            description: value['FINISH_EXPLAIN_1_DESCRIPTION']
          },
          {
            title: value['FINISH_EXPLAIN_2_TITLE'],
            description: value['FINISH_EXPLAIN_2_DESCRIPTION']
          },
          {
            title: value['FINISH_EXPLAIN_3_TITLE'],
            description: value['FINISH_EXPLAIN_3_DESCRIPTION']
          },
          {
            title: value['FINISH_EXPLAIN_4_TITLE'],
            description: value['FINISH_EXPLAIN_4_DESCRIPTION']
          },
          {
            title: value['FINISH_EXPLAIN_5_TITLE'],
            description: value['FINISH_EXPLAIN_5_DESCRIPTION']
          },
          {
            title: value['FINISH_EXPLAIN_6_TITLE'],
            description: value['FINISH_EXPLAIN_6_DESCRIPTION']
          },
          {
            title: value['FINISH_EXPLAIN_7_TITLE'],
            description: value['FINISH_EXPLAIN_7_DESCRIPTION']
          },

        ],
        redirectTo: LoadingPage
      })
    });
  }

}
