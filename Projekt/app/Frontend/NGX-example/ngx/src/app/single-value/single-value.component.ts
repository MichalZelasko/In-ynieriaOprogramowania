import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-value',
  templateUrl: './single-value.component.html',
  styleUrls: ['./single-value.component.css']
})
export class SingleValueComponent implements OnInit {

  actualData: any;

  constructor(){
    this.actualData = [];
  }

  ngOnInit(): void {
  }

  setValues(actualData: any) {
    this.actualData = actualData;
  }

}
