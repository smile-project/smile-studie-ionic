import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {SmileQueryService} from "./SmileQueryService";

/**
 * Created by mss on 02.09.17.
 */

@Injectable()
export class AuthenticationService {

  private authUrl = SmileQueryService.baseUrl + "auth";
  private registerUrl = SmileQueryService.baseUrl + "register";
  private headers = new Headers({'Content-Type': 'application/json'});

  unknownServerError = "Server zur Zeit nicht erreichbar, bitte überprüfe deine Internetverbindung.";

  constructor(private http: Http) {
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.authUrl, JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        if (response.status == 204) {
          // wrong password
          return false;
        }
        let token = response.json() && response.json().token;
        if (token) {
          // good password, login worked
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
          return true;
        } else {
          // 200ish code but neither 204 or 200 -> probably never happens?
          Observable.throw(response.statusText);
        }
      }).catch((error: any) => {
        return Observable.throw(error.json().error || this.unknownServerError)
      });


  }

  register(username: string, password: string): Observable<boolean> {
    // @todo remove tailing spaces (check?)
    return this.http.post(this.registerUrl, JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        return response.status == 200;
      }).catch((error: any) =>
        Observable.throw(error.json().error || this.unknownServerError)
      );
  }


  getToken(): string {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let token = currentUser && currentUser.token;
    return token ? token : "";
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  clearSavedAccount() {
    localStorage.clear();
  }
}
