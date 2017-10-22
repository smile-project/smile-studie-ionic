import {Component, OnInit, ViewChild} from "@angular/core";
import {NavController, Slides} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {InterventionPage} from "../intervention/intervention";
import {TermsPage} from "../terms/terms";
import {InfoPage} from "../info/info";

export interface Slide {
  title: string;
  description: string;
  image: string;
}


@Component({
  selector: 'tutorial-page',
  templateUrl: 'tutorial.html'
})
export class TutorialPage implements OnInit {
  @ViewChild('slider')
  slider: Slides;
  slides: Slide[];

  termsAccepted: boolean;
  wentForward: boolean;

  constructor(public navCtrl: NavController,
              public translateService: TranslateService) {
  }

  ngOnInit() {
    this.translateService.get(["TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
      "TUTORIAL_SLIDE4_TITLE",
      "TUTORIAL_SLIDE4_DESCRIPTION",
      "TUTORIAL_SLIDE5_TITLE",
      "TUTORIAL_SLIDE5_DESCRIPTION",
    ]).subscribe(
      (values) => {
        console.log('Loaded values', values);
        this.slides = [];
      });

    this.slider.lockSwipes(true);
  };

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
    this.navCtrl.setRoot(InterventionPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

}
