import {Component, OnInit, ViewChild} from "@angular/core";
import {
  AlertController,
  Button, List, NavController, NavParams, Slides
} from "ionic-angular";
import {SmileQueryService} from "../../services/SmileQueryService";
import {InterventionPage} from "../intervention/intervention";
import {InfoPage} from "../info/info";
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
              public smileQueryService: SmileQueryService) {
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
    return this.questionaire.pages[index].answers[0].type === 'radio';
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
            placeholder: 'Your answer'
          }
        ],
        buttons: [{
          text: 'Confirm',
          handler: data => {
            if (data.answer !== "") {
              return data.answer;
            } else {
              return false;
            }
          }
        },
          {
            text: 'Cancel',
            role: 'cancel',
          }]
      });
      alert.onDidDismiss((data: any, role: string) => {
        console.log("Received input", data.answer);
        if (data.answer.length > 0 && role !== "cancel") {
          console.log("input accepted");
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
      if (this.shouldShowDepressionWarning()) {
        this.navCtr.setRoot(InfoPage, {
          text: "Depression warning string"
        });
        return;
      }
      this.navCtr.setRoot(InterventionPage);
    }, error => {
      console.log("Posting error", error);
      this.navCtr.setRoot(InterventionPage);
    });
    this.submittedAlready = true;
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
}
