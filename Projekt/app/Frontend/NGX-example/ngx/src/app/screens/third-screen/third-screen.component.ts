import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { productSales, productSalesMulti, testjson } from '../../data/products';

declare var require: any;

@Component({
  selector: 'app-third-screen',
  templateUrl: './third-screen.component.html',
  styleUrls: ['./third-screen.component.css']
})
export class ThirdScreenComponent implements OnInit {


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

  constructor(private appService: AppService) { 
    this.actualData = [];
  }

  getData(): void{
    var json = require('../../../../../../../resources/data.json');

    this.actualData = json.data;
  }

  ngOnInit(): void {
    // this.getThirdScreenInfo();
    this.getData();
  }

  // BRAK DANYCH!
  getThirdScreenInfo(){
    this.appService.getScreenInfo(3).subscribe(res => {
      console.log(res);
    })
  }

}
