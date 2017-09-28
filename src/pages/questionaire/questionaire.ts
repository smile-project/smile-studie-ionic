import {Component, OnInit, ViewChild} from "@angular/core";
import {Button, NavController, NavParams, Slides, ToastController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {SmileQueryService} from "../../services/SmileQueryService";
@Component({
  selector: 'questionaire-page',
  templateUrl: 'questionaire.html'
})
export class QuestionairePage implements OnInit {

  @ViewChild('slides')
  slides: Slides;

  @ViewChild('nextButton')
  nextButton: Button;

  loadProgress: number = 0;
  shownProgress: string;

  selectedAnswers: {
    pageId: number,
    answerId: number,
    value: number
  }[] = [];
  currentSelectedValue: number = null;

  questionaire: {
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
              public translateService: TranslateService,
              public toastCtr: ToastController,
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
    this.slides.direction = 'vertical';
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

  collectAnswer(index: number) {
    this.selectedAnswers.push({
      pageId: this.questionaire.pages[index].id,
      answerId: this.questionaire.pages[index].answers.find((answer) => {
        return answer.value === this.currentSelectedValue
      }).id,
      value: this.currentSelectedValue
    });
  }

  submit() {
    console.log("Entered answers", this.selectedAnswers);
    this.smileQueryService.postQuestionaireAnswer(this.selectedAnswers).subscribe((result) => {
      console.log("Posting result", result);
    }, error => {
      console.log("Posting error", error);
    });
  }
}
