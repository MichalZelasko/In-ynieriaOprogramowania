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
  screensData: any[] = [];
  numberOfCharts: any;
  screenInfo: any;
  charts: any;
  chart_data: any;
  datas: any;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.getGeneralInfo();
  }

  getGeneralInfo() {
    this.appService.getGeneralInfo().subscribe(
      res => {
        this.generalInfo = res;
        this.numberOfScreens = this.generalInfo.number_of_screens;
        this.createScreens(this.numberOfScreens)
      });
  }

  createScreens(numberOfScreens: number){
    for(var i = 1; i <= numberOfScreens && i <= 4; i++){
      const path = this.makePath(i);
      this.tabs.push(new Tab('Ekran ' + i, path + '-screen'));
    }
  }

  refresh(){
    window.location.reload();
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


