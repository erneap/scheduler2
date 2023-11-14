import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeLeaveBalanceYearComponent } from './site-employee-leave-balance-year.component';

describe('SiteEmployeeLeaveBalanceYearComponent', () => {
  let component: SiteEmployeeLeaveBalanceYearComponent;
  let fixture: ComponentFixture<SiteEmployeeLeaveBalanceYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeLeaveBalanceYearComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeLeaveBalanceYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
