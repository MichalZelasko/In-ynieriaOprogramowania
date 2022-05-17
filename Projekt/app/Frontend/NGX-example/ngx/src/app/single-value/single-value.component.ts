import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-value',
  templateUrl: './single-value.component.html',
  styleUrls: ['./single-value.component.css']
})
export class SingleValueComponent implements OnInit {

  actualData: any;
  fontSize: string = "";
  width: string;
  height: string;

  constructor(){
    this.actualData = [];
    this.width = "0%";
    this.height = "0%";
  }

  ngOnInit(): void {
    this.createText();
  }

  setValues(actualData: any, fontSize: string, width: string, height: string) {
    this.actualData = actualData;
    this.fontSize = fontSize;
    this.height = height;
    this.width = width;

  }

  createText(){
    var text = <HTMLElement> document.getElementById("text");
    text.style.fontSize = this.fontSize;
    text.style.height = this.height;
    text.style.width = this.width;
  }

}
