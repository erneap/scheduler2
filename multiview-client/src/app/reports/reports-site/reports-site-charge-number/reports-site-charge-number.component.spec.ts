import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSiteChargeNumberComponent } from './reports-site-charge-number.component';

describe('ReportsSiteChargeNumberComponent', () => {
  let component: ReportsSiteChargeNumberComponent;
  let fixture: ComponentFixture<ReportsSiteChargeNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSiteChargeNumberComponent]
    });
    fixture = TestBed.createComponent(ReportsSiteChargeNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
