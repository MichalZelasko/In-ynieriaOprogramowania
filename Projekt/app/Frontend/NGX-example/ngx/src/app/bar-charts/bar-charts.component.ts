import { Component, OnInit } from '@angular/core';
import { TreeMapModule } from '@swimlane/ngx-charts';
import { productSales, productSalesMulti,testjson } from '../data/products';

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.css']
})
export class BarChartsComponent implements OnInit {

  productS: any[];
  productSM: any[];
  testjs: any[];
  view: [number, number] = [900,570];
  colorScheme = { domain: ['#020305', '#4f2459', '#4336a8', '#7c337d', '#bdb953'] };
  gradient: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legendTitle: string = "Productsss";
  legendTitleMulti: string = "Months";
  legendPosition: string = "below";
  legend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = "Products";
  yAxisLabel: string = "Sales";
  showGridLines: boolean = true;
  showDataLabel: boolean = true;
  barPadding: number = 5;
  tooltipDisabled: boolean = false;
  roundEdges: boolean = false;

  constructor() { 
    this.productS = productSales;
    this.productSM = productSalesMulti;
    this.testjs = testjson;
    Object.assign(this.productS, productSales);
    Object.assign(this.productSM, productSalesMulti);
    Object.assign(this.testjs, testjson);
  }

  ngOnInit(): void {
  }

}
