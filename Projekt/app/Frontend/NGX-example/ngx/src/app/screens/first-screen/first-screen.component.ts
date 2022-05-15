import { ApplicationRef, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { productSales, productSalesMulti, testjson } from '../../data/products';
import { appendComponentToBody } from '../../addComponent';
import { SecondScreenComponent } from '../../screens/second-screen/second-screen.component';
import { BarChartsComponent } from 'src/app/bar-charts/bar-charts.component';
import { elementAt } from 'rxjs';
import { SingleValueComponent } from 'src/app/single-value/single-value.component';

declare var require: any;

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

  getData(): void{
    var json = require('../../../../../../../resources/data.json');
    this.actualData = json.data;
  }

  ngOnInit(): void {
    this.getFirstScreenInfo();
    // this.getData();
  }

  getFirstScreenInfo(){
    this.appService.getScreenInfo(1).subscribe(res => {
      this.screenInfo = res;
      console.log(this.screenInfo)
      this.numberOfCharts = this.screenInfo.chart_on_screen_number
      this.getChartsData(this.numberOfCharts)
    })
  }

  getChartsData(chartsNumber: number){
    for(let i = 0; i < chartsNumber; i++){
    this.charts = this.screenInfo.charts;
    this.chart_data = Object.values(this.charts)[i];
    this.datas = this.chart_data.data_list;
    var numberOfDatas = Object.keys(this.datas).length;
    //TODO pobrac polozenie
    this.getChartData(numberOfDatas, i + 1);
    }
  }

  getChartData(numberOfDatas: number, chartNumber: number){
    if(numberOfDatas == 1){
      this.appService.getData(chartNumber, 1).subscribe(res => {

        var barc = new BarChartsComponent();
        // var barc = new SingleValueComponent();
        //Set desired values
        barc.setValues(undefined, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, res.data);
        // barc.setValues("TESTTTTTTTTTT");
        //Add component to HTML
        var newdomElem = appendComponentToBody(this, SingleValueComponent, barc);

        newdomElem.style.position = 'relative';
        newdomElem.style.top = '40%';
        newdomElem.style.left = '50%';
      });
    }
    else{
      let result: LooseObject = {}; 
      for(let i = 1; i <= numberOfDatas; i++){
        console.log("WYKRES NUMER: " + chartNumber + " DANA NUMER: " + i);
        this.appService.getData(chartNumber, i).subscribe(res => {
          result[i] = res.data;
        });
      }
      var barc = new BarChartsComponent();
        //Set desired values
        barc.setValues(undefined, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, result);
        //Add component to HTML
        var newdomElem = appendComponentToBody(this, BarChartsComponent, barc);
    }
  }

}

interface LooseObject {
  [key: string]: any
}
