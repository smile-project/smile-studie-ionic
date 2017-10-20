import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {LoginPage} from "../pages/login/login";
import {Http, HttpModule} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {RegisterPage} from "../pages/register/register";
import {WelcomePage} from "../pages/welcome/welcome";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {InterventionPage} from "../pages/intervention/intervention";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {AuthenticationService} from "../services/AuthenticationService";
import {SmileQueryService} from "../services/SmileQueryService";
import {QuestionairePage} from "../pages/questionaire/questionaire";
import {TermsPage} from "../pages/terms/terms";
import {InterventionActionPage} from "../pages/intervention-action/intervention-action";

import {LocalNotifications} from '@ionic-native/local-notifications';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {InfoPage} from "../pages/info/info";


export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TermsPage,
    RegisterPage,
    WelcomePage,
    TutorialPage,
    InfoPage,
    InterventionPage,
    QuestionairePage,
    InterventionActionPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InterventionPage,
    LoginPage,
    TermsPage,
    RegisterPage,
    WelcomePage,
    TutorialPage,
    QuestionairePage,
    InfoPage,
    InterventionActionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticationService,
    LocalNotifications,
    ScreenOrientation,
    SmileQueryService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
