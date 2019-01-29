import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username:string;
  password:string;

  user_login: Observable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiProvider: ApiProvider,
              public events: Events) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login(){
      var array = [this.username,this.password]
      this.user_login = this.apiProvider.login(array);
      this.user_login.subscribe(
        (data) => { // Success
          this.apiProvider.usuario = data;
          console.log(this.apiProvider.usuario);
          this.events.publish('user:login');
          var params = {'titulo_head':'Portafolio','nivel':'portafolio'}
  				this.navCtrl.setRoot('TabsPage', params);
        },
        (error) =>{
          console.error(error);
        }
      )
  }

}
