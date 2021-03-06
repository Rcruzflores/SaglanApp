import { Component, OnInit, Input } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';

import { data_gr1 } from '../../data/data';
import { Events } from 'ionic-angular';

import * as d3 from 'd3';
/**
 * Generated class for the GraficoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'grafico',
  templateUrl: 'grafico.html'
})
export class GraficoComponent {

  margin = {top: 55, right: 50, bottom: 20, left: 25};
  width: number;
  height: number;
  @Input() div_id: string;
  @Input() div_class: string;
  datos: any[] = [];
  x: any;
  y: any;
  svg: any;
  line: any;
  area: any;

  constructor(public events: Events,
              public apiProvider: ApiProvider,){
      this.width = 400 - this.margin.left - this.margin.right ;
      this.height = 300 - this.margin.top - this.margin.bottom;
      events.subscribe('grafico:portafolio', () => {
        this.init_grafico();
      });
  }

  ngOnInit() {
  }

  init_grafico() {
    this.initSvg();
    this.drawGrid();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
    this.drawArea();
    this.drawOthers();
  }
  // El eje y
  initSvg() {
        d3.select('svg').remove();
        this.datos = this.apiProvider.grafico['energia'];
        //console.log(data_gr1);
        var container = d3.select("#"+this.div_id).append("svg");
        this.svg = container
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox','5 10 339 310')
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


        var lg = this.svg.append("defs").append("linearGradient")
              .attr("id", "mygrad")//id of the gradient
              .attr("x1", "10%")
              .attr("x2", "0%")
              .attr("y1", "60%")
              .attr("y2", "100%");
            lg.append("stop")
              .attr("offset", "0%")
              .style("stop-color", "#B0BEC5")
              .style("stop-opacity", 0.5);

            lg.append("stop")
              .attr("offset", "70%")
              .style("stop-color", "#B0BEC5")//start in blue
              .style("stop-opacity", 0);

  }
  // el eje x
  initAxis() {
    this.datos.forEach(function(d) {
                d.hora = new Date(d.hora);
                d.valor = +d.valor;
          });
    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.x.domain(d3.extent(this.datos, (d) => d.hora ));
    this.y.domain(d3.extent(this.datos, (d) => d.valor ));

  }
  drawAxis() {
    var locale = d3.timeFormatLocale({
        "dateTime": "%a %b %e %X %Y",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        "shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
        "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        });

    var formatMillisecond = locale.format(".%L"),
        formatSecond = locale.format(":%S"),
        formatMinute = locale.format("%I:%M"),
        formatHour = locale.format("%I %p"),
        formatDay = locale.format("%a %d"),
        formatWeek = locale.format("%b %d"),
        formatMonth = locale.format("%B"),
        formatYear = locale.format("%Y");

    function multiFormat(date) {
          return (d3.timeSecond(date) < date ? formatMillisecond
              : d3.timeMinute(date) < date ? formatSecond
              : d3.timeHour(date) < date ? formatMinute
              : d3.timeDay(date) < date ? formatHour
              : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
              : d3.timeYear(date) < date ? formatMonth
              : formatYear)(date);
        };
    this.svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x)
              .ticks(6).tickFormat(multiFormat));

  }
  drawLine() {
    this.line = d3.line()
        .curve(d3.curveNatural)
        .x( (d: any) => this.x(d.hora) )
        .y( (d: any) => this.y(d.valor) );

    this.svg.append("path")
        .datum(this.datos)
        .attr("class", "line")
        .attr("d", this.line)
        .style ("fill", "none")
        .style ("stroke", "#B0BEC5")
        .style ("stroke-width", "1px");
  }
  drawArea() {
    var lg = this.svg.append("defs").append("linearGradient")
              .attr("id", "mygrad")
              .attr("x1", "25%")
              .attr("x2", "25%")
              .attr("y1", "76%")
              .attr("y2", "110%");
        lg.append("stop")
              .attr("offset", "0%")
              .style("stop-color", "#B0BEC5")
              .style("stop-opacity", 0.5);

        lg.append("stop")
              .attr("offset", "70%")
              .style("stop-color", "#B0BEC5")
              .style("stop-opacity", 0);
    this.area = d3.area()
        .curve(d3.curveNatural)
        .x( (d: any) => this.x(d.hora) )
        .y0(this.height)
        .y1( (d: any) => this.y(d.valor) );

    this.svg.append("path")
        .datum(this.datos)
        .attr("class", "area")
        .attr("d", this.area)
        .style("fill","url(#mygrad)");
  }
  drawGrid(){

        var y = d3.scaleLinear().range([this.height, 0]);
            y.domain(d3.extent(this.datos, (d) => d.valor ));
        function make_y_gridlines() {
            return d3.axisLeft(y)
        }
        var s_g = this.svg.append("g");
            // add the Y gridlines
           s_g.attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-this.width)
            )
  }
  drawOthers(){
    //puntero
    /*var puntero = this.svg.append("circle")
                          .attr("class","puntero")
                          .attr("r", 3.5)
                          .attr("id", "dot_1")
                          .style("fill", "#fff")
                          .style("stroke", "#f62a00")
                          .style("stroke-width", 2)
                          .style("opacity", 0);
    */
     var simplePoint = this.svg.append("circle")
                         .attr("cx", 0)
                         .attr("cy", 0)
                         .attr("r", 5)
                         .attr("id", "dot_1")
                         .style("fill", "#FCB415")
                         .style("opacity", 0);

     var hoverLineGroup = this.svg.append("g")
                .attr("id", "hover-line-");

     var hoverLine = hoverLineGroup
                .append("line")
                .attr("id", "h-line-")
                .attr("y1", 0)
                .attr("y2", this.height)
                .style('fill', 'none')
                .style('stroke', 'rgb(222, 156, 82)')
                .style('stroke-width', '1.5px')
                .style('pointer-events', 'none')
                .style('shape-rendering', 'crispEdges')
                .style("opacity", 0);


      var div_ = d3.select("#grafico_e")
                .append("div")
                .attr("id", "tooltip")
                .attr("class", "tooltip")
                .style("opacity", 0);
    //funciones de tooltip
     var tipBox = this.svg.append('rect')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('opacity', 0)
                .on('mousemove', drawTooltip)
                .on('mouseout', removeTooltip);
    var x = this.x;
    var y = this.y;
    var data = this.datos;

    function removeTooltip() {
        var div_t = d3.select('#tooltip')
                  .transition()
                  .duration(1500)
                  .style("opacity", 0)
                  .style("display", "none");
        var dot = d3.select("#dot_1").style("opacity", 0);
        var line = d3.select("#h-line-").style("opacity", 0);
        };

    function drawTooltip() {
        var div_3 = d3.select('#tooltip');
        var line = d3.select("#h-line-");
        var dot = d3.select("#dot_1");
        var bisectDate = d3.bisector((d: any) => d.hora ).left;
        var formatValueT = d3.timeFormat("%H:%M%p");

       var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.hora > d1.hora - x0 ? d1 : d0;
            dot.style("opacity", 1)
               .attr("transform", "translate(" + x(d.hora) + "," + y(d.valor) + ")");
        /*
        var por = this.width.animVal.value/data_gr.length;
        var aux = d3.mouse(this)[0]/por;
            aux = Number(aux.toFixed(0));
            */

        line.style("opacity", 1)
              .attr("transform", "translate(" + x(d.hora) + ")");
        var tem;
            tem = "<div class='text-center letra_D container-fluid'style='box-shadow: 5px 5px 10px #999; background-color:#FCB415;width:90px; height:48px;' >" +
                            "<p class='content-center no-margin' style='padding-top: 8px !important;'><p style='font-size:13px !important; color: white !important; font-weight: bold !important; margin-bottom: -3px;'>"+d.valor.toFixed(2) +" MWh</p><p style='font-size:12px !important; font-weight: bold !important; color: black !important; margin-top: -1px;'>"+formatValueT(d.hora) +"</p></p>" +
                        "</div>";

        var mouse_x = d3.mouse(this)[0];
             if(mouse_x > this.width.animVal.value - 100){mouse_x = mouse_x - 50};

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
            .style("top", d3.mouse(this)[1] - 50 + "px");
    };

  }

}
