import {Component, QueryList, ViewChildren} from '@angular/core';

import {
    ActionSheetController, AlertController,
    IonRouterOutlet,
    MenuController,
    ModalController,
    NavController,
    Platform,
    PopoverController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {TimerService} from './services/timer/timer.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'List',
            url: '/list',
            icon: 'list'
        }
    ];

    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private navCtrl: NavController,
        private alertController: AlertController,
        private timer: TimerService
    ) {
        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleBlackTranslucent();
            this.splashScreen.hide();

            this.backButtonEvent();
        });
    }

    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {

            this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
                if (outlet && outlet.canGoBack()) {
                    outlet.pop();

                } else {
                    navigator['app'].exitApp();
                }
            });
        });
    }

    logOut(){
        this.presentLogOutConfirm();
    }

    async presentLogOutConfirm() {
        const alert = await this.alertController.create({
            header: 'Log out',
            message: 'Are you sure that you want to log out?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.timer.stop(false);
                        this.navCtrl.navigateRoot('/login');

                    }
                }
            ]
        });

        await alert.present();
    }
}
