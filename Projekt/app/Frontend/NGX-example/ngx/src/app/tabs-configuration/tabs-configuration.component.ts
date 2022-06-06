import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AppService } from '../app.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
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
  flag: boolean = true;
  refreshTime: any;

  constructor(private appService: AppService,  private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.getGeneralInfo();
    setInterval(() => {
      this.appService.refresh().subscribe(() => window.location.reload());
    }, 900000); //this.refreshTime
  }

  getGeneralInfo() {
    this.appService.getGeneralInfo().subscribe(
      res => {
        this.generalInfo = res;
        this.refreshTime = this.generalInfo.refresh_time;
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

  uploadFile(){
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().pipe(
      tap()
    ).subscribe((res) => {
      if(res === "cancel"){
        this.flag = false;
      }
      else{
        if(res.split('.').pop() !== 'json' ){
          alert("Wczytaj poprawny plik (błędne rozszerzenie)");
          this.flag = false;
        }
        else{
          // this.appService.uploadFile(res).subscribe(() => {
          //   this.tabs = [];
          //   this.getGeneralInfo();
          // })
          this.tabs = [];
          this.getGeneralInfo();
        }        
      }
     })
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


