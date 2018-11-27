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
    distance: number = 0;
    average: number = 0;

    timerStarted: boolean;
    workoutStarted: boolean;
    buttonColor: string;

    type: number;

    constructor(
        private zone: NgZone,
        private events: Events,
        private timerService: TimerService,
        private alertController: AlertController,
        private menuCtrl: MenuController
    ){

    }

    private getTimerVariables(){
        this.zone.run(() => {
            let timerVariables = this.timerService.getVariables();

            this.timer = timerVariables.timer;
            this.timerStarted = timerVariables.timerStarted;
            this.workoutStarted = timerVariables.workoutStarted;
            this.type = timerVariables.type;
        });
    }

    ngOnInit(){
        this.menuCtrl.enable(true);

        this.zone.run(() => {

            this.getTimerVariables();

            this.buttonColor = !this.timerStarted ? 'success' : 'warning';

        });

        this.events.subscribe('setTimer', (data) => {
            this.zone.run(() => {
                this.timer = data;
            })
        });

        this.events.subscribe('setDistance', (data: any) => {
            this.zone.run(() => {
                this.distance = data.distance;
                this.average = data.average;
            })
        });
    }

    startTimer(type = null){

        if(type){
            this.zone.run(() => {
                this.type = type;
            });
        }

        if(!this.type){
            this.presentSelectActivityConfirm();
            return;
        }

        this.timerService.start(this.type);
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
            this.buttonColor = !this.timerStarted ? 'success' : 'warning';
        });

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

        this.distance = 0;
        this.average = 0;

        this.type = 0;

        this.getTimerVariables();

    }

    async presentSelectActivityConfirm() {
        const alert = await this.alertController.create({
            header: 'Select activity',
            cssClass: 'activitySelect',
            buttons: [
                {
                    text: 'Running',
                    handler: () => {
                        this.startTimer(1);
                    }
                },
                {
                    text: 'Cycling',
                    handler: () => {
                        this.startTimer(2);
                    }
                }
            ]
        });

        await alert.present();
    }

    selectType(type){
        if(!this.workoutStarted)
            this.type = Number(type);
    }

}
