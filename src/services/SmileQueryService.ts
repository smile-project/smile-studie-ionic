import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./AuthenticationService";

@Injectable()
export class SmileQueryService {

  private baseUrl = "http://10.176.86.255:8080/";
  private questionaireUrl = this.baseUrl + "questionaire";
  private questionaireAnswerUrl = this.baseUrl + "answer";
  private interventionAnswerUrl = this.baseUrl + "intervention";
  private interventionGroupUrl = this.baseUrl + "interventionGroup";

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  getInterventionGroup(): Observable<any> {
    return this.http.get(this.interventionGroupUrl, {headers: this.buildAuthHeader()}).map(this.sendFunction)
      .catch(this.catchFunction)
  }

  getQuestionaire(): Observable<any> {
    return this.http.get(this.questionaireUrl, {headers: this.buildAuthHeader()}).map(this.sendFunction)
      .catch(this.catchFunction)
  }

  postInterventionAnswer(body): Observable<any> {
    return this.http.post(this.interventionAnswerUrl, body, {headers: this.buildAuthHeader()}).map(this.sendFunction)
      .catch(this.catchFunction)
  }

  postQuestionaireAnswer(body): Observable<any> {
    return this.http.post(this.questionaireAnswerUrl, body, {headers: this.buildAuthHeader()}).map(this.sendFunction)
      .catch(this.catchFunction);
  }

  sendFunction(response: Response) {
    if (response.status == 200) {
      console.log("Status 200", response);
      try {
        return response.json();
      } catch (err) {
        // json parse error in case the body is empty
      }
      return true;
    } else {
      console.log("Status != 200", response);
      return false;
    }
  }

  catchFunction(error) {
    console.log("Error", error);
    return Observable.throw(error)
  }


  buildAuthHeader() {
    let token = this.authenticationService.getToken();
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }
}
