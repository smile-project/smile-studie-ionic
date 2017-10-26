import {Component, OnInit, ViewChild} from "@angular/core";
import {
  AlertController,
  Button, List, NavController, NavParams, Slides
} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {InfoPage} from "../info/info";
import {LoadingPage} from "../loading/loading";
import {TranslateService} from "@ngx-translate/core";
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

  loadProgress: number = 0;
  shownProgress: string;

  selectedAnswers: {
    questionaireId: number,
    pageId: number,
    answerId: number,
    valueAnswer: number,
    textAnswer: string
  }[] = [];

  currentSelectedValue: number = null;
  currentTextValue: string = null;
  submittedAlready: boolean;

  questionaire: {
    id: number,
    title: string,
    description: string,
    pages: {
      id: number,
      title: string,
      text: string,
      answers: {
        id: number;
        text: string,
        type: string,
        value: number
      }[]
    }[]
  };


  constructor(public navCtr: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public smileQueryService: SmileQueryService,
              private translateService: TranslateService) {
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
    //this.slides.direction = 'vertical';
    this.updateProgress();
  }

  nextSlide() {
    if (this.slides.isEnd()) {
      //collect last answer and submit
      this.collectAnswer(this.slides.getActiveIndex() - 1);
      return this.submit();
    }

    this.slides.lockSwipes(false);
    this.slides.slideNext();

    this.updateProgress();
    if (this.slides.getActiveIndex() > 1) {
      this.collectAnswer(this.slides.getActiveIndex() - 2);
    }
    this.currentSelectedValue = null;


    this.slides.lockSwipes(true);
  }

  updateProgress() {
    this.loadProgress += 100 / (this.questionaire.pages.length + 1);
    this.shownProgress = String(this.loadProgress);
    this.shownProgress = this.shownProgress.slice(0, 3);
    if (this.shownProgress.charAt(2) === ".") {
      this.shownProgress = this.shownProgress.slice(0, 2);
    }
  }

  isRadioType(index: number) {
    return this.questionaire.pages[index].answers[0].type === 'radio' || this.questionaire.pages[index].answers[0].type === 'radio_text';
  }

  isRadioText(index: number) {
    if (this.questionaire.pages[index].answers[0].type === 'input_number') {
      return false;
    }
    // our currently selected question
    return this.questionaire.pages[index].answers.find((answer) => {
        return answer.value === this.currentSelectedValue;
      }).type === 'radio_text';
  }

  openTextField(answer: any, pageTitle: string) {
    if (answer.type === 'radio_text') {
      let alert = this.alertCtrl.create({
        title: pageTitle,
        subTitle: answer.text,
        inputs: [
          {
            name: 'answer',
            placeholder: 'Deine Antwort'
          }
        ],
        buttons: [{
          text: 'Okay',
          handler: data => {
            if (data.answer !== "") {
              return data.answer;
            } else {
              return false;
            }
          }
        },
          {
            text: 'Abbrechen',
            role: 'cancel',
          }]
      });
      alert.onDidDismiss((data: any, role: string) => {
        //console.log("Received input", data.answer);
        if (data.answer.length > 0 && role !== "cancel") {
          //console.log("input accepted");
          this.currentTextValue = data.answer;
        } else {
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
      answerId: this.isRadioType(index) ? this.questionaire.pages[index].answers.find((answer) => {
        return answer.value === this.currentSelectedValue
      }).id : this.questionaire.pages[index].answers[0].id,
      valueAnswer: this.currentSelectedValue,
      textAnswer: this.isRadioText(index) ? this.currentTextValue : null
    });

  }

  submit() {
    // prevent double submissions
    if (this.submittedAlready) {
      return
    }
    console.log("Entered answers", this.selectedAnswers);
    this.smileQueryService.postQuestionaireAnswer(this.selectedAnswers).subscribe((result) => {
      console.log("Posting result", result);
      // reset user group, since it might have changed after posting a questionaire
      localStorage.removeItem('userGroup');

      if (this.shouldShowDepressionWarning()) {
        this.openDepressionWarningPage();
        return;
      }

      if (this.shouldShowStudyEndPage()) {
        this.openStudyFinishPage();
        return;
      }

      this.navCtr.setRoot(LoadingPage);
    }, error => {
      console.log("Posting error", error);
      this.navCtr.setRoot(LoadingPage);
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
    //TODO maybe link
    //TODO linebreaks and stuff
    //TODO telefonseelsorge call intent
    this.translateService.get(['DEPRESSION_WARN_TITLE', 'DEPRESSION_WARN_DESCRIPTION']).subscribe(values => {
      this.navCtr.setRoot(InfoPage, {
        slides: [{
          title: values['DEPRESSION_WARN_TITLE'],
          description: values['DEPRESSION_WARN_DESCRIPTION']
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
      this.navCtr.setRoot(InfoPage, {
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

        ]
      })
    });
  }

}
