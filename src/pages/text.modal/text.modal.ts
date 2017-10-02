import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
@Component({
  selector: 'text-modal',
  templateUrl: 'text.modal.html'
})
export class TextModal {
  textInput: string;


  constructor(public viewCtrl: ViewController){

  }

  onConfirm() {
    this.viewCtrl.dismiss(this.textInput);
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

}
