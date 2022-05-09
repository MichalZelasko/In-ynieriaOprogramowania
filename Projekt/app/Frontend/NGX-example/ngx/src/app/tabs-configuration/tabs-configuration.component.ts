import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FIRST_SCREEN_PATH, SECOND_SCREEN_PATH, THIRD_SCREEN_PATH } from './paths';
import { Tab } from './tabs';
import { appendComponentToBody } from '../addComponent';
import { FirstScreenComponent } from '../screens/first-screen/first-screen.component';
import { SecondScreenComponent } from '../screens/second-screen/second-screen.component';
import { BarChartsComponent } from '../bar-charts/bar-charts.component';

@Component({
  selector: 'app-tabs-configuration',
  templateUrl: './tabs-configuration.component.html',
  styleUrls: ['./tabs-configuration.component.css']
})
export class TabsConfigurationComponent implements OnInit {

  numberOfScreens: any;
  generalInfo: any;
  tabs: Tab[] = [];

  constructor(private appService: AppService,  private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) { }

  ngOnInit(): void {
    this.getGeneralInfo();

    //Example of component creation:
    //Create component
    var barc = new BarChartsComponent();
    //Set desired values (change that to a function that sets all of them)
    barc.legend = false;
    //Add component to HTML
    var newdomElem = appendComponentToBody(this, BarChartsComponent, barc);
  }

  createScreens(numberOfScreens: number){
    for(var i = 1; i <= numberOfScreens && i <= 4; i++){
      const path = this.makePath(i);
      this.tabs.push(new Tab('Ekran ' + i, path + '-screen'))
    }
  }

  getGeneralInfo() {
    this.appService.getGeneralInfo().subscribe(
      res => {
        this.generalInfo = res;
        console.log("Dane ogólne (w tym ilość ekranów)");
        console.log(this.generalInfo)
        this.numberOfScreens = this.generalInfo.number_of_screens;
        this.createScreens(this.numberOfScreens)
      });
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


