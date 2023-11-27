import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSiteCertOfServiceComponent } from './reports-site-cert-of-service.component';

describe('ReportsSiteCertOfServiceComponent', () => {
  let component: ReportsSiteCertOfServiceComponent;
  let fixture: ComponentFixture<ReportsSiteCertOfServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSiteCertOfServiceComponent]
    });
    fixture = TestBed.createComponent(ReportsSiteCertOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
