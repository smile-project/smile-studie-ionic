import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {Http, HttpModule} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {RegisterPage} from "../pages/register/register";
import {WelcomePage} from "../pages/welcome/welcome";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {InterventionPage} from "../pages/intervention/intervention";
import {Settings} from "../providers/settings";
import {IonicStorageModule, Storage} from "@ionic/storage";


export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage:Storage){
  return new Settings(storage, {
    alertTime: false,
    alertActive: false
  })
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    WelcomePage,
    TutorialPage,
    InterventionPage
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
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InterventionPage,
    HomePage,
    LoginPage,
    RegisterPage,
    WelcomePage,
    TutorialPage
  ],
  providers: [
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
