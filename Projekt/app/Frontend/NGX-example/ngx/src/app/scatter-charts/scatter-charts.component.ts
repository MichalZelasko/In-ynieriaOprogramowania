import { Component, OnInit } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts';
import { Chart, registerables} from 'chart.js';

@Component({
  selector: 'app-scatter-charts',
  templateUrl: './scatter-charts.component.html',
  styleUrls: ['./scatter-charts.component.css']
})
export class ScatterChartsComponent implements OnInit {

  idHTML: string = " ";
  width: string = "20%";
  height: string = "20%";

  constructor() { 
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createChart();
  }

  setValues(id: string, width: string, height: string){
    this.idHTML = id;
    this.height = height;
    this.width = width;
  }

  createChart(){
    var canvas = <HTMLCanvasElement> document.getElementById("test");
    canvas.setAttribute('id', this.idHTML);
    canvas.setAttribute('height', this.height);
    canvas.setAttribute('width', this.width);
    var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
    const myChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Dataset 1',
            data: [{ x: -8, y: 3 }, { x: 2, y: 8 }, { x: 3, y: 9 }],
          },
          {
            label: 'Dataset 2',
            data: [{ x: -3, y: 3 }, { x: 5, y: 8 }, { x: 9, y: 9 }],
          }
        ]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  
  }
  
  

}
