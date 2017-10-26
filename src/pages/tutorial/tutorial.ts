import {Component, OnInit, ViewChild} from "@angular/core";
import {NavController, Slides} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {TermsPage} from "../terms/terms";
import {LoadingPage} from "../loading/loading";

export interface Slide {
  title: string;
  description: string;
  image?: string;
}


@Component({
  selector: 'tutorial-page',
  templateUrl: 'tutorial.html'
})
export class TutorialPage implements OnInit {
  @ViewChild('slider')
  slider: Slides;
  slides: Slide[];

  termsAccepted: boolean = true;
  wentForward: boolean;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService) {
  }

  //TODO code cleanup

  ngOnInit() {
    this.translateService.get(
      [
        "TUTORIAL_SLIDE2_TITLE",
        "TUTORIAL_SLIDE2_DESCRIPTION",
        "TUTORIAL_SLIDE3_TITLE",
        "TUTORIAL_SLIDE3_DESCRIPTION",
        "TUTORIAL_SLIDE4_TITLE",
        "TUTORIAL_SLIDE4_DESCRIPTION",
        "TUTORIAL_SLIDE5_TITLE",
        "TUTORIAL_SLIDE5_DESCRIPTION",
        "TUTORIAL_SLIDE6_TITLE",
        "TUTORIAL_SLIDE6_DESCRIPTION",
      ]).subscribe(
      (values) => {
        this.slides = [
          {title: values['TUTORIAL_SLIDE2_TITLE'], description: values['TUTORIAL_SLIDE2_DESCRIPTION']},
          {title: values['TUTORIAL_SLIDE3_TITLE'], description: values['TUTORIAL_SLIDE3_DESCRIPTION']},
          {title: values['TUTORIAL_SLIDE4_TITLE'], description: values['TUTORIAL_SLIDE4_DESCRIPTION']},
          {title: values['TUTORIAL_SLIDE5_TITLE'], description: values['TUTORIAL_SLIDE5_DESCRIPTION']},
          {title: values['TUTORIAL_SLIDE6_TITLE'], description: values['TUTORIAL_SLIDE6_DESCRIPTION']},
        ];
      });

    this.slider.lockSwipes(true);
  };

  continueSwipe() {
    this.slider.slideNext();
  }

  onTermsConfirmation() {
    if (this.termsAccepted) {
      localStorage.setItem('termsAccepted', "true");
      this.slider.lockSwipes(false);
      this.slider.slideNext();
      this.wentForward = true;
    }
  }

  openTerms() {
    this.navCtrl.push(TermsPage, {}, {
      animate: true,
      direction: 'forward'
    })
  }

  startApp() {
    localStorage.setItem('tutorialAccepted', "true");
    this.navCtrl.setRoot(LoadingPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

}
