import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestLegendComponent } from './employee-leave-request-legend.component';

describe('EmployeeLeaveRequestLegendComponent', () => {
  let component: EmployeeLeaveRequestLegendComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestLegendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestLegendComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
