import { BoundElementProperty } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { greens } from "../esthetics/colorSchemes";

declare var require: any;

@Component({
  selector: 'app-line-charts',
  templateUrl: './line-charts.component.html',
  styleUrls: ['./line-charts.component.css']
})

export class LineChartsComponent implements OnInit {

  idHTML: string = " ";
  width: string;
  height: string;
  title: string;


  data: any;

  constructor() { 
    Chart.register(...registerables);
    this.idHTML = "test";
    this.width = "0%";
    this.height = "0%";
    this.data = null;
    this.title = "";
  }

  ngOnInit(): void {
    setTimeout(() =>{
      this.createChart();
      console.log("Line: ");
      console.log(this.data);
    }, 200);
  }

  setValues(id: string, width: string, height: string, title: string, data: any){
    this.idHTML = id;
    this.height = height;
    this.width = width;
    this.data = data;
    this.title = title;
  }

  createChart(){
    var canvas = <HTMLCanvasElement> document.getElementById("test");
    canvas.setAttribute('id', this.idHTML + this.idHTML);
    var container = <HTMLElement> document.getElementById("di");
    container.setAttribute('id', "di"+ this.idHTML + this.idHTML);
    container.setAttribute('style', "width: " + this.width + "; height: " + this.height + ";");
    canvas.setAttribute('width', this.width);
    canvas.setAttribute('height', this.height);

    var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
    const myChart = new Chart(ctx, {
      type: 'line',
      data: this.data,
      options: {
        scales: {
          y: {
            grid: {
              drawBorder: false, // <-- this removes y-axis line
              lineWidth: 0.5,
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 100,
            },
            title: {
              display: true,
              font: {
                size: 20
              },
              text: 'Temperature'
            },
            display: true // Hide Y axis labels
          },
          x: {
            grid: {
              drawBorder: false, // <-- this removes y-axis line
              lineWidth: 0.5,
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 5,
              maxRotation: 0,
              minRotation: 0,
              align: 'start'
            },
            title: {
              display: true,
              font: {
                size: 20
              },
              text: 'Date'
            },
            display: true // Hide X axis labels
          }
          } ,
          elements: {
            point:{
                radius: 0
            }
          },
          plugins: {
            legend: {
              labels: {
                // This more specific font property overrides the global property
                font: {
                    size: 14
                }
              },
              display: true
            },
            title: {
              display: true,
              text: this.title,
              font: {
                size: 16
              }
            }
          }
      }
  });

  }
}
