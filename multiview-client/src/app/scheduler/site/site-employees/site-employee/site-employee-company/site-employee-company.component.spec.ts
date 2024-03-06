import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeCompanyComponent } from './site-employee-company.component';

describe('SiteEmployeeCompanyComponent', () => {
  let component: SiteEmployeeCompanyComponent;
  let fixture: ComponentFixture<SiteEmployeeCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeCompanyComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
