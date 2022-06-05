import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { FIRST_SCREEN_PATH } from './paths';
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
  reload: boolean = true;

  constructor(private appService: AppService,  private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getGeneralInfo();
    setInterval(() => {
      this.appService.refresh().subscribe(() => window.location.reload());
    }, 900000); 
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
    this.router.navigateByUrl('app/' + FIRST_SCREEN_PATH);
  }

  uploadFile(){
    this.router.navigateByUrl('');
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


