import { Component, OnInit } from '@angular/core';
import { TreeMapModule } from '@swimlane/ngx-charts';

declare var require: any;

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.css']
})
export class BarChartsComponent implements OnInit {
  actualData: any[];

  view: [number, number] = [900,570];
  colorScheme = { domain: ['#596d5f', '#5d7765', '#60816b', '#638c70', '#679676', '#6aa17c', '#6cab82', '#6fb688', '#72c18e'] };
  gradient: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legendTitle: string = "Products";
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

  constructor(){
    this.actualData = [];
  }

  getData(): void{
    var json = require('../../../../../../resources/data.json');

    this.actualData = json.data;
  }

  ngOnInit(): void {
    this.getData();
  }

  setValues(view: [number, number], 
            colorscheme: any, 
            gradient: boolean, 
            xAxis: boolean, 
            yAxis: boolean, 
            legendTitle: string,
            legendPosition: string,
            legend: boolean,
            showXAxisLabel: boolean,
            showYAxisLabel: boolean,
            xAxisLabel: string,
            yAxisLabel: string,
            showGridLines: boolean,
            showDataLabel: boolean,
            barPadding: number,
            tooltipDisabled: boolean,
            roundEdges: boolean) {
    //finish this thing...

  }

}