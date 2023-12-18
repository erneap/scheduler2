import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSiteMidShiftComponent } from './reports-site-mid-shift.component';

describe('ReportsSiteMidShiftComponent', () => {
  let component: ReportsSiteMidShiftComponent;
  let fixture: ComponentFixture<ReportsSiteMidShiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSiteMidShiftComponent]
    });
    fixture = TestBed.createComponent(ReportsSiteMidShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
