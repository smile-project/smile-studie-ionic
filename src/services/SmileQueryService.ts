import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./AuthenticationService";

@Injectable()
export class SmileQueryService {

  private baseUrl = "http://10.176.86.255:8080/";
  private questionaireUrl = this.baseUrl + "questionaire";
  private questionaireAnswerUrl = this.baseUrl + "answer";

  constructor(private http: Http,
              private authenticationService: AuthenticationService,) {

  }

  getQuestionaire(): Observable<any> {
    let token = this.authenticationService.getToken();
    return this.http.get(this.questionaireUrl, {headers: this.buildAuthHeader(token)}).map(this.sendFunction)
      .catch(this.catchFunction)
  }

  postQuestionaireAnswer(body): Observable<any> {
    let token = this.authenticationService.getToken();
    return this.http.post(this.questionaireAnswerUrl, body, {headers: this.buildAuthHeader(token)}).map(this.sendFunction)
      .catch(this.catchFunction);
  }

  sendFunction(response: Response) {
    if (response.status == 200) {
      console.log("Status 200", response);
      return response.json() || null;
    } else {
      console.log("Status != 200", response);
      return false;
    }
  }

  catchFunction(error) {
    console.log("Error", error);
    return Observable.throw(error)
  }


  buildAuthHeader(token: string) {
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }
}
