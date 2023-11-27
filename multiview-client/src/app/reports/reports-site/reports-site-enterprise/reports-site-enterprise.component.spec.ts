import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSiteEnterpriseComponent } from './reports-site-enterprise.component';

describe('ReportsSiteEnterpriseComponent', () => {
  let component: ReportsSiteEnterpriseComponent;
  let fixture: ComponentFixture<ReportsSiteEnterpriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSiteEnterpriseComponent]
    });
    fixture = TestBed.createComponent(ReportsSiteEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
