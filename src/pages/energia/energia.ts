import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
/**
 * Generated class for the EnergiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-energia',
  templateUrl: 'energia.html',
})
export class EnergiaPage {
  param = this.navParams.data;
  MWh:number = 0;
  MWh2:number = 0;
  porcentaje= 0+"%";
  data: Observable<any>;
	datos_gr: any[] = [];

  constructor(public navParams: NavParams,
              public apiProvider: ApiProvider,
              public events: Events) {
    //this.data = this.apiProvider.postGrParque();
    //this.cargarDatos();
      console.log(this.param);
      if(this.param['nivel'] == 'portafolio'){
        this.data = this.apiProvider.postPortafolioEnergia();
        this.cargarDatos();
      }else if(this.param['nivel'] == 'parque'){
        this.data = this.apiProvider.postParqueEnergia(this.param['indice']);
        this.cargarDatos();
      };
  }

  cargarDatos(){
    this.data.subscribe(
      (data) => { // Success
        this.apiProvider.grafico  = data;
        this.events.publish('grafico:portafolio');
        this.calculos();
      },
      (error) =>{
        console.error(error);
      }
    )
  }
  calculos(){
        var data = this.apiProvider.grafico['energia'];
        var sum_energia = 0;
        var sum_energia_posible = 0;
        var sum_energia_total = 0;
        for (let i = 0; i < data.length; i++) {
            if(i >= data.length - 6){
                sum_energia = sum_energia + data[i]["valor"];
                sum_energia_posible = sum_energia_posible + data[i]["valor2"];
            };
            };

        this.MWh = parseFloat(sum_energia.toFixed(2));
        this.MWh2 = parseFloat(sum_energia_posible.toFixed(2));
        this.porcentaje = parseFloat(((sum_energia/sum_energia_posible)*100).toFixed(0)) +"%";

  }
}
