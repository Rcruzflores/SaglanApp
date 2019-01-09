import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { data_gr } from '../../data/data';

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
  index_ =  "#grafico_w"+this.navParams.data.indice;

  km = '50';
  rpm1 = '50';

  operacio_hora= '71';
  servicio_hora= '12';
  detenidos_hora= '5';

  operacio_horaporcentaje= ' 65%';
  servicio_horaporcentaje= ' 20%';
  detenidos_horaporcentaje= ' 2%';

  kpi_mtb= '4 23:55:05';
  kpi_mtbf= '3:38:21';
  kpi_dtpf= '3:38:21';

  margin = {top: 55, right: 50, bottom: 20, left: 25};
  width: number;
  height: number;

  x: any;
  y: any;
  svg: any;
  line: any;
  area: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.width = 400 - this.margin.left - this.margin.right ;
      this.height = 300 - this.margin.top - this.margin.bottom;
  }
  ionViewDidLoad() {
    let TIME_IN_MS = 1000; let hideFooterTimeout = setTimeout( () => {
        this.initSvg();
        this.drawGrid();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
        this.drawArea();
        this.drawOthers();
      }, TIME_IN_MS);
  }
  ngOnInit() {
  }

  initSvg() {
        console.log(this.index_);

        var container = d3.select(this.index_).append("svg");

        this.svg = container
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox','0 0 400 300')
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
              .style("stop-color", "#628da9")
              .style("stop-opacity", 0.5);

            lg.append("stop")
              .attr("offset", "70%")
              .style("stop-color", "#628da9")//start in blue
              .style("stop-opacity", 0);




  }
  initAxis() {
    data_gr.forEach(function(d) {
                d.hora = new Date(d.hora);
                d.valor = +d.valor;
          });
    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.x.domain(d3.extent(data_gr, (d) => d.hora ));
    this.y.domain(d3.extent(data_gr, (d) => d.valor ));

  }
  drawAxis() {
    var locale = d3.timeFormatLocale({
        "dateTime": "%a %b %e %X %Y",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": [" AM", " PM"],
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
        .call(d3.axisBottom(this.x).tickFormat(multiFormat));

  }
  drawLine() {
    this.line = d3.line()
        .x( (d: any) => this.x(d.hora) )
        .y( (d: any) => this.y(d.valor) );

    this.svg.append("path")
        .datum(data_gr)
        .attr("class", "line")
        .attr("d", this.line)
        .style ("fill", "none")
        .style ("stroke", "#729fb5")
        .style ("stroke-width", "2px");
  }
  drawArea() {
    var lg = this.svg.append("defs").append("linearGradient")
              .attr("id", "mygrad")
              .attr("x1", "10%")
              .attr("x2", "0%")
              .attr("y1", "60%")
              .attr("y2", "100%");
        lg.append("stop")
              .attr("offset", "0%")
              .style("stop-color", "#628da9")
              .style("stop-opacity", 0.5);

        lg.append("stop")
              .attr("offset", "70%")
              .style("stop-color", "#628da9")
              .style("stop-opacity", 0);
    this.area = d3.area()
        .x( (d: any) => this.x(d.hora) )
        .y0(this.height)
        .y1( (d: any) => this.y(d.valor) );

    this.svg.append("path")
        .datum(data_gr)
        .attr("class", "area")
        .attr("d", this.area)
        .style("fill","url(#mygrad)");
  }
  drawGrid(){

        var y = d3.scaleLinear().range([this.height, 0]);
            y.domain(d3.extent(data_gr, (d) => d.valor ));
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
     this.svg.append("circle")
        .attr("class","puntero")
        .attr("r", 3.5)
        .attr("id", "dot_1")
        .style("fill", "#fff")
        .style("stroke", "#f62a00")
        .style("stroke-width", 2)
        .style("opacity", 0);

     var hoverLineGroup = this.svg.append("g")
                .attr("id", "hover-line-");
     var hoverLine = hoverLineGroup
                .append("line")
                .attr("id", "h-line-")
                .attr("y1", 0)
                .attr("y2", this.height)
                .style('fill', 'none')
                .style('stroke', 'rgba(222, 156, 82)')
                .style('stroke-width', '1.5px')
                .style('pointer-events', 'none')
                .style('shape-rendering', 'crispEdges')
                .style("opacity", 0);


      var div_ = d3.select(this.index_)
                .append("div")
                .attr("id", "tooltip")
                .attr("class", "tooltip")
                .style("opacity", 0);

     var tipBox = this.svg.append('rect')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('opacity', 0)
                .on('mousemove', drawTooltip)
                .on('mouseout', removeTooltip);

    function removeTooltip() {
        var div_t = d3.select('#tooltip')
                  .transition()
                  .duration(1500)
                  .style("opacity", 0)
                  .style("display", "none");

        var line = d3.select("#h-line-").style("opacity", 0);
        };

    function drawTooltip() {

        var div_3 = d3.select('#tooltip');
        var line = d3.select("#h-line-");
        var dot = d3.select("#dot_1");
        var bisectDate = d3.bisector((d: any) => d.hora ).left;
        var formatValueT = d3.timeFormat("%H:%M%p");

        data_gr.forEach(function(d) {
                    d.hora = new Date(d.hora);
                    d.valor = +d.valor;
              });

        data_gr.forEach(function(d) {
                d.hora = new Date(d.hora);
                d.valor = +d.valor;
          });

        var por = this.width.animVal.value/data_gr.length;
        var aux = d3.mouse(this)[0]/por;
            aux = Number(aux.toFixed(0));


        line.style("opacity", 1)
              .attr("transform", "translate(" + d3.mouse(this)[0] + ")");
        var tem;
            tem = "<div class='text-center container-fluid'style='box-shadow: 2px 2px 5px #999; background-color:#FCB415;width:90px;' >" +
                            "<p style='font-size:11px; color: white; font-weight: bold;' class='letra_D no-margin'>"+data_gr[aux].valor.toFixed(2) +" MWh</p>" +
                            "<p style='font-size:11px; font-weight: bold;' class='letra_D no-margin'>"+formatValueT(data_gr[aux].hora) +"</p>" +
                        "</div>";

        var mouse_x = d3.mouse(this)[0];
             if(mouse_x > this.width.animVal.value - 100){mouse_x = mouse_x - 150};

        //console.log(this.width.animVal.value,mouse_x);

        div_3.style('display','block');
        div_3.transition()
            .duration(500)
            .style("opacity", 0);
        div_3.transition()
            .duration(200)
            .style("opacity", .9);
        div_3.html(tem)
            .style("position","absolute")
            .style("left", mouse_x + "px")
            .style("top", d3.mouse(this)[1] - 50 + "px");
    };

  }

}
