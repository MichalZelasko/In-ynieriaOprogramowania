import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { TabsConfigurationComponent } from './tabs-configuration/tabs-configuration.component';
import { LineChartsComponent } from './line-charts/line-charts.component'
import { FlexLayoutModule } from '@angular/flex-layout';
import { GroupedBarChartsComponent } from './grouped-bar-charts/grouped-bar-charts.component'

@NgModule({
  declarations: [
    AppComponent,
    BarChartsComponent,
    LineChartsComponent,
    TabsConfigurationComponent,
    GroupedBarChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    MatTabsModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
