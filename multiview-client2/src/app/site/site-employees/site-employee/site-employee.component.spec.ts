import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeComponent } from './site-employee.component';

describe('SiteEmployeeComponent', () => {
  let component: SiteEmployeeComponent;
  let fixture: ComponentFixture<SiteEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
