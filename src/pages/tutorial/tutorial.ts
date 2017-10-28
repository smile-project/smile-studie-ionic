import {Component, OnInit, ViewChild} from "@angular/core";
import {NavController, Slides} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {TermsPage} from "../terms/terms";
import {LoadingPage} from "../loading/loading";
import {NativeStorage} from "@ionic-native/native-storage";

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

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              private nativeStorage: NativeStorage) {
  }

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
    this.slider.lockSwipes(false);
    this.slider.slideNext();
  }

  openTerms() {
    this.navCtrl.push(TermsPage)
  }

  startApp() {
    console.log("Tutorial has been accepted! Savinng it to storage");
    this.nativeStorage.setItem('tutorialAccepted', true);
    this.navCtrl.setRoot(LoadingPage);
  }

}
