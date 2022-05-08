import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { productSales, productSalesMulti, testjson } from '../../data/products';

declare var require: any;

@Component({
  selector: 'app-first-screen',
  templateUrl: './first-screen.component.html',
  styleUrls: ['./first-screen.component.css']
})
export class FirstScreenComponent implements OnInit {

  productS: any[];
  productSM: any[];
  testjs: any[];
  actualData: any[];
  numberOfCharts: any;
  screenInfo: any;
  charts: any;
  chart_data: any;
  datas: any;

  view: [number, number] = [900,570];
  colorScheme = { domain: ['#596d5f', '#5d7765', '#60816b', '#638c70', '#679676', '#6aa17c', '#6cab82', '#6fb688', '#72c18e'] };
  gradient: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legendTitle: string = "Products";
  legendTitleMulti: string = "Months";
  legendPosition: string = "below";
  legend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = "Date";
  yAxisLabel: string = "Tepmerature";
  showGridLines: boolean = true;
  showDataLabel: boolean = true;
  barPadding: number = 3;
  tooltipDisabled: boolean = false;
  roundEdges: boolean = false;

  constructor(private appService: AppService) { 
    this.productS = productSales;
    this.productSM = productSalesMulti;
    this.testjs = testjson;
    this.actualData = [];
    
  }

  getData(): void{
    var json = require('../../../../../../../resources/data.json');
    this.actualData = json.data;
  }

  ngOnInit(): void {
    this.getFirstScreenInfo();
    this.getData();
  }

  getFirstScreenInfo(){
    this.appService.getScreenInfo(1).subscribe(res => {
      console.log("Dane ekranu pierwszego:" )
      console.log(res);
      this.screenInfo = res;
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
    this.getChartData(numberOfDatas, i + 1);
    }
  }

  getChartData(numberOfDatas: number, chartNumber: number){
    for(let i = 1; i <= numberOfDatas; i++){
      this.appService.getData(chartNumber, i).subscribe(res => {
        console.log("Dane dla wykresu numer: " + chartNumber + "dane numer: " + i)
        console.log(res);
      });
    }
  }

}
