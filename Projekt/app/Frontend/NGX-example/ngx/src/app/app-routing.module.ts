import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartsComponent } from './bar-charts/bar-charts.component';
import { GroupedBarChartsComponent } from './grouped-bar-charts/grouped-bar-charts.component';
import { LineChartsComponent } from './line-charts/line-charts.component';
import { FIRST_SCREEN_PATH, SECOND_SCREEN_PATH, THIRD_SCREEN_PATH } from './tabs-configuration/paths';
import { TabsConfigurationComponent } from './tabs-configuration/tabs-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: TabsConfigurationComponent,
    children: [
        {
            path: '',
            redirectTo: FIRST_SCREEN_PATH,
            pathMatch: 'full'
        },
        {
            path: FIRST_SCREEN_PATH,
            component: BarChartsComponent
        },
        {
          path: SECOND_SCREEN_PATH,
          component: LineChartsComponent
        },
        {
          path: THIRD_SCREEN_PATH,
          component: GroupedBarChartsComponent
      },
    ]
  }
]
;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
