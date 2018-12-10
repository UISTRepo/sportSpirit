import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {Storage} from '@ionic/storage';
import {MenuController, NavController, Platform} from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    constructor(
        private fb: Facebook,
        private storage: Storage,
        private navCtrl: NavController,
        private platform: Platform,
        private menuCtrl: MenuController,
        private afAuth: AngularFireAuth
    ) {

    }

    ngOnInit() {
        this.menuCtrl.enable(false);
    }

    loginWithFacebook(){

        if(this.platform.is('cordova')){
            this.fb.login(['public_profile', 'email'])
                .then((res: FacebookLoginResponse) => {

                    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);

                    firebase.auth().signInWithCredential(facebookCredential)
                      .then(user => {
                        this.storage.set('sportSpirit.userId', user.uid);
                        this.navCtrl.navigateRoot('/home');
                      });

                })
                .catch(e => console.log('Error logging into Facebook', e));
        }
        else{

          this.afAuth.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(res => {
              this.storage.set('sportSpirit.userId', res.user.uid);
              this.navCtrl.navigateRoot('/home');
            });
        }

    }

}
