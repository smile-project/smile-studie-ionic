import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {NativeStorage} from "@ionic-native/native-storage";
import {TranslateService} from "@ngx-translate/core";
import {NavController, ToastController} from "ionic-angular";
import {WelcomePage} from "../pages/welcome/welcome";

@Injectable()
export class SmileQueryService {

  public static baseUrl = "http://192.168.178.30:8080/";
  private questionaireUrl = SmileQueryService.baseUrl + "questionaire";
  private questionaireAnswerUrl = SmileQueryService.baseUrl + "answer";
  private interventionAnswerUrl = SmileQueryService.baseUrl + "intervention";
  private interventionGroupUrl = SmileQueryService.baseUrl + "interventionGroup";
  private nextInterventionTimeUrl = SmileQueryService.baseUrl + "nextIntervention";

  unknownServerError: string;
  relogError: string;

  constructor(private http: Http,
              private nativeStorage: NativeStorage,
              private translateService: TranslateService) {
    translateService.get(['SERVER_ERROR', 'RELOG_ERROR']).subscribe(values => {
      this.unknownServerError = values['SERVER_ERROR'];
      this.relogError = values['RELOG_ERROR'];
    })
  }

  getQuery(url: string): Observable<any> {
    return new Observable(observer => {
      this.nativeStorage.getItem('token').then(token => {
        let header = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
        this.http.get(url, {headers: header}).map(SmileQueryService.sendFunction)
          .catch(this.catchFunction).subscribe(response => {
          observer.next(response);
          observer.complete();
        }, error => {
          observer.error(error);
          observer.complete();
        });
      });
    });
  }

  postQuery(url: string, body) {
    return new Observable(observer => {
      this.nativeStorage.getItem('token').then(token => {
        let header = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
        this.http.post(url, body, {headers: header}).map(SmileQueryService.sendFunction)
          .catch(this.catchFunction).subscribe(response => {
          observer.next(response);
          observer.complete();
        }, error => {
          observer.error(error);
          observer.complete();
        });
      })
    });
  }

  getInterventionGroup(): Observable<any> {
    return this.getQuery(this.interventionGroupUrl);
  }


  getQuestionaire() {
    return this.getQuery(this.questionaireUrl);
  }

  postInterventionAnswer(body) {
    return this.postQuery(this.interventionAnswerUrl, body);
  }

  postQuestionaireAnswer(body) {
    return this.postQuery(this.questionaireAnswerUrl, body);
  }

  getNextInterventionTime() {
    return this.getQuery(this.nextInterventionTimeUrl);
  }

  private static sendFunction(response: Response) {
    if (response.status == 200) {
      console.log("Query has status 200", response);
      try {
        return response.json();
      } catch (err) {
        console.log("Query has status 200 but empty body", response);
        return true;
      }
    } else {
      console.log("Query has a status != 200", response);
      return false;
    }
  }

  private catchFunction(error) {
    console.log("Query returned error", error);
    try {
      let errorStatus = error.json().status;
      console.log("Error could be parsed", errorStatus);
      if (errorStatus == 401) {
        console.log("Token is not valid anymore -> relog necessary");
        return Observable.throw(errorStatus);
      } else {
        console.log("Weird server error, it should only return 401!");
        return Observable.throw(errorStatus + " " + error.json().message);
      }
    } catch (err) {
      console.log("Error could NOT be parsed, must be unreachable");
      return Observable.throw(this.unknownServerError);
    }
  }

  public catchErrorHandling(error, navCtrl: NavController, toastCtrl: ToastController, nativeStorage: NativeStorage) {
    console.log("catchErrorHandling()");
    console.log(error);
    if (error == 401) {
      console.log("Token invalid -> clear all data and ask user to relog");
      toastCtrl.create({
        message: this.relogError,
        duration: 3000
      }).present();
      console.log("Clearing storage and switching to WelcomePage");
      nativeStorage.clear().then(() => {
        navCtrl.setRoot(WelcomePage);
      });
    } else {
      console.log("Either server can't be reached or unknown error, printing toast");
      let message = error.startsWith('undefined') ? this.unknownServerError : error;
      toastCtrl.create({
        message: message,
        duration: 3000
      }).present();
    }
  }

}
