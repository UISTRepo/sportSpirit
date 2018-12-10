import { Component, OnInit } from '@angular/core';

import {ActivatedRoute} from "@angular/router";
import {Storage} from '@ionic/storage';
import {LoadingController} from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var mapboxgl: any;

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

    id: string;
    activity: any;
    map: any;
    activityColor: string;
    //startIcon: string;

    constructor(
        private route: ActivatedRoute,
        private storage: Storage,
        private db: AngularFirestore,
        private loadingController: LoadingController
    ) {
      this.loadData();
    }

    ngOnInit() {

    }

    initMap(){
        this.createMap(this.activity.coordinates);
    }

    async loadData(){
      const loading = await this.loadingController.create({});
      await loading.present();
      this.route.params.subscribe( params => {
          this.id = params.id;
          this.storage.get('sportSpirit.userId').then(uid => {
            this.db.collection('users').doc(uid).collection('activities').doc(this.id).ref.get()
              .then(doc => {
                this.activity = doc.data();
                this.activity.date = this.activity.date.toDate();
                this.activityColor = this.activity.type === 1 ? '#f2d60d' : '#2EAC46';
                let temp = [];
                this.activity.coordinates.forEach(cord => {
                  temp.push([cord.lng,cord.lat]);
                });
                this.activity.coordinates = temp;
                //this.activity.coordinates = [[20.8036, 41.1109],[20.8055,41.1111],[20.8040, 41.1151]];

                if(this.activity.coordinates.length)
                    this.initMap();
                loading.dismiss();
              }).catch(err => {
                loading.dismiss();
                console.log(err);
              });
          });
      });
    }

    private getMidpoint(cords){
        let sx = 0;
        let sy = 0;
        let n = cords.length;
        cords.forEach((cord) => {
            sx+=cord[0]
            sy+=cord[1]
        });
        return [sx/n,sy/n];
    }

    createMap(cords){

        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v9',
            center: this.getMidpoint(cords),
            zoom: 14.5,
            minZoom: 10,
            maxZoom: 16
        });

        this.map.on('load', (event) => {

            let startMarker = new mapboxgl.Marker({color: this.activityColor})
                .setLngLat(cords[0])
                .addTo(this.map);
            let el1: any = document.createElement('img');
            el1.className = 'marker';
            el1.src = this.activity.img;
            el1.style.width = '24px';
            el1.style.position = 'absolute';
            el1.style.left = '2px';
            startMarker.getElement().appendChild(el1);

            let endMarker = new mapboxgl.Marker({color: this.activityColor})
              .setLngLat(cords[cords.length-1])
              .addTo(this.map);
            var el2 = document.createElement('img');
            el2.className = 'marker';
            el2.src = 'assets/img/flag.png';
            el2.style.width = '24px';
            el2.style.position = 'absolute';
            el2.style.left = '2px';
            el2.style.padding = '2px';
            endMarker.getElement().appendChild(el2);

            this.map.addLayer({
                id: 'path',
                type: 'line',
                source: {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features:[{
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "LineString",
                                coordinates: cords
                            }
                        }
                        ]
                    }
                },
                layout: {
                    "line-join": "round",
                    "line-cap": "round"
                },
                paint: {
                    "line-color": this.activityColor,
                    "line-width": 3
                }
            });

        });
    }

}
