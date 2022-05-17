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
    //i nazwę wykresu i cokolwiek tam jeszcze do pobrania
    this.getChartData(numberOfDatas, i + 1, isChart);
    }
  }

  getChartData(numberOfDatas: number, chartNumber: number, flag: boolean){
    if(!flag){
      this.appService.getData(chartNumber, 1).subscribe(res => {

        var screenHTML = document.getElementById("screen");

        var barc = new SingleValueComponent();
        barc.setValues("Wartość: " + res.data[0].value, "20px", "400px", "50px");
        var newdomElem = appendComponentToBody(this, SingleValueComponent, barc, screenHTML!);

        newdomElem.style.position = 'relative';
        newdomElem.style.top = '15%';
        newdomElem.style.left = '5%';
      });
    } else {
      if(numberOfDatas == 1){
        this.appService.getData(chartNumber, 1).subscribe(res => {
  
          var screenHTML = document.getElementById("screen");

          var barc = new BarChartsComponent();
          barc.setValues(undefined, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, res.data);
          var newdomElem = appendComponentToBody(this, BarChartsComponent, barc, screenHTML!);
  
          newdomElem.style.position = 'relative';
          newdomElem.style.top = '0%';
          newdomElem.style.left = '0%';
          newdomElem.style.height = '100%';
          newdomElem.style.width = '100%';
        });
      }

      else{
        let colors = ['#638c70', '#c7aa5a']
        let results: LooseObject = {}; 
        let result: any = {datasets: []}; 
        for(let i = 1; i <= numberOfDatas; i++){
          console.log("WYKRES NUMER: " + chartNumber + " DANA NUMER: " + i);
          this.appService.getData(chartNumber, i).subscribe(res => {
            for(let element of Object.keys(res.data)){
              renameProperties(res.data[element]);
            }
            results[i] = {label: "Data Label " + i, data: res.data, borderColor: colors[i-1], backgroundColor: colors[i-1]};//res.data;
            result['datasets'][i-1] = results[i];
          });
        }

        var screenHTML = document.getElementById("screen");

        // not important for now
        var barc = new ScatterChartsComponent();
        barc.setValues(chartNumber.toString(), "700px", "400px");//, result);
        var newdomElem = appendComponentToBody(this, ScatterChartsComponent, barc, screenHTML!);

        newdomElem.style.position = 'relative';
        newdomElem.style.top = '5%';
        newdomElem.style.left = '5%';
        newdomElem.style.display = 'inline-block';

        var barc2 = new LineChartsComponent();
        barc2.setValues(chartNumber.toString(), "900px", "500px", result);
        var newdomElem2 = appendComponentToBody(this, LineChartsComponent, barc2, screenHTML!);

        newdomElem2.style.position = 'relative';
        newdomElem2.style.top = '10%';
        newdomElem2.style.left = '150px';
        newdomElem2.style.display = 'inline-block';

      }
    }
  }
}

interface LooseObject {
  [key: string]: any
}
