import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {Storage} from '@ionic/storage';
import {MenuController, NavController, Platform} from '@ionic/angular';

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
        private menuCtrl: MenuController
    ) {

    }

    ngOnInit() {
        this.menuCtrl.enable(false);
    }

    loginWithFacebook(){

        if(this.platform.is('cordova')){
            this.fb.login(['public_profile', 'email'])
                .then((res: FacebookLoginResponse) => {

                    this.fb.api('me?fields=id,name,email', []).then(data => {

                        let input = {
                            id: data.id,
                            email: data.email
                        };

                        this.storage.set('sportSpirit.userLogged', input);

                        this.navCtrl.navigateRoot('/home');

                    });

                })
                .catch(e => console.log('Error logging into Facebook', e));
        }
        else{
            let input = {
                id: '1234567890',
                email: '123@123.com'
            };

            this.storage.set('sportSpirit.userLogged', input);

            this.navCtrl.navigateRoot('/home');
        }

    }

}
