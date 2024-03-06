import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMidScheduleComponent } from './site-mid-schedule.component';

describe('SiteMidScheduleComponent', () => {
  let component: SiteMidScheduleComponent;
  let fixture: ComponentFixture<SiteMidScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteMidScheduleComponent]
    });
    fixture = TestBed.createComponent(SiteMidScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
