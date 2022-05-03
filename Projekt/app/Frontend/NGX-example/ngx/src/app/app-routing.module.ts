import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstScreenComponent } from './screens/first-screen/first-screen.component';
import { FourthScreenComponent } from './screens/fourth-screen/fourth-screen.component';
import { SecondScreenComponent } from './screens/second-screen/second-screen.component';
import { ThirdScreenComponent } from './screens/third-screen/third-screen.component';
import { FIRST_SCREEN_PATH, FOURTH_SCREEN_PATH, SECOND_SCREEN_PATH, THIRD_SCREEN_PATH } from './tabs-configuration/paths';
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
            component: FirstScreenComponent
        },
        {
          path: SECOND_SCREEN_PATH,
          component: SecondScreenComponent
        },
        {
          path: THIRD_SCREEN_PATH,
          component: ThirdScreenComponent
        },
        {
          path: FOURTH_SCREEN_PATH,
          component: FourthScreenComponent
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
