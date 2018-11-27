import { Injectable } from '@angular/core';
import {Events} from '@ionic/angular';
import {TrackingService} from './tracking/tracking.service';
import {Storage} from '@ionic/storage';

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

    constructor(
        private events: Events,
        private tracking: TrackingService,
        private storage: Storage
    ) {
        this.events.subscribe('storeDistance', (data) => {
            data.timer = this.timer;
            data.type = this.type;

            this.storage.get('sportSpirit.activities').then((activities: any) => {

                if(activities){
                    activities.push(data);
                    this.storage.set('sportSpirit.activities', activities);
                }
                else{
                    this.storage.set('sportSpirit.activities', [data]);
                }

            });
        })
    }

    getVariables(){
        return {
            timer: this.timer,
            timerStarted: this.timerStarted,
            workoutStarted: this.workoutStarted,
            type: this.type
        }
    }

    recalculateTimer(){

        let miliseconds: number = new Date().getTime() - this.startTime.getTime();

        let seconds = miliseconds / 1000;

        let minutes = seconds / 60;
        seconds = seconds % 60;

        let hours = minutes / 60;
        minutes = minutes % 60;

        this.timer.seconds = Math.floor(seconds);
        this.timer.minutes = Math.floor(minutes);
        this.timer.hours = Math.floor(hours);

    }

    start(type){

        this.type = type;

        this.startCount();

        this.tracking.startTracking();

        this.startTime = new Date();

        this.workoutStarted = true;
        this.timerStarted = true;

    }

    pause(timerStarted){

        this.tracking.pauseTracking(timerStarted);

        if(timerStarted){
            clearInterval(this.timerInterval);
        }
        else{
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
}
