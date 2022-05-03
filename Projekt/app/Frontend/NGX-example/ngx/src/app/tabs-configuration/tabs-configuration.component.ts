import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FIRST_SCREEN_PATH, SECOND_SCREEN_PATH, THIRD_SCREEN_PATH } from './paths';
import { Tab } from './tabs';

@Component({
  selector: 'app-tabs-configuration',
  templateUrl: './tabs-configuration.component.html',
  styleUrls: ['./tabs-configuration.component.css']
})
export class TabsConfigurationComponent implements OnInit {

  numberOfScreens: any;
  generalInfo: any;
  tabs: Tab[] = [];

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.getGeneralInfo();
  }

  createScreens(numberOfScreens: number){
    for(var i = 1; i <= numberOfScreens && i <= 4; i++){
      const path = this.makePath(i);
      this.tabs.push(new Tab('Ekran ' + i, path + '-screen'))
    }
  }

  getGeneralInfo() {
    // JAK OGARNIEMY API TO BD TO JAKOS TAK WYGLADALO
    
    // this.appService.getGeneralInfo().subscribe(
    //   res => {
    //     this.generalInfo = res;
    //   });
    // this.numberOfScreens = this.generalInfo.screens
    // this.createScreens(this.numberOfScreens)

    //NA RAZIE ZMOCKOWANE DANE, SPRAWDZENIE CZY DZIALA 
    this.createScreens(4)
  }

  makePath(number: number){
    switch (number) {
      case 1:
        return "first";
      case 2:
        return "second";
      case 3:
        return "third";
      case 4:
        return "fourth";
      default:
        return "err";
    }
  }

}


