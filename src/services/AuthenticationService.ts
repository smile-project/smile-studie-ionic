import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {SmileQueryService} from "./SmileQueryService";
import {NativeStorage} from "@ionic-native/native-storage";
import {TranslateService} from "@ngx-translate/core";

/**
 * Created by mss on 02.09.17.
 */

@Injectable()
export class AuthenticationService {

  private authUrl = SmileQueryService.baseUrl + "auth";
  private registerUrl = SmileQueryService.baseUrl + "register";
  private headers = new Headers({'Content-Type': 'application/json'});

  unknownServerError: string;


  constructor(private http: Http,
              private nativeStorage: NativeStorage,
              private translateService: TranslateService) {
    this.translateService.get('SERVER_ERROR').subscribe(value => {
      this.unknownServerError = value;
    })
  }

  login(username: string, password: string): Observable<boolean> {
    console.log("Calling AuthenticationService.login()");
    return this.http.post(this.authUrl, JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        if (response.status == 204) {
          console.log("Login returned 204 -> Wrong password");
          return false;
        }
        let token = response.json() && response.json().token;
        if (token) {
          console.log("Login returned 200 -> Good login, got token");
          return this.nativeStorage.setItem('token', token).then(() => {
            return true;
          });
        } else {
          console.log("Server returned something else than 200 or 204 -> this should never happen");
          Observable.throw(response.statusText);
        }
      }).catch((error: any) => {
        console.log("Server errror. Probably bad connection");
        return Observable.throw(error.json().error || this.unknownServerError)
      });
  }

  register(username: string, password: string): Observable<boolean> {
    console.log("Calling AuthenticationService.register()");
    return this.http.post(this.registerUrl, JSON.stringify({
      username: username,
      password: password
    }), {headers: this.headers})
      .map((response: Response) => {
        if (response.status == 204) {
          console.log("Register returned 204 -> User already exists");
          return false;
        } else if (response.status == 200) {
          console.log("Register returned 200 -> Good register");
          return true;
        } else {
          console.log("Server returned something else than 200 or 204 -> this should never happen");
          Observable.throw(response.statusText);
        }
      }).catch((error: any) => {
        console.log("Server errror. Probably bad connection");
        return Observable.throw(error.json().error || this.unknownServerError)
      });
  }

}
