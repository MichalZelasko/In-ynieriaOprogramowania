import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { productSales, productSalesMulti, testjson } from '../../data/products';

declare var require: any;

@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})
export class SecondScreenComponent implements OnInit {

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
    // this.getSecondScreenInfo();
    this.getData();
  }

  // BRAK DANYCH!
  getSecondScreenInfo(){
    this.appService.getScreenInfo(2).subscribe(res => {
      console.log(res);
    })
  }

}
