import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavController} from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

    activities: any;
    uid: string;

    constructor(
        private storage: Storage,
        private navCtrl: NavController,
        private db: AngularFirestore
    ) {

    }

    ngOnInit() {

      this.storage.get('sportSpirit.userId').then(uid => {
        this.uid = uid;
        this.activities = this.db.collection('users').doc(this.uid).collection('activities', ref => ref.orderBy('date','desc')).valueChanges();
      });
    }

    delete(slidingItem, item){
      slidingItem.close();
      this.db.collection('users').doc(this.uid).collection('activities').doc(item.id).delete();
    }

}
