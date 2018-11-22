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
    { path: 'login', loadChildren: './login/login.module#LoginPageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

    constructor(private platform: Platform, private storage: Storage, private navCtrl: NavController){
        this.platform.ready().then(() => {
            this.storage.get('sportSpirit.userLogged').then((data) => {

                if(data && data.id){
                    this.navCtrl.navigateRoot('/home');
                }
                else{
                    this.navCtrl.navigateRoot('/login');
                }

            })
        })
    }
}
