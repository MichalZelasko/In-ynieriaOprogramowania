import { Component, OnInit } from '@angular/core';
import { Chart, registerables} from 'chart.js';
import { AppService } from '../app.service';

@Component({
  selector: 'app-scatter-charts',
  templateUrl: './scatter-charts.component.html',
  styleUrls: ['./scatter-charts.component.css']
})
export class ScatterChartsComponent implements OnInit {

  idHTML: string = " ";
  width: string;
  height: string;
  title: string;
  x_name: string;
  y_name: string;
  data: any;
  chartNumber: any;
  screenNumber: any;
  actualUnit: any;
  unitsList: any;

  constructor(private appService: AppService) { 
    Chart.register(...registerables);
    this.idHTML = "test";
    this.width = "0%";
    this.height = "0%";
    this.title = " ";
    this.x_name = "";
    this.y_name = "";
    this.data = null;
  }

  ngOnInit(): void {
    setTimeout(() =>{
      this.createChart();
      let dat = {
        datasets: [
          {
            label: 'Dataset 1',
            data: [{ x: -8, y: 3 }, { x: 2, y: 8 }, { x: 3, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 2 }, { x: 10, y: 5 }],
            borderColor: '#638c70',
            backgroundColor: '#638c70'
          },
          {
            label: 'Dataset 2',
            data: [{ x: -3, y: 3 }, { x: 5, y: 8 }, { x: 9, y: 9 }, { x: 11, y: 9 }, { x: 13, y: -2 }],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132)'
          }
        ]
      }
    }, 200);
  }

  setValues(id: string, width: string, height: string, title: string, x_name: string, y_name: string, data: any, unitsList: any, chartNumber: number, screenNumber: number, actualUnit: any){
    this.idHTML = id;
    this.height = height;
    this.width = width;
    this.title = title;
    this.data = data;
    this.x_name = x_name;
    this.y_name = y_name;
    this.unitsList = unitsList;
    this.chartNumber = chartNumber;
    this.screenNumber = screenNumber;
    this.actualUnit = actualUnit;
  }

  createChart(){
    var canvas = <HTMLCanvasElement> document.getElementById("test");
    canvas.setAttribute('id', this.idHTML);
    var container = <HTMLElement> document.getElementById("di");
    container.setAttribute('id', "di"+this.idHTML);
    container.setAttribute('style', "width: " + this.width + "; height: " + this.height + ";");
    canvas.setAttribute('width', this.width);
    canvas.setAttribute('height', this.height);

    var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
    const myChart = new Chart(ctx, {
      type: 'scatter',
       data: /* this.data, */{
        datasets: [
          {
            label: 'Dataset 1',
            data: [{ x: -8, y: 3 }, { x: 2, y: 8 }, { x: 3, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 2 }, { x: 10, y: 5 }],
            borderColor: '#638c70',
            backgroundColor: '#638c70'
          },
          {
            label: 'Dataset 2',
            data: [{ x: -3, y: 3 }, { x: 5, y: 8 }, { x: 9, y: 9 }, { x: 11, y: 9 }, { x: 13, y: -2 }],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132)'
          }
        ]
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              font: {
                size: 20
              },
              text: this.y_name
            }
          },
          x: {
            title: {
              display: true,
              font: {
                size: 20
              },
              text: this.x_name
            }
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
  setUnit(unit: string){
    this.appService.chartConvert(unit, this.screenNumber, this.chartNumber).subscribe(() => {
      window.location.reload();
    });
  }
}