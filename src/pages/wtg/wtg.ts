import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
//import { data_gr1 } from '../../data/data';

import * as d3 from 'd3';
/**
 * Generated class for the WtgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wtg',
  templateUrl: 'wtg.html',
})
export class WtgPage {
  param = this.navParams.data;
  title = this.param.titulo;
  index = "grafico_w"+this.param.indice;
  indice_wtg = this.param.index;
  ms = 0;
  rpm1 = 0;

  operacio_hora= 0;
  servicio_hora= 0;
  detenidos_hora= 0;

  operacio_horaporcentaje= ' 0%';
  servicio_horaporcentaje= ' 0%';
  detenidos_horaporcentaje= ' 0%';

  kpi_mtb= '00:00:00';
  kpi_mtbf= '00:00:00';
  kpi_dtpf= '00:00:00';

  data: Observable<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiProvider: ApiProvider,
              public events: Events) {
    console.log(this.param);
    this.data = this.apiProvider.postGrWtg(this.indice_wtg);

    this.cargarDatos();
  }

  cargarDatos(){
      this.data.subscribe(
        (data) => { // Success
          this.apiProvider.grafico = data;
            console.log(this.apiProvider.grafico);
            this.events.publish('grafico:portafolio');
            this.indicadores();
        },
        (error) =>{
          console.error(error);
        }
      )
  }
  indicadores(){
    this.kpi_mtb= this.apiProvider.grafico['mtbi'];
    this.kpi_mtbf= this.apiProvider.grafico['mtbf'];
    this.kpi_dtpf= this.apiProvider.grafico['dtpf'];
    var horas = this.apiProvider.grafico['horas']
    this.operacio_hora = parseInt(horas['ag_ok']);
    this.servicio_hora = parseInt(horas['ag_servicio']);
    var detenido = parseInt(horas['ag_parados']);
    var sincom = parseInt(horas['ag_sincomm']);
    this.detenidos_hora = detenido + sincom;
    var total = horas['ag_total'];
    var p_o = parseInt(((this.operacio_hora /total)*100).toFixed(0));
    var p_s = parseInt(((this.servicio_hora /total)*100).toFixed(0));
    var p_d = parseInt(((this.detenidos_hora /total)*100).toFixed(0));
    this.operacio_horaporcentaje = ' '+ p_o.toString() +'%';
    this.servicio_horaporcentaje = ' '+ p_s.toString() +'%';
    this.detenidos_horaporcentaje = ' '+ p_d.toString() +'%';

    this.rpm1 = this.apiProvider.grafico['rpm'];
    var d = this.apiProvider.grafico['energia'];
    var viento = 0;
    for (let i = 0; i < d.length; i++) {
        if(i >= d.length - 6){
            viento = viento + d[i]["valor3"];
        };
        };
    this.ms = parseInt(viento.toFixed(0));
  }

}
