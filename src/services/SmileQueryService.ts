import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./AuthenticationService";
import {NavController} from "ionic-angular";
import {WelcomePage} from "../pages/welcome/welcome";
@Injectable()
export class SmileQueryService {

  private questionaireUrl = "http://localhost:8080/questionaire";

  constructor(private http: Http,
              private authenticationService: AuthenticationService,) {

  }

  getQuestionaire(): Observable<any> {
    let token = this.authenticationService.getToken();
    return this.http.get(this.questionaireUrl, {headers: this.buildAuthHeader(token)}).map((response: Response) => {
      if (response.status == 200) {
        console.log("Status 200");
        console.log(response);
        return response.json();
      } else {
        console.log("Status != 200");
        console.log(response);
        return false;
      }
    }).catch((error: any) => {
      console.log("Error");
      console.log(error);
      return Observable.throw(error)
    })
  }


  buildAuthHeader(token: string) {
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }
}
