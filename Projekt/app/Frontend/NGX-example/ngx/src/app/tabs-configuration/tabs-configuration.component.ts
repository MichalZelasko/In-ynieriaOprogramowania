import { Component, OnInit } from '@angular/core';
import { FIRST_SCREEN_PATH, SECOND_SCREEN_PATH, THIRD_SCREEN_PATH } from './paths';
import { Tab } from './tabs';

@Component({
  selector: 'app-tabs-configuration',
  templateUrl: './tabs-configuration.component.html',
  styleUrls: ['./tabs-configuration.component.css']
})
export class TabsConfigurationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tabs = [
    new Tab('Ekran 1', FIRST_SCREEN_PATH),
    new Tab('Ekran 2', SECOND_SCREEN_PATH),
    new Tab('Ekran 3', THIRD_SCREEN_PATH),
  ]

}
