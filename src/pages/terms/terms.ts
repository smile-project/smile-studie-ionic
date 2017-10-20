import {Component} from "@angular/core";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
@Component({
  selector: 'terms-page',
  templateUrl: 'terms.html'
})
export class TermsPage {
  constructor(private screenOrientation: ScreenOrientation) {
    try {
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    } catch (error) {
    }
  }
}
