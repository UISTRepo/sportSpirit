import { Injectable } from '@angular/core';
import {Events} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class TimerService {

    private timerInterval;
    private timerStarted: boolean = false;
    private workoutStarted: boolean = false;

    private timer: any = {
        seconds: 0,
        minutes: 0,
        hours: 0
    };

    constructor(private events: Events) {

    }

    getVariables(){
        return {
            timer: this.timer,
            timerStarted: this.timerStarted,
            workoutStarted: this.workoutStarted,
        }
    }

    start(){

        this.startCount();

        this.workoutStarted = true;
        this.timerStarted = true;

    }

    pause(timerStarted){

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
            console.log('save the DATA');
        }

        this.reset();

    }

    reset(){

        this.timer = {
            seconds: 0,
            minutes: 0,
            hours: 0
        };

        this.workoutStarted = false;
        this.timerStarted = false;

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
