import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { productSales, productSalesMulti, testjson } from '../../data/products';
import { appendComponentToBody } from '../../addComponent';
import { SecondScreenComponent } from '../../screens/second-screen/second-screen.component';
import { BarChartsComponent } from 'src/app/bar-charts/bar-charts.component';
import { elementAt } from 'rxjs';
import { SingleValueComponent } from 'src/app/single-value/single-value.component';
import { ScatterChartsComponent } from 'src/app/scatter-charts/scatter-charts.component';
import { LinearScale, LineController } from 'chart.js';
import { LineChartsComponent } from 'src/app/line-charts/line-charts.component';
import * as schemes from 'src/app/esthetics/colorSchemes';


function renameProperties(obj) {
  obj['x'] = obj['name'];
  obj['y'] = obj['value'];
  delete obj['name'];
  delete obj['value'];
}

@Component({
  selector: 'app-first-screen',
  templateUrl: './first-screen.component.html',
  styleUrls: ['./first-screen.component.css']
})
export class FirstScreenComponent implements OnInit {

  chartsData: any[];
  actualData: any[];
  numberOfCharts: any;
  screenInfo: any;
  charts: any;
  chart_data: any;
  datas: any;
  reload: boolean = true;


  view: [number, number] = [900,570];
  colorScheme = { domain: ['#596d5f', '#5d7765', '#60816b', '#638c70', '#679676', '#6aa17c', '#6cab82', '#6fb688', '#72c18e'] };
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = "Date";
  yAxisLabel: string = "Tepmerature";
  showDataLabel: boolean = false;

  constructor(private appService: AppService, private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) { 
    this.actualData = [];
    this.chartsData = [];
  }


  ngOnInit(): void {
    if(this.reload){
      this.getFirstScreenInfo();
      this.reload = false;
    }
  }

  getFirstScreenInfo(){
    this.appService.getScreenInfo(1).subscribe(res => {
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
    this.datas = this.chart_data.data_list;
    if(!this.chart_data.is_chart){
      isChart = false;
    }
    var numberOfDatas = Object.keys(this.datas).length;
    //TODO pobrac polozenie
    this.getChartData(numberOfDatas, i + 1, isChart);
    }
  }

  getChartData(numberOfDatas: number, chartNumber: number, flag: boolean){
    if(!flag){
      this.appService.getData(chartNumber, 1).subscribe(res => {

        let screenHTML = document.getElementById("screen");

        let barc = new SingleValueComponent();
        barc.setValues("Wartość: " + res.data[0].value, "20px", "300px", "15px");
        let newdomElem = appendComponentToBody(this, SingleValueComponent, barc, screenHTML!);

        newdomElem.style.position = 'absolute';
        newdomElem.style.top = '700px';
        newdomElem.style.left = '70px';
        newdomElem.style.backgroundColor = "#ebebeb";
        newdomElem.style.padding = "1%";
        newdomElem.style.borderRadius = "4%";
      });
    } else {
      if(numberOfDatas == 1){
        if(this.chart_data.type == "barchart"){
          this.appService.getData(chartNumber, 1).subscribe(res => {
          
            let screenHTML = document.getElementById("screen");
  
            let barc = new BarChartsComponent();
            barc.setValues(undefined, this.chart_data.data_list.color, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, res.data);
            let newdomElem = appendComponentToBody(this, BarChartsComponent, barc, screenHTML!);
    
            newdomElem.style.position = 'relative';
            newdomElem.style.top = '600px';
            newdomElem.style.left = '600px';
            newdomElem.style.height = '50px';
            newdomElem.style.width = '200px';
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
          console.log(this.chart_data.data_list.color);
          let results: LooseObject = {}; 
          let result: any = {datasets: []}; 
          for(let i = 1; i < numberOfDatas; i++){
            console.log("WYKRES NUMER: " + chartNumber + " DANA NUMER: " + i);
            let name = this.chart_data.data_list["data" + i].data_name;
            this.appService.getData(chartNumber, i).subscribe(res => {
              console.log(res);
              for(let element of Object.keys(res.data)){
                renameProperties(res.data[element]);
              }
              results[i] = {label: name, data: res.data, borderColor: colors[i-1], backgroundColor: colors[i-1]};
              result['datasets'][i-1] = results[i];
            });
          }

          let screenHTML = document.getElementById("screen");

          let barc = new LineChartsComponent();
          barc.setValues(chartNumber.toString(), "900px", "500px", this.chart_data.name, this.chart_data.x_name, this.chart_data.y_name + " [" + this.chart_data.unit + "]", result);
          let newdomElem = appendComponentToBody(this, LineChartsComponent, barc, screenHTML!);

          newdomElem.style.position = 'absolute';
          newdomElem.style.top = '100px';
          newdomElem.style.left = '850px';
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
            console.log("WYKRES NUMER: " + chartNumber + " DANA NUMER: " + i);
            let name = this.chart_data.data_list["data" + i].data_name;
            this.appService.getData(chartNumber, i).subscribe(res => {
              for(let element of Object.keys(res.data)){
                renameProperties(res.data[element]);
              }
              results[i] = {label: name, data: res.data, borderColor: colors[i-1], backgroundColor: colors[i-1]};
              result['datasets'][i-1] = results[i];
            });
          }

          let screenHTML = document.getElementById("screen");

          let barc = new ScatterChartsComponent();
          barc.setValues(chartNumber.toString(), "700px", "500px", this.chart_data.name, this.chart_data.x_name, this.chart_data.y_name, result);
          let newdomElem = appendComponentToBody(this, ScatterChartsComponent, barc, screenHTML!);
  
          newdomElem.style.position = 'absolute';
          newdomElem.style.top = '10%';
          newdomElem.style.left = '70px';
          newdomElem.style.display = 'inline-block';
          newdomElem.style.backgroundColor = "#ebebeb";
          newdomElem.style.padding = "1%";
          newdomElem.style.borderRadius = "7%";
        }
      }
    }
  }
}

interface LooseObject {
  [key: string]: any
}
