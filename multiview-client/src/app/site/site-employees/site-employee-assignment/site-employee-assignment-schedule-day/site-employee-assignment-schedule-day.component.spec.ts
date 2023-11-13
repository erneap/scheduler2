import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeAssignmentScheduleDayComponent } from './site-employee-assignment-schedule-day.component';

describe('SiteEmployeeAssignmentScheduleDayComponent', () => {
  let component: SiteEmployeeAssignmentScheduleDayComponent;
  let fixture: ComponentFixture<SiteEmployeeAssignmentScheduleDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeAssignmentScheduleDayComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeAssignmentScheduleDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
