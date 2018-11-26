import { Injectable } from '@angular/core';
import {Events, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';

@Injectable({
    providedIn: 'root'
})
export class TrackingService {

    private id: number;

    private tracking: boolean = false;
    private bgGeo: any;

    constructor(
        private platform: Platform,
        private storage: Storage,
        private events: Events,
        private backgroundMode: BackgroundMode
    ) {

        this.platform.ready().then(() => {

            this.storage.get('sportSpirit.trackingData').then((data: any) => {

                if(data && data.id){
                    this.id = data.id;
                    this.trackingData = data;
                }
                else{
                    this.getTrackingId();
                }

            });

            this.backgroundMode.setDefaults({
                title: 'SportSpirit',
                text: "App is active",
                icon: 'ic_stat_icon',
                color: '808080' // hex format like 'F14F4D'
            });

            if(this.platform.is('cordova')){

                this.bgGeo = (<any>window).BackgroundGeolocation;

                this.bgGeo.configure({
                    locationProvider: this.bgGeo.ACTIVITY_PROVIDER,
                    desiredAccuracy: this.bgGeo.HIGH_ACCURACY,
                    stationaryRadius: 2,
                    distanceFilter: 2,
                    notificationTitle: 'SportSpirit',
                    notificationText: 'GPS tracking ON',
                    debug: false,
                    startOnBoot: false,
                    stopOnTerminate: false,
                    interval: 10000,
                    fastestInterval: 2000,
                    activitiesInterval: 10000,
                    stopOnStillActivity: true,
                    pauseLocationUpdates: false,
                    saveBatteryOnBackground: false
                });

                this.bgGeo.on('location', (location) => {

                    this.bgGeo.startTask((taskKey) => {

                        this.addCoordinates(location);

                        this.bgGeo.endTask(taskKey);
                    });
                });

                this.bgGeo.on('start', function(location) {
                    console.log('[INFO] START');
                });

                this.bgGeo.on('stop', function(location) {
                    console.log('[INFO] STOP');
                });
            }

        })
    }

    private getTrackingId(){
        this.storage.get('sportSpirit.activities').then((data: any) => {
            if(data && data.length){
                this.id = Number(data[data.length -1].id) + 1;
            }
            else{
                this.id = 1;
            }
            
        })
    }

    private prevCoords: any = {};
    private trackingData: any = {
        distance: 0,
        average: 0
    };

    private numberOfPoints = 0;
    private totalSpeed = 0;

    private addCoordinates(location){
        if(location.speed != null && location.speed > 0.2){

            if (!this.prevCoords) {
                this.prevCoords = location;
            }

            let distance = this.calculateDistance(this.prevCoords, location);

            if(!isNaN(distance)){

                this.numberOfPoints++;
                this.totalSpeed += location.speed;

                this.trackingData.distance += distance;
                this.trackingData.average = (this.totalSpeed/this.numberOfPoints*3.6);

                this.events.publish('setDistance', {
                    distance: this.trackingData.distance,
                    average: this.trackingData.average
                });

                this.prevCoords = location;

                let input = {
                    id: this.id,
                    latitude: location.latitude,
                    longitude: location.longitude
                };

                this.coordinates.push(input);

                this.storage.set('sportSpirit.trackingData', this.trackingData);
            }

        }
    }

    private coordinates: any = [];

    resetData() {

        this.coordinates = [];

        this.trackingData = {
            average: 0,
            distance: 0
        };

        this.numberOfPoints = 0;
        this.prevCoords = {};
        this.totalSpeed = 0;

    }

    startTracking(){

        if(!this.tracking){

            this.tracking = true;

            if(this.platform.is('cordova')){
                this.bgGeo.start();
            }

            this.backgroundMode.enable();

        }

    }

    pauseTracking(){
        if(this.platform.is('cordova')){
            this.bgGeo.stop();
        }
    }

    stopTracking(upload){

        this.tracking = false;

        if(this.platform.is('cordova')){
            this.bgGeo.stop();
        }

        this.backgroundMode.disable();

        if(upload){
            this.storeCoordinates();
        }
        else{
            this.resetData();
        }

    }

    private storeCoordinates(){

        let input = {
            id: this.id,
            coordinates: this.coordinates,
            distance: this.trackingData.distance,
            average: this.trackingData.average
        };

        this.events.publish('storeDistance', input);

        this.resetData();
    }

    rad(x) {
        return x * Math.PI / 180;
    };

    calculateDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.latitude - p1.latitude);
        var dLong = this.rad(p2.longitude - p1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return (d/1000); // returns the distance in miles
    }
}
