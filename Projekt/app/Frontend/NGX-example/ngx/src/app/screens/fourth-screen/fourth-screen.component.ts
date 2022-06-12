import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appendComponentToBody } from 'src/app/addComponent';
import { AppService } from 'src/app/app.service';
import { BarChartsComponent } from 'src/app/bar-charts/bar-charts.component';
import { LineChartsComponent } from 'src/app/line-charts/line-charts.component';
import { ScatterChartsComponent } from 'src/app/scatter-charts/scatter-charts.component';
import { SingleValueComponent } from 'src/app/single-value/single-value.component';
import * as schemes from 'src/app/esthetics/colorSchemes';

function renameProperties(obj) {
  obj['x'] = obj['name'];
  obj['y'] = obj['value'];
  delete obj['name'];
  delete obj['value'];
}

declare var require: any;

@Component({
  selector: 'app-fourth-screen',
  templateUrl: './fourth-screen.component.html',
  styleUrls: ['./fourth-screen.component.css']
})
export class FourthScreenComponent implements OnInit {

  chartsData: any[];
  actualData: any[];
  unitsList: any[];
  numberOfCharts: any;
  screenInfo: any;
  charts: any;
  chart_data: any;
  datas: any;
  reload: boolean = true;
  actualUnit: any;


  view: [number, number] = [900,570];
  colorScheme = { domain: ['#596d5f', '#5d7765', '#60816b', '#638c70', '#679676', '#6aa17c', '#6cab82', '#6fb688', '#72c18e'] };
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = "Date";
  yAxisLabel: string = "Tepmerature";
  showDataLabel: boolean = false;

  constructor(private appService: AppService, private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector, private router: Router) { 
    this.actualData = [];
    this.chartsData = [];
    this.unitsList = [];
  }


  ngOnInit(): void {
    if(this.reload){
      this.getFourthScreenInfo();
      this.reload = false;
    }
  }

  getFourthScreenInfo(){
    this.appService.getScreenInfo(4).subscribe(res => {
      this.screenInfo = res;
      this.numberOfCharts = this.screenInfo.chart_on_screen_number
      this.getChartsData(this.numberOfCharts)
    })
  }

  getChartsData(chartsNumber: number){
    for(let i = 0; i < chartsNumber; i++){
    let isChart: boolean = true;
    this.charts = this.screenInfo.charts;
    this.chart_data = Object.values(this.charts)[i];
    this.actualUnit = this.chart_data.unit;
    this.datas = this.chart_data.data_list;
    this.unitsList = this.chart_data.enabled_units;
    if(!this.chart_data.is_chart){
      isChart = false;
    }
    var numberOfDatas = Object.keys(this.datas).length;
    //TODO pobrac polozenie
    this.getChartData(numberOfDatas, i + 1, isChart);
    }
  }

