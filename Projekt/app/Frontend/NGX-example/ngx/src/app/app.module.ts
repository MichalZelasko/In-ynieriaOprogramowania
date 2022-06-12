import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { TabsConfigurationComponent } from './tabs-configuration/tabs-configuration.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FirstScreenComponent } from './screens/first-screen/first-screen.component';
import { SecondScreenComponent } from './screens/second-screen/second-screen.component';
import { ThirdScreenComponent } from './screens/third-screen/third-screen.component';
import { FourthScreenComponent } from './screens/fourth-screen/fourth-screen.component';
import {MatIconModule} from '@angular/material/icon';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { LineChartsComponent } from './line-charts/line-charts.component';
import { SingleValueComponent } from './single-value/single-value.component';
import { ScatterChartsComponent } from './scatter-charts/scatter-charts.component'
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StartAppComponent } from './start-app/start-app.component';
import { NewScatterComponent } from './new-scatter/new-scatter.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstScreenComponent,
    TabsConfigurationComponent,
    SecondScreenComponent,
    ThirdScreenComponent,
    FourthScreenComponent,
    BarChartsComponent,
    LineChartsComponent,
    SingleValueComponent,
    ScatterChartsComponent,
    FileUploadComponent,
    StartAppComponent,
    NewScatterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    MatTabsModule,
    MatButtonModule,
    FlexLayoutModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
