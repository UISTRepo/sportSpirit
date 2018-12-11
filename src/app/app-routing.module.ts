import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NavController, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
    },
    {
        path: 'list',
        loadChildren: './list/list.module#ListPageModule'
    },
    { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule' },
  { path: 'activity/:id', loadChildren: './activity/activity.module#ActivityPageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

    constructor(private platform: Platform, private storage: Storage, private navCtrl: NavController){
        this.platform.ready().then(() => {
            this.storage.get('sportSpirit.userId').then((data) => {

                if(data){
                    this.navCtrl.navigateRoot('/home');
                }
                else{
                    this.navCtrl.navigateRoot('/login');
                }

            })
        })
    }
}
