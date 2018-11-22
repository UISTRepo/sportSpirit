import {Component, QueryList, ViewChildren} from '@angular/core';

import {ActionSheetController, IonRouterOutlet, MenuController, ModalController, Platform, PopoverController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';

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
        private router: Router,
        public modalCtrl: ModalController,
        private menu: MenuController,
        private actionSheetCtrl: ActionSheetController,
        private popoverCtrl: PopoverController
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

    // active hardware back button
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
}
