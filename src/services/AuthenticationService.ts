import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

/**
 * Created by mss on 02.09.17.
 */

@Injectable()
export class AuthenticationService {
  private authUrl = 'http://localhost:8080/auth';
  private registerUrl = 'http://localhost:8080/register';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.authUrl, JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        if (token) {
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
          return true;
        } else {
          return false;
        }
      }).catch((error: any) =>
        Observable.throw(error.json().error || 'Server error'));
  }

  register(username: string, password: string): Observable<boolean> {
    return this.http.post(this.registerUrl, JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        return response.ok;
      }).catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
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
