import { Component, OnInit } from '@angular/core';
import { productSales, productSalesMulti, testjson } from '../../data/products';

declare var require: any;

@Component({
  selector: 'app-second-screen',
  templateUrl: './second-screen.component.html',
  styleUrls: ['./second-screen.component.css']
})
export class SecondScreenComponent implements OnInit {

  productS: any[];
  productSM: any[];
  testjs: any[];
  actualData: any[];

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

  constructor() { 
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
    this.getData();
  }

}
