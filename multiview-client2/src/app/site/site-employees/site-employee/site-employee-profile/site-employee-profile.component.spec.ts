import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeProfileComponent } from './site-employee-profile.component';

describe('SiteEmployeeProfileComponent', () => {
  let component: SiteEmployeeProfileComponent;
  let fixture: ComponentFixture<SiteEmployeeProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeProfileComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
