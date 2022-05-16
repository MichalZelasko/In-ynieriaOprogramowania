import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-value',
  templateUrl: './single-value.component.html',
  styleUrls: ['./single-value.component.css']
})
export class SingleValueComponent implements OnInit {

  actualData: any;
  fontSize: string = "";

  constructor(){
    this.actualData = [];
  }

  ngOnInit(): void {
    this.createText();
  }

  setValues(actualData: any, fontSize: string) {
    this.actualData = actualData;
    this.fontSize = fontSize;

  }

  createText(){
    var text = <HTMLElement> document.getElementById("text");
    text.style.fontSize = this.fontSize;
  }

}
