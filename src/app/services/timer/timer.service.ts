import { Injectable } from '@angular/core';
import {Events} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class TimerService {

    private timerInterval;

    private timer: any = {
        seconds: 0,
        minutes: 0,
        hours: 0
    };

    constructor(private events: Events) {

    }

    getData(){
        return this.timer;
    }

    start(){

        this.startCount();

    }

    pause(timerStarted){

        if(timerStarted){
            clearInterval(this.timerInterval);
        }
        else{
            this.startCount();
        }

    }

    stop(){

        clearInterval(this.timerInterval);

        console.log('save the DATA');

        this.reset();

    }

    reset(){

        this.timer = {
            seconds: 0,
            minutes: 0,
            hours: 0
        };

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
