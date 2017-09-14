import {Component, OnInit, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {MdProgressBar} from "@angular/material";
@Component({
  selector: 'questionaire-page',
  templateUrl: 'questionaire.html'
})
export class QuestionairePage implements OnInit {

  @ViewChild('slides')
  slides: Slides;

  loadProgress: number;

  questionaire: {
    title: string,
    description: string,
    pages: any[]
  };

  constructor(public navCtr: NavController, public navParams: NavParams, public translateService: TranslateService) {

  }

  ngOnInit() {
    console.log("Received params:");
    console.log(this.navParams.get("questionaire"));
    this.questionaire = this.navParams.get('questionaire');

    this.slides.lockSwipes(true);
    this.slides.direction = 'vertical';

    this.loadProgress = 10;
  }

  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.loadProgress += 10;
    this.slides.lockSwipes(true);
  }

}
