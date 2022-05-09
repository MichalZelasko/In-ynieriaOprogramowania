import { Component, OnInit } from '@angular/core';
import { greens } from "../esthetics/colorSchemes";

declare var require: any;

@Component({
  selector: 'app-line-charts',
  templateUrl: './line-charts.component.html',
  styleUrls: ['./line-charts.component.css']
})

export class LineChartsComponent implements OnInit {
  actualData: any[];

  view: [number, number] = [900,570];
  colorScheme = greens;
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
  tooltipDisabled: boolean = false;

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

  setValues(view: [number, number] = [900,570], 
            colorscheme: any = greens,
            xAxis: boolean = true, 
            yAxis: boolean = true, 
            legendTitle: string = "Legend",
            legendPosition: string = "below",
            legend: boolean = true,
            showXAxisLabel: boolean = false,
            showYAxisLabel: boolean = false,
            xAxisLabel: string = "",
            yAxisLabel: string = "",
            showGridLines: boolean = false,
            tooltipDisabled: boolean = false) {

    this.view = view;
    this.colorScheme = colorscheme;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.legendTitle = legendTitle;
    this.legendPosition = legendPosition;
    this.legend = legend;
    this.showXAxisLabel = showXAxisLabel;
    this.showYAxisLabel = showYAxisLabel;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
    this.showGridLines = showGridLines;
    this.tooltipDisabled = tooltipDisabled;
  }
}
