import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

import { Observable } from 'rxjs/Observable';

import * as d3 from 'd3';
/**
 * Generated class for the AerogeneradorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aerogenerador',
  templateUrl: 'aerogenerador.html',
})
export class AerogeneradorPage {
  //Las variables que se visualiza en el interfaz
  param = this.navParams.data;
  operacion = 0;
  servicio = 0;
  detenidos = 0;
  sin_comunicacion = 0;

  operacion_porcentaje = ' (0%)';
  servicio_porcentaje = ' (0%)';
  detenidos_porcentaje = ' (0%)';
  sin_comunicacion_porcentaje = ' (0%)';
  // fin de las variables de visualización

  // Cambie el top de 20 a 100 para visualizar más grande el pieChart

  margin = {top: 5, right: 20, bottom: 30, left: 50};
  width: number;
  height: number;
  radius: number;
  sum: number;

	data: any[] = [];

  data_wtg: Observable<any>;

  arc: any;
  arcPath: any;
  labelArc: any;
  pie: any;
  color: any;
  svg: any;

  constructor(public navParams: NavParams,
              public apiProvider: ApiProvider,) {
      this.width = 600 - this.margin.left - this.margin.right ;
      this.height = 332 - this.margin.top - this.margin.bottom;
      this.radius = Math.min(this.width, this.height) / 2;

      console.log(this.param);
      if(this.param['nivel'] == 'portafolio'){
        this.data_wtg = this.apiProvider.postPortafolio_InfoWtg();
        this.cargarDatos();
      }else if(this.param['nivel'] == 'parque'){
        this.data_wtg = this.apiProvider.postParque_InfoWtg(this.param['indice']);
        this.cargarDatos();
      };
  }
  cargarDatos(){
    this.data_wtg.subscribe(
      (data) => { // Success
        this.data  = data;
        this.initSvg();
        this.drawPie();
        this.drawOthers();
        this.indicadores();
      },
      (error) =>{
        console.error(error);
      }
    )
  }
  ngOnInit() {
  }
  indicadores(){
    console.log(this.data);
    this.operacion = parseInt(this.data[0]['value']);
    this.servicio = parseInt(this.data[1]['value']);
    this.detenidos = parseInt(this.data[2]['value']);
    this.sin_comunicacion = parseInt(this.data[3]['value']);
    var total = 0;
    var d = this.data
    for (let i = 0; i < d.length; i++) {
      total += d[i]['value'];
    };
    var p_o = parseInt(((this.operacion /total)*100).toFixed(0));
    var p_s = parseInt(((this.servicio /total)*100).toFixed(0));
    var p_d = parseInt(((this.detenidos /total)*100).toFixed(0));
    var p_sc = parseInt(((this.sin_comunicacion /total)*100).toFixed(0));
    this.operacion_porcentaje = ' ('+ p_o.toString() +'%)';
    this.servicio_porcentaje = ' ('+ p_s.toString() +'%)';
    this.detenidos_porcentaje = ' ('+ p_d.toString() +'%)';
    this.sin_comunicacion_porcentaje = ' ('+ p_sc.toString() +'%)';
  }
  initSvg() {

        var size = 150;
        var element = document.getElementById("pieChart");
        var d3Container = d3.select(element),
            distance = 2, // reserve 2px space for mouseover arc moving
            radius = (size/2) - distance;

        var aux = 0;
        this.data.forEach(function(d) {
          aux += d.value;

        });

        this.sum = aux;
        var container = d3Container.append("svg");

        this.svg = container
            .attr('class', 'd3-donut')
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox','0 0 '+Math.min(this.width,this.height)+' '+Math.min(this.width,this.height))
            .append("g")
            .attr("transform", "translate(" + Math.min(this.width,this.height) / 2 + "," + Math.min(this.width,this.height) / 2 + ")");

        this.pie = d3.pie()
            .sort(null)
            .startAngle(Math.PI)
            .endAngle(3 * Math.PI)
            .value((d: any) => d.value);

        this.arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius / 1.35);

  }

  drawPie() {
        let arcGroup = this.svg.selectAll(".arc")
            .data(this.pie(this.data))
            .enter().append("g")
            .attr("class", "arc");
        this.arcPath = arcGroup.append("path").attr("d",this.arc)
            .style("fill", function (d) {
                return d.data.color;
            });

        var aux_arc = this.arc;
        this.arcPath.transition().delay(function(d, i) {
                return i * 500;
            })
            .duration(500)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return aux_arc(d);
                };
            });


        this.svg.append('text')
            .attr('class', 'text-muted')
            .attr('class', 'half-donut-total')
            .attr('text-anchor', 'middle')
            .attr('dy', 26)
            .style('fill', 'rgb(114, 159, 181)')
            .style('font-size', '24px')
            .text('Total');

        this.svg.append('text')
            .attr('class', 'half-donut-count')
            .attr('text-anchor', 'middle')
            .attr('dy', 0)
            .style('font-size', '34px')
            .style('font-weight', 500);

        var aux = this.sum;

        this.svg.select('.half-donut-count')
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .tween("text", function(d) {
                var node = this;
                var i = d3.interpolate(node.textContent, aux);

                return function(t) {
                    node.textContent = d3.format(",d")(Math.round(i(t)));
                };
            })
            .style('fill', '#0A77B6');
  }
  drawOthers(){
    var div_ = d3.selectAll("#espacio_pie")
              .append("div")
              .attr("id", "tooltip2")
              .style("opacity", 0);

    this.arcPath.on('mouseover', function(d){
      var div_3 = d3.select("#tooltip2");

      var tem;
          tem = "<div class='text-center letra_D container-fluid'style='box-shadow: 5px 5px 10px #999; background-color:#FCB415;width:90px; height:48px;' >" +
                          "<p class='content-center no-margin'><span style='font-size:12px !important; color: white !important; font-weight: bold !important;'>"+d.data.status +"</span><br><span style='font-size:11px !important; font-weight: bold !important; color: black !important'>"+d.data.value +" %</span></p>" +
                      "</div>";
      var mouse_x = d3.mouse(this)[0];
      var mouse_y = d3.mouse(this)[1];
        //  if(mouse_x > - 100){mouse_x = mouse_x - 50};
        if(mouse_x< 6.333){ mouse_x = 162.044};
        if(mouse_y< 300){mouse_y = 230};

      //console.log(this.width.animVal.value,mouse_x);
      div_3.style('display','block');
      div_3.transition()
          .duration(500)
          .style("opacity", 0);
      div_3.transition()
          .duration(200)
          .style("opacity", 0.9);
      div_3.html(tem)
          .style("position","absolute")
          .style("left", mouse_x + "px")
          .style("top", mouse_y + "px");

    });
  }
}
