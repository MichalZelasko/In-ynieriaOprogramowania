import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScatterComponent } from './new-scatter.component';

describe('NewScatterComponent', () => {
  let component: NewScatterComponent;
  let fixture: ComponentFixture<NewScatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewScatterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
