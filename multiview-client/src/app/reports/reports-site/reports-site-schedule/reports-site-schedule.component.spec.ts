import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSiteScheduleComponent } from './reports-site-schedule.component';

describe('ReportsSiteScheduleComponent', () => {
  let component: ReportsSiteScheduleComponent;
  let fixture: ComponentFixture<ReportsSiteScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSiteScheduleComponent]
    });
    fixture = TestBed.createComponent(ReportsSiteScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
