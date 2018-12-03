import { Injectable } from '@angular/core';
import {AlertController, Events} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {TrackingService} from '../tracking/tracking.service';

@Injectable({
    providedIn: 'root'
})
export class TimerService {

    private timerInterval;
    private timerStarted: boolean = false;
    private workoutStarted: boolean = false;
    private type: number = 0;

    private startTime: any = null;

    private timer: any = {
        seconds: 0,
        minutes: 0,
        hours: 0
    };

    private totalPaused: number = 0;

    constructor(
        private events: Events,
        private tracking: TrackingService,
        private storage: Storage,
        private alertController: AlertController
    ) {
        this.events.subscribe('storeDistance', (data) => {

            data.title = this.createTitle(this.type);
            data.timer = this.timer;
            data.type = this.type;
            data.date = new Date();

            this.presentTitleAlert(data);

        });

    }

    private saveActivity(data){

        this.storage.get('sportSpirit.activities').then((activities: any) => {

            if(activities){
                activities.push(data);
                this.storage.set('sportSpirit.activities', activities);
            }
            else{
                this.storage.set('sportSpirit.activities', [data]);
            }

        });
    }

    private createTitle(type){
        let title = '';

        let today = new Date();

        let hours = today.getHours();

        if(hours >= 5 && hours < 11){
            title += 'Morning ';
        }
        else if(hours >= 11 && hours < 18){
            title += 'Afternoon ';
        }
        else if(hours >= 18 && hours < 22){
            title += 'Evening ';
        }
        else{
            title += 'Night ';
        }

        switch(type){
            case 1:
                title += 'Run';
                break;
            case 2:
                title += 'Ride';
                break;
        }

        return title;
    }

    async presentTitleAlert(activity: any) {
        const alert = await this.alertController.create({
            header: 'Enter Title',
            backdropDismiss: false,
            inputs: [
                {
                    name: 'title',
                    type: 'text',
                    placeholder: 'Enter title',
                    value: activity.title
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    handler: (data) => {

                        if(data.title){
                            activity.title = data.title;
                            this.saveActivity(activity);
                        }
                        else{
                            this.presentTitleAlert(activity);
                        }

                    }
                }
            ]
        });

        await alert.present();
    }

    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        let d = new Date(inputFormat);
        return [pad(d.getFullYear()), pad(d.getMonth()+1), pad(d.getDate())].join('-');
    }

    getVariables(){
        return {
            timer: this.timer,
            timerStarted: this.timerStarted,
            workoutStarted: this.workoutStarted,
            type: this.type
        }
    }

    start(type){

        this.type = type;

        this.startCount();

        this.startTime = new Date();

        this.tracking.startTracking();

        this.workoutStarted = true;
        this.timerStarted = true;

    }

    private pauseTime: any;

    pause(timerStarted){

        this.tracking.pauseTracking(timerStarted);

        if(timerStarted){
            this.pauseTime = new Date();
            clearInterval(this.timerInterval);
        }
        else{
            let miliseconds: number = new Date().getTime() - this.pauseTime.getTime();
            this.totalPaused += miliseconds;

            this.startCount();
        }

        this.timerStarted = !this.timerStarted;

    }

    stop(saveData){

        clearInterval(this.timerInterval);

        if(saveData){
            this.tracking.stopTracking(true);
        }

        this.reset();

    }

    reset(){

        this.startTime = null;

        this.timer = {
            seconds: 0,
            minutes: 0,
            hours: 0
        };

        this.totalPaused = 0;

        this.workoutStarted = false;
        this.timerStarted = false;
        this.type = 0;

    }

    private startCount(){

        this.timerInterval = setInterval(() => {
            this.timer.seconds++;

            if(this.timer.seconds == 60){
                this.timer.seconds = 0;
                this.timer.minutes++;
            }

            if(this.timer.minutes == 60){
                this.timer.minutes = 0;
                this.timer.hours++;
            }

            this.events.publish('setTimer', this.timer);

        }, 1000);
    }

    recalculateTimer(){

        let miliseconds: number = new Date().getTime() - this.startTime.getTime();

        let seconds = (miliseconds - this.totalPaused)/1000;

        let minutes = seconds / 60;
        seconds = seconds % 60;

        let hours = minutes / 60;
        minutes = minutes % 60;

        this.timer.seconds = Math.floor(seconds);
        this.timer.minutes = Math.floor(minutes);
        this.timer.hours = Math.floor(hours);

    }

}
