import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {Http, HttpModule} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {WelcomePage} from "../pages/welcome/welcome";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {InterventionPage} from "../pages/intervention/intervention";
import {IonicStorageModule} from "@ionic/storage";
import {AuthenticationService} from "../services/AuthenticationService";
import {SmileQueryService} from "../services/SmileQueryService";
import {QuestionairePage} from "../pages/questionaire/questionaire";
import {TermsPage} from "../pages/terms/terms";
import {InterventionActionPage} from "../pages/intervention-action/intervention-action";

import {LocalNotifications} from '@ionic-native/local-notifications';
import {InfoPage} from "../pages/info/info";
import {LoadingPage} from "../pages/loading/loading";
import {NativeStorage} from "@ionic-native/native-storage";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";


export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TermsPage,
    WelcomePage,
    LoadingPage,
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
    TermsPage,
    WelcomePage,
    LoadingPage,
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
    NativeStorage,
    UniqueDeviceID,
    SmileQueryService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
