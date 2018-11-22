import {Component, NgZone} from '@angular/core';
import {AlertController, Events, MenuController} from '@ionic/angular';
import {TimerService} from '../services/timer/timer.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    timer: any = {};

    timerStarted: boolean = false;
    workoutStarted: boolean = false;
    buttonColor: string = 'success';

    constructor(
        private zone: NgZone,
        private events: Events,
        private timerService: TimerService,
        private alertController: AlertController,
        private menuCtrl: MenuController
    ){


    }

    ngOnInit(){
        this.menuCtrl.enable(true);

        this.zone.run(() => {
            this.timer = this.timerService.getData();
        });

        this.events.subscribe('setTimer', (data) => {
            this.zone.run(() => {
                this.timer = data;
            })
        })
    }

    startTimer(){

        this.timerService.start();
        this.buttonColor = 'warning';

        this.zone.run(() => {
            this.workoutStarted = true;
            this.timerStarted = true;
        });

    }

    pauseTimer(){

        this.timerService.pause(this.timerStarted);

        this.zone.run(() => {
            this.timerStarted = !this.timerStarted;
        });

        this.buttonColor = !this.timerStarted ? 'success' : 'warning';

    }

    stopTimer(){

        this.presentAlertConfirm();

    }

    async presentAlertConfirm() {
        const alert = await this.alertController.create({
            header: 'Save current session',
            message: 'Do you like to end the current session?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Save',
                    handler: () => {
                        this.resetTimer();
                    }
                }
            ]
        });

        await alert.present();
    }

    resetTimer(){

        this.timerService.stop(true);

        this.zone.run(() => {
            this.timer = {
                seconds: 0,
                minutes: 0,
                hours: 0
            };

            this.workoutStarted = false;
            this.timerStarted = false;
        });

    }

}
