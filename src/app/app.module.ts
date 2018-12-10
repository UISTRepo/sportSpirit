import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';
import {Facebook} from '@ionic-native/facebook/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';



const config = {
  apiKey: "AIzaSyBFpX0x4JdIhr7hLmiVUe8OjdOnsZs8LIo",
  authDomain: "sportspirit-ad61a.firebaseapp.com",
  databaseURL: "https://sportspirit-ad61a.firebaseio.com",
  projectId: "sportspirit-ad61a",
  storageBucket: "sportspirit-ad61a.appspot.com",
  messagingSenderId: "308921384710"
};

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(config),
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Facebook,
        BackgroundMode,
        Diagnostic,
        OpenNativeSettings
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
