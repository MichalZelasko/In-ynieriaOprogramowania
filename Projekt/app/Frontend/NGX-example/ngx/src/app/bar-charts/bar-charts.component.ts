import { Component, OnInit } from '@angular/core';
import { TreeMapModule } from '@swimlane/ngx-charts';
import { productSales, productSalesMulti } from '../data/products';

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.css']
})
export class BarChartsComponent implements OnInit {

  productS: any[];
  productSM: any[];
  view: [number, number] = [700,370];
  colorScheme = { domain: ['#32a852', '#4f2459', '#4336a8', '#7c337d', '#bdb953'] };
  gradient: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legendTitle: string = "Products";
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
    Object.assign(this.productS, productSales);
    Object.assign(this.productSM, productSalesMulti);
  }

  ngOnInit(): void {
  }

}
