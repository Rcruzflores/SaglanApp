import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { data } from '../../data/data';

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
  operacion= 71;
  servicio= 12;
  detenidos= 8;
  sin_comunicacion= 5;

  operacion_porcentaje= ' (65%)';
  servicio_porcentaje= ' (20%)';
  detenidos_porcentaje= ' (10%)';
  sin_comunicacion_porcentaje= ' (2%)';
  // fin de las variables de visualización

  // Cambie el top de 20 a 100 para visualizar más grande el pieChart

  margin = {top: 100, right: 20, bottom: 30, left: 50};
  width: number;
  height: number;
  radius: number;
  sum: number;

  arc: any;
  arcPath: any;
  labelArc: any;
  pie: any;
  color: any;
  svg: any;

  constructor() {
      this.width = 600 - this.margin.left - this.margin.right ;
      this.height = 332 - this.margin.top - this.margin.bottom;
      this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnInit() {
      this.initSvg();
      this.drawPie();
      this.drawOthers();
  }
  initSvg() {

        var size = 150;
        var element = document.getElementById("pieChart");
        var d3Container = d3.select(element),
            distance = 2, // reserve 2px space for mouseover arc moving
            radius = (size/2) - distance;

        var aux = 0;
        data.forEach(function(d) {
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
            .data(this.pie(data))
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

      this.arcPath.on('mouseover', function(d) {
                     console.log(d.value);
                 });

  }
}
