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

  // tabs = [
  //   new Tab('Ekran 1', FIRST_SCREEN_PATH),
  //   new Tab('Ekran 2', SECOND_SCREEN_PATH),
  //   new Tab('Ekran 3', THIRD_SCREEN_PATH),
  // ]

  createScreens(numberOfScreens: number){
    // for(var i = 1; i <= numberOfScreens; i++){
    //   console.log('Ekran ' + i + ' HALO ' + i + 'screen')
    //   this.tabs.push(new Tab('Ekran ' + i, i + 'screen'))
    // }
    // this.tabs.push(new Tab('Ekran 1', FIRST_SCREEN_PATH))
  }

  getGeneralInfo() {
    this.appService.getGeneralInfo().subscribe(
      res => {
        this.generalInfo = res;
        console.log(this.generalInfo);
      });
  }

}