  getChartData(numberOfDatas: number, chartNumber: number, flag: boolean){
    numberOfDatas -= 1;
    if(!flag){
      this.appService.getData(4, chartNumber, 1).subscribe(res => {

        let screenHTML = document.getElementById("screen");

        let barc = new SingleValueComponent();
        barc.setValues("Wartość: " + res.data[0].value, "20px", this.chart_data.horizontal.size, this.chart_data.vertical.size);
        let newdomElem = appendComponentToBody(this, SingleValueComponent, barc, screenHTML!);

        newdomElem.style.position = 'absolute';
        newdomElem.style.top = this.chart_data.vertical.position;
        newdomElem.style.left = this.chart_data.horizontal.position;
        newdomElem.style.backgroundColor = "#ebebeb";
        newdomElem.style.padding = "1%";
        newdomElem.style.borderRadius = "4%";
      });
    } else {
      if(numberOfDatas == 1){
        if(this.chart_data.type == "histogram"){
          this.appService.getData(4, chartNumber, 1).subscribe(res => {
          
            let screenHTML = document.getElementById("screen");
      
            let unit = "";
            if(this.chart_data.unit != null){
              unit = " [" + this.chart_data.unit + "]";
            }
      
            var barc = new BarChartsComponent(this.appService);
            barc.setValues([Math.floor(this.chart_data.horizontal.size.substring(0, this.chart_data.horizontal.size.length - 2)), Math.floor(this.chart_data.vertical.size.substring(0, this.chart_data.vertical.size.length - 2)) - 100], 
                            schemes[this.chart_data.data_list.color], 
                            undefined, 
                            undefined, 
                            undefined, 
                            undefined, 
                            false, 
                            true, 
                            true, 
                            this.
                            chart_data.x_name, 
                            this.chart_data.y_name + unit, 
                            undefined, 
                            false, 
                            undefined, 
                            undefined, 
                            res.data, 
                            this.unitsList, 
                            chartNumber, 
                            4, 
                            this.actualUnit);
            var newdomElem = appendComponentToBody(this, BarChartsComponent, barc, screenHTML!);
      
            newdomElem.style.position = 'absolute';
            newdomElem.style.top = this.chart_data.vertical.position;
            newdomElem.style.left = this.chart_data.horizontal.position;
            newdomElem.style.height = this.chart_data.vertical.size;
            newdomElem.style.display = 'inline-block';
            newdomElem.style.backgroundColor = "#ebebeb";
            newdomElem.style.padding = "1%";
            newdomElem.style.borderRadius = "7%";
          });
        }
      }
      else{
        if(this.chart_data.type == "linechart"){
          let colors = schemes[this.chart_data.data_list.color].domain;
          let results: LooseObject = {}; 
          let result: any = {datasets: []}; 
          for(let i = 1; i <= numberOfDatas; i++){
            let name = this.chart_data.data_list["data" + i].data_name;
            this.appService.getData(4, chartNumber, i).subscribe(res => {
              for(let element of Object.keys(res.data)){
                renameProperties(res.data[element]);
              }
              results[i] = {label: name, data: res.data, borderColor: colors[i-1], backgroundColor: colors[i-1]};
              result['datasets'][i-1] = results[i];
            });
          }

          let screenHTML = document.getElementById("screen");
      
          let unit = "";
          if(this.chart_data.unit != null){
            unit = " [" + this.chart_data.unit + "]";
          }
      
          let barc = new LineChartsComponent(this.appService);
          barc.setValues(chartNumber.toString(), 
                         this.chart_data.horizontal.size, 
                         Math.floor(this.chart_data.vertical.size.substring(0, this.chart_data.vertical.size.length - 2)) - 100 + "px", 
                         this.chart_data.name, 
                         this.chart_data.x_name, 
                         this.chart_data.y_name + unit, 
                         result, 
                         this.unitsList, 
                         chartNumber, 
                         4, 
                         this.actualUnit);
          let newdomElem = appendComponentToBody(this, LineChartsComponent, barc, screenHTML!);
      
          newdomElem.style.position = 'absolute';
          newdomElem.style.top = this.chart_data.vertical.position;
          newdomElem.style.left = this.chart_data.horizontal.position;
          newdomElem.style.height = this.chart_data.vertical.size;
          newdomElem.style.display = 'inline-block';
          newdomElem.style.backgroundColor = "#ebebeb";
          newdomElem.style.padding = "1%";
          newdomElem.style.borderRadius = "7%";
        }

        if(this.chart_data.type == "scatter"){ 
          let colors = schemes[this.chart_data.data_list.color].domain;
          let results: LooseObject = {}; 
          let result: any = {datasets: []}; 
          for(let i = 1; i < numberOfDatas; i++){
            let name = this.chart_data.data_list["data" + i].data_name;
            this.appService.getData(4, chartNumber, i).subscribe(res => {
              for(let element of Object.keys(res.data)){
                renameProperties(res.data[element]);
              }
              results[i] = {label: name, data: res.data, borderColor: colors[i-1], backgroundColor: colors[i-1]};
              result['datasets'][i-1] = results[i];
            });
          }

          let screenHTML = document.getElementById("screen");
      
          let unit = "";
          if(this.chart_data.unit != null){
            unit = " [" + this.chart_data.unit + "]";
          }
      
          let barc = new ScatterChartsComponent(this.appService);
          barc.setValues(chartNumber.toString(), 
                         this.chart_data.horizontal.size, 
                         Math.floor(this.chart_data.vertical.size.substring(0, this.chart_data.vertical.size.length - 2)) - 100 + "px",
                         this.chart_data.name, 
                         this.chart_data.x_name, 
                         this.chart_data.y_name + unit, 
                         result, 
                         this.unitsList, 
                         chartNumber, 
                         4, 
                         this.actualUnit);
          let newdomElem = appendComponentToBody(this, ScatterChartsComponent, barc, screenHTML!);
      
          newdomElem.style.position = 'absolute';
          newdomElem.style.top = this.chart_data.vertical.position;
          newdomElem.style.left = this.chart_data.horizontal.position;
          newdomElem.style.height = this.chart_data.vertical.size;
          newdomElem.style.display = 'inline-block';
          newdomElem.style.backgroundColor = "#ebebeb";
          newdomElem.style.padding = "1%";
          newdomElem.style.borderRadius = "7%";
        }
      }
    }
  }
  refresh(){
    let myNode = document.getElementById("screen");
    myNode!.replaceChildren();
    this.appService.refresh().subscribe(() => this.getFourthScreenInfo())
  }

}

interface LooseObject {
  [key: string]: any
}
